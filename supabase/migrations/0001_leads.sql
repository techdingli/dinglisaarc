-- Website lead capture: contact, quote, callback and warranty registrations.
--
-- Writes come exclusively from the Next.js route handler at /api/leads using
-- the service role key, which bypasses RLS. RLS is therefore enabled with no
-- policies at all: nothing reaches this table through the anon or authenticated
-- keys, so the browser can never read or write leads.

create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  reference   text        not null unique,
  kind        text        not null check (kind in ('contact', 'quote', 'callback', 'warranty')),

  -- Flattened for browsing in the Supabase table editor.
  name        text,
  email       text,
  phone       text,
  company     text,
  message     text,
  city        text,
  state       text,
  model       text,   -- warranty: model / SKU
  serial      text,   -- warranty: machine serial number

  -- Full submitted body, so no field is ever lost as the forms evolve.
  payload     jsonb       not null,

  status      text        not null default 'new'
                          check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at  timestamptz not null default now()
);

comment on table public.leads is
  'Form submissions from the public website. Written server-side only.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_kind_idx       on public.leads (kind);
create index if not exists leads_status_idx     on public.leads (status);

alter table public.leads enable row level security;
