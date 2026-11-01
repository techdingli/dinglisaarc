import { NextResponse } from "next/server";
import { leadSchema, type LeadInput } from "@/lib/leads";
import { site } from "@/lib/site";
import {
  defaultNotifyTo,
  deliverLead,
  leadReference,
  type LeadRow,
} from "@/lib/lead-delivery";

/** Lead intake for every form on the site. Delivery lives in lib/lead-delivery. */

/** Flatten either lead shape onto the table's browsable columns. */
function toRow(lead: LeadInput, ref: string): LeadRow {
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
    interest: lead.interest || null,
  };
}

function toEmail(lead: LeadInput, ref: string) {
  const lines = Object.entries(lead)
    .filter(([k, v]) => k !== "website" && v !== "" && v != null)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  return {
    to: defaultNotifyTo,
    replyTo: "email" in lead && lead.email ? lead.email : undefined,
    subject: `[${lead.kind.toUpperCase()}] ${ref} - website enquiry`,
    text: `New ${lead.kind} submission (${ref})\n\n${lines}\n`,
  };
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
    return NextResponse.json({ ok: true, reference: leadReference() });
  }

  const ref = leadReference();

  try {
    await deliverLead(toRow(lead, ref), toEmail(lead, ref));

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
