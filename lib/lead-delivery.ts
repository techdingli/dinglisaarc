import { site } from "@/lib/site";

/**
 * Lead delivery shared by the website forms (/api/leads) and the chat
 * assistant (/api/chat).
 *
 * Delivery is pluggable so hosting can be decided later:
 *   - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY -> insert into the `leads` table
 *   - RESEND_API_KEY                           -> email notification
 * If neither is configured the lead is logged and still accepted, so the forms
 * work in local development.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM ?? "website@dinglisaarc.com";

/** Row shape of public.leads - see supabase/migrations. */
export type LeadRow = {
  reference: string;
  kind: "contact" | "quote" | "callback" | "warranty" | "chat";
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  interest?: string | null;
  city?: string | null;
  state?: string | null;
  model?: string | null;
  serial?: string | null;
  payload: unknown;
};

export type LeadEmail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export function leadReference() {
  return `DSA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

async function toSupabase(row: LeadRow) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  }
  return "supabase";
}

async function toResend(email: LeadEmail) {
  if (!RESEND_KEY) return null;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [email.to],
      reply_to: email.replyTo || undefined,
      subject: email.subject,
      text: email.text,
    }),
  });

  if (!res.ok) throw new Error(`Resend send failed: ${res.status}`);
  return "email";
}

/** Store the lead and send the notification. Throws if a configured sink fails. */
export async function deliverLead(row: LeadRow, email: LeadEmail) {
  const delivered = (await Promise.all([toSupabase(row), toResend(email)])).filter(
    Boolean,
  );

  if (delivered.length === 0) {
    console.info(`[lead:${row.reference}] no sink configured`, row);
  }
}

export const defaultNotifyTo = process.env.LEAD_NOTIFY_TO ?? site.email.sales;
