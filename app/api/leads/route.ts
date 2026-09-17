import { NextResponse } from "next/server";
import { leadSchema, type LeadInput } from "@/lib/leads";
import { site } from "@/lib/site";

/**
 * Lead intake for every form on the site.
 *
 * Delivery is pluggable so hosting can be decided later:
 *   - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY -> insert into the `leads` table
 *   - RESEND_API_KEY + LEAD_NOTIFY_TO          -> email notification
 * If neither is configured the lead is logged and still accepted, so the form
 * works in local development.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO ?? site.email.sales;
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM ?? "website@dinglisaarc.com";

function reference() {
  return `DSA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** Flatten either lead shape onto the table's browsable columns. */
function toRow(lead: LeadInput, ref: string) {
  const common = { reference: ref, kind: lead.kind, payload: lead };

  if (lead.kind === "warranty") {
    return {
      ...common,
      name: lead.ownerName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      message: lead.notes || null,
      city: lead.city,
      state: lead.state,
      model: lead.model,
      serial: lead.serial,
    };
  }

  return {
    ...common,
    name: lead.name,
    email: lead.email || null,
    phone: lead.phone,
    company: lead.company || null,
    message: lead.message,
  };
}

async function toSupabase(lead: LeadInput, ref: string) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRow(lead, ref)),
  });

  if (!res.ok) {
    throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  }
  return "supabase";
}

async function toResend(lead: LeadInput, ref: string) {
  if (!RESEND_KEY) return null;

  const lines = Object.entries(lead)
    .filter(([k, v]) => k !== "website" && v !== "" && v != null)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      reply_to: "email" in lead && lead.email ? lead.email : undefined,
      subject: `[${lead.kind.toUpperCase()}] ${ref} - website enquiry`,
      text: `New ${lead.kind} submission (${ref})\n\n${lines}\n`,
    }),
  });

  if (!res.ok) throw new Error(`Resend send failed: ${res.status}`);
  return "email";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Honeypot: pretend success so bots don't learn anything.
  if (lead.website) {
    return NextResponse.json({ ok: true, reference: reference() });
  }

  const ref = reference();

  try {
    const delivered = (
      await Promise.all([toSupabase(lead, ref), toResend(lead, ref)])
    ).filter(Boolean);

    if (delivered.length === 0) {
      console.info(`[lead:${ref}] no sink configured`, lead);
    }

    return NextResponse.json({ ok: true, reference: ref });
  } catch (error) {
    console.error(`[lead:${ref}] delivery failed`, error);
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't submit that. Please call ${site.phone.tollFree}.`,
      },
      { status: 502 },
    );
  }
}
