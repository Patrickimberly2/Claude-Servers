-- 03 — LeadPulse MVP schema (Supabase/Postgres)
-- Enable extensions
create extension if not exists "pgcrypto";

-- Enums
create type lead_status as enum ('new', 'attempted', 'contacted', 'qualified', 'won', 'lost');
create type message_channel as enum ('sms', 'email');
create type message_status as enum ('queued', 'sent', 'failed');

-- Companies (tenants)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- User profile maps auth user -> company
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- Inbound API tokens (store only hashes)
create table if not exists public.inbound_tokens (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  token_hash text not null unique,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  rotated_at timestamptz
);

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  source text default 'manual',
  source_event_id text,
  first_name text,
  last_name text,
  email text,
  phone text,
  status lead_status not null default 'new',
  won_value numeric(12,2) default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, source, source_event_id)
);

-- Message templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  channel message_channel not null,
  name text not null,
  body text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Outbound messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  channel message_channel not null,
  status message_status not null default 'queued',
  template_id uuid references public.templates(id),
  to_address text not null,
  rendered_body text not null,
  provider_message_id text,
  provider_payload jsonb,
  error_text text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- Provider settings status (do not store raw provider secrets in this table)
create table if not exists public.messaging_configs (
  company_id uuid primary key references public.companies(id) on delete cascade,
  sms_enabled boolean not null default false,
  email_enabled boolean not null default false,
  validated_at timestamptz,
  updated_at timestamptz not null default now()
);

-- Events for audit/analytics
create table if not exists public.events (
  id bigserial primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_leads_company_created_at on public.leads(company_id, created_at desc);
create index if not exists idx_messages_company_created_at on public.messages(company_id, created_at desc);
create index if not exists idx_events_company_created_at on public.events(company_id, created_at desc);

-- Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- RLS
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.inbound_tokens enable row level security;
alter table public.leads enable row level security;
alter table public.templates enable row level security;
alter table public.messages enable row level security;
alter table public.messaging_configs enable row level security;
alter table public.events enable row level security;

-- Helper function for current company
create or replace function public.current_company_id()
returns uuid
language sql
stable
as $$
  select company_id from public.profiles where user_id = auth.uid()
$$;

-- Tenant policies
create policy "profiles select own" on public.profiles
for select using (user_id = auth.uid());

create policy "companies select own" on public.companies
for select using (id = public.current_company_id());

create policy "inbound tokens tenant access" on public.inbound_tokens
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "leads tenant access" on public.leads
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "templates tenant access" on public.templates
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "messages tenant access" on public.messages
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "messaging configs tenant access" on public.messaging_configs
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "events tenant access" on public.events
for all using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());
