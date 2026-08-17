-- Run this migration in the Supabase SQL editor before using production accounts.
create extension if not exists pgcrypto;

create table if not exists public.company_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null default 'My HVAC Company',
  phone text,
  email text,
  website text,
  plan text not null default 'starter' check (plan in ('starter','pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads add column if not exists owner_id uuid references auth.users(id) on delete cascade;

create index if not exists leads_owner_id_idx on public.leads(owner_id);
create index if not exists leads_owner_status_idx on public.leads(owner_id,status);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.company_profiles (id, company_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'company_name','My HVAC Company'), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.company_profiles enable row level security;
alter table public.leads enable row level security;

drop policy if exists company_profile_select on public.company_profiles;
create policy company_profile_select on public.company_profiles for select using (id = auth.uid());
drop policy if exists company_profile_insert on public.company_profiles;
create policy company_profile_insert on public.company_profiles for insert with check (id = auth.uid());
drop policy if exists company_profile_update on public.company_profiles;
create policy company_profile_update on public.company_profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists leads_select_own on public.leads;
create policy leads_select_own on public.leads for select using (owner_id = auth.uid());
drop policy if exists leads_insert_own on public.leads;
create policy leads_insert_own on public.leads for insert with check (owner_id = auth.uid());
drop policy if exists leads_update_own on public.leads;
create policy leads_update_own on public.leads for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists leads_delete_own on public.leads;
create policy leads_delete_own on public.leads for delete using (owner_id = auth.uid());

-- Existing rows created before multi-tenant auth have no owner. Review them manually before production.
