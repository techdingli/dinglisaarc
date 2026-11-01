-- Leads captured by the website chat assistant.
--
-- Same shared Dealer Connect project as 0004 - keep numbering clear of the
-- dealer-connect repo's migrations.
--
-- Adds:
--   - kind 'chat' for leads created by the assistant
--   - interest: the equipment category the visitor is after (chat and the
--     enquiry form's "interest" dropdown), so it can be filtered on directly
-- The full conversation transcript is kept in payload.transcript.

alter table public.leads drop constraint if exists leads_kind_check;
alter table public.leads
  add constraint leads_kind_check
  check (kind in ('contact', 'quote', 'callback', 'warranty', 'chat'));

alter table public.leads add column if not exists interest text;

create index if not exists leads_interest_idx on public.leads (interest);
