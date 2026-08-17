alter table public.company_profiles add column if not exists automation_enabled boolean not null default false;
alter table public.company_profiles add column if not exists sms_enabled boolean not null default false;
alter table public.company_profiles add column if not exists followup_delay_hours integer not null default 24;
alter table public.leads add column if not exists customer_followup_opt_in boolean not null default false;
alter table public.leads add column if not exists last_followup_at timestamptz;
alter table public.leads add column if not exists followup_count integer not null default 0;
create index if not exists leads_followup_idx on public.leads(owner_id,status,last_followup_at);
