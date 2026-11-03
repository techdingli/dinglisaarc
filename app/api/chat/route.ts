import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  CHAT_MODEL,
  getChatSystem,
  CHAT_TOOLS,
  createLeadInput,
  type CreateLeadInput,
} from "@/lib/chat";
import { deliverLead, defaultNotifyTo, leadReference } from "@/lib/lead-delivery";
import { site } from "@/lib/site";

/**
 * Website chat assistant.
 *
 * The browser keeps the visible transcript (text only) and posts it on every
 * turn. Prior turns' thinking and tool blocks are never resent, so nothing in
 * the history can go stale; within a turn the full assistant content is kept
 * while the tool loop runs. The reply streams back as NDJSON events:
 *   {"type":"text","text":"..."}       - a chunk of the assistant's reply
 *   {"type":"lead","reference":"..."}  - a lead was created this turn
 *   {"type":"error","message":"..."}   - the turn failed
 */

const NOTIFY_TO = process.env.CHAT_LEAD_NOTIFY_TO || defaultNotifyTo;
const MAX_TOOL_ROUNDS = 4;

const client = new Anthropic();

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(40)
    .refine((m) => m[0].role === "user" && m[m.length - 1].role === "user", {
      message: "Conversation must start and end with the visitor",
    }),
  /** Reference of a lead already created in this conversation, if any. */
  leadRef: z.string().max(20).optional(),
});

type Transcript = z.infer<typeof requestSchema>["messages"];

// Best-effort per-instance throttle. Serverless instances don't share memory,
// so this blunts a single abusive client rather than enforcing a hard quota.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 40;
}

async function createLead(
  input: CreateLeadInput,
  transcript: Transcript,
  previousRef: string | undefined,
) {
  const ref = leadReference();
  const update = previousRef ? ` (update to ${previousRef})` : "";

  const details = [
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email && `Email: ${input.email}`,
    input.company && `Company: ${input.company}`,
    `Interest: ${input.interest}`,
    "",
    "Requirements:",
    input.requirements,
  ]
    .filter((l) => l !== undefined && l !== "")
    .join("\n");

  const conversation = transcript
    .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  await deliverLead(
    {
      reference: ref,
      kind: "chat",
      name: input.name,
      email: input.email || null,
      phone: input.phone,
      company: input.company || null,
      interest: input.interest,
      message: `${previousRef ? `Update to ${previousRef}\n\n` : ""}${input.requirements}`,
      payload: { ...input, previousRef: previousRef ?? null, transcript },
    },
    {
      to: NOTIFY_TO,
      replyTo: input.email || undefined,
      subject: `[CHAT] ${ref}${update} - ${input.interest} - ${input.name}`,
      text: `New chat lead ${ref}${update}\n\n${details}\n\n--- Conversation ---\n\n${conversation}\n`,
    },
  );

  return ref;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Chat is not configured." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (throttled(ip)) {
    return Response.json(
      { error: `Too many messages. Please call ${site.phone.tollFree}.` },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const transcript = parsed.data.messages;
  let leadRef = parsed.data.leadRef;

  const messages: Anthropic.Beta.BetaMessageParam[] = transcript.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      // Separates text written before a tool call from the text after it.
      let wroteText = false;
      let needsBreak = false;

      try {
        const system = await getChatSystem();
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const stream = client.beta.messages.stream({
            model: CHAT_MODEL,
            max_tokens: 16000,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low" },
            system,
            tools: CHAT_TOOLS,
            messages,
          });

          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              if (needsBreak) send({ type: "text", text: "\n\n" });
              needsBreak = false;
              wroteText = true;
              send({ type: "text", text: event.delta.text });
            }
          }
          const message = await stream.finalMessage();

          if (message.stop_reason === "refusal") {
            send({
              type: "text",
              text: `\n\nI can't help with that here. For anything else, call us on ${site.phone.tollFree}.`,
            });
            break;
          }

          const toolUses = message.content.filter(
            (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use",
          );
          if (toolUses.length === 0) break;

          // A tool_use cut off by max_tokens can still look like valid input.
          if (message.stop_reason === "max_tokens") {
            throw new Error("Tool input truncated by max_tokens");
          }
          if (round === MAX_TOOL_ROUNDS) break;

          messages.push({ role: "assistant", content: message.content });

          const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
          for (const use of toolUses) {
            const input = createLeadInput.safeParse(use.input);
            if (use.name !== "create_lead" || !input.success) {
              results.push({
                type: "tool_result",
                tool_use_id: use.id,
                is_error: true,
                content: input.success
                  ? `Unknown tool ${use.name}`
                  : `Invalid input: ${JSON.stringify(input.error.flatten().fieldErrors)}. Check the details with the visitor and try again.`,
              });
              continue;
            }
            try {
              const ref = await createLead(input.data, transcript, leadRef);
              leadRef ??= ref;
              send({ type: "lead", reference: ref });
              results.push({
                type: "tool_result",
                tool_use_id: use.id,
                content: `Lead created. Reference: ${ref}`,
              });
            } catch (error) {
              console.error("[chat] lead delivery failed", error);
              results.push({
                type: "tool_result",
                tool_use_id: use.id,
                is_error: true,
                content: `Saving the lead failed. Apologise and ask the visitor to call ${site.phone.tollFree} or email ${site.email.sales}.`,
              });
            }
          }
          messages.push({ role: "user", content: results });
          needsBreak = wroteText;
        }
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          console.error("[chat] rate limited", error.message);
        } else if (error instanceof Anthropic.APIError) {
          console.error(`[chat] API error ${error.status}`, error.message);
        } else {
          console.error("[chat] failed", error);
        }
        send({
          type: "error",
          message: `Sorry, I couldn't reply just now. Please try again, or call ${site.phone.tollFree}.`,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
