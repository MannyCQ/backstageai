-- Backstage AI — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  artist_name text,
  area text,
  genre text,
  similar_artists text,
  bio text,
  spotify_url text,
  soundcloud_url text,
  instagram_url text,
  website_url text,
  onboarding_complete boolean default false,
  plan text default 'free' check (plan in ('free', 'support_act', 'headliner')),
  venue_matches_used integer default 0,
  emails_sent_this_month integer default 0,
  usage_reset_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free' check (plan in ('free', 'support_act', 'headliner')),
  status text default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- OUTREACH
-- ============================================================
create table if not exists outreach (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  venue_name text not null,
  venue_email text,
  subject text,
  body text,
  status text default 'sent' check (status in ('sent', 'replied', 'booked', 'no_response')),
  notes text,
  sent_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table outreach enable row level security;

-- Profiles: users can only read/write their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Subscriptions: users can only read their own
create policy "Users can view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on subscriptions for all using (true);

-- Outreach: users can manage their own outreach
create policy "Users can view own outreach"
  on outreach for select using (auth.uid() = user_id);

create policy "Users can insert own outreach"
  on outreach for insert with check (auth.uid() = user_id);

create policy "Users can update own outreach"
  on outreach for update using (auth.uid() = user_id);

create policy "Users can delete own outreach"
  on outreach for delete using (auth.uid() = user_id);

-- ============================================================
-- AUTO-TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamps
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure public.update_updated_at();

drop trigger if exists subscriptions_updated_at on subscriptions;
create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure public.update_updated_at();

drop trigger if exists outreach_updated_at on outreach;
create trigger outreach_updated_at
  before update on outreach
  for each row execute procedure public.update_updated_at();

-- Monthly usage reset function (call via pg_cron or Supabase scheduled function)
create or replace function public.reset_monthly_usage()
returns void as $$
begin
  update profiles
  set venue_matches_used = 0,
      emails_sent_this_month = 0,
      usage_reset_at = now()
  where usage_reset_at < now() - interval '30 days';
end;
$$ language plpgsql security definer;
