create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  source text not null default 'manual',
  status text not null default 'new' check (status in ('new','contacted','qualified','won','lost')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  inbound_token text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follow_up_queue (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  channel text not null check (channel in ('sms','email')),
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending','sent','failed','skipped')),
  message text not null,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_customers (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  billing_status text not null default 'incomplete' check (billing_status in ('trialing','active','past_due','canceled','incomplete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.user_settings enable row level security;
alter table public.follow_up_queue enable row level security;
alter table public.billing_customers enable row level security;

create policy "users_own_leads" on public.leads for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "users_own_settings" on public.user_settings for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "users_own_followups" on public.follow_up_queue for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "users_own_billing" on public.billing_customers for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create or replace function public.set_owner_on_leads()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.owner_id is null then
    new.owner_id := auth.uid();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_set_owner_on_leads
before insert or update on public.leads
for each row execute function public.set_owner_on_leads();

create or replace function public.set_owner_on_followup()
returns trigger language plpgsql security definer set search_path = public as $$
declare _owner uuid;
begin
  select owner_id into _owner from public.leads where id = new.lead_id;
  new.owner_id := coalesce(new.owner_id, _owner, auth.uid());
  return new;
end;
$$;

create trigger trg_set_owner_on_followup
before insert on public.follow_up_queue
for each row execute function public.set_owner_on_followup();
