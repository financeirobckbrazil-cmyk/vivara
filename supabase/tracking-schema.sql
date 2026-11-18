create extension if not exists pgcrypto;

create table if not exists public.life_pandora_tracking (
  id uuid primary key default gen_random_uuid(),
  payment_id text not null unique,
  customer_name text not null,
  customer_email text not null,
  order_items jsonb not null default '[]'::jsonb,
  order_total numeric(10,2) not null,
  shipping_method text not null,
  shipping_address jsonb not null default '{}'::jsonb,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.life_pandora_tracking enable row level security;
revoke all on public.life_pandora_tracking from anon, authenticated;
