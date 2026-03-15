create extension if not exists pgcrypto;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  provider text not null,
  model text not null,
  local_mode boolean not null default true,
  input_text text not null,
  output_text text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "service role full access"
on public.chat_messages
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
