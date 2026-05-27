-- AI context: settings, knowledge base, memory

create table public.ai_settings (
  id text primary key default 'main',
  system_prompt text,
  tone text,
  behavior_notes text,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger ai_settings_set_updated_at
before update on public.ai_settings
for each row
execute function public.set_updated_at();

create table public.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  content text not null,
  pinned boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index ai_knowledge_active_sort_idx on public.ai_knowledge (active, pinned desc, sort_order);

create trigger ai_knowledge_set_updated_at
before update on public.ai_knowledge
for each row
execute function public.set_updated_at();

create table public.ai_memory (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  pinned boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index ai_memory_active_sort_idx on public.ai_memory (active, pinned desc, sort_order);

create trigger ai_memory_set_updated_at
before update on public.ai_memory
for each row
execute function public.set_updated_at();

-- RLS: server reads via service role; admin manages via authenticated policies

alter table public.ai_settings enable row level security;
alter table public.ai_knowledge enable row level security;
alter table public.ai_memory enable row level security;

drop policy if exists "ai_settings_admin_all" on public.ai_settings;
drop policy if exists "ai_knowledge_admin_all" on public.ai_knowledge;
drop policy if exists "ai_memory_admin_all" on public.ai_memory;

create policy "ai_settings_admin_all"
on public.ai_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "ai_knowledge_admin_all"
on public.ai_knowledge
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "ai_memory_admin_all"
on public.ai_memory
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Allow anon/authenticated read for active rows (used by server client for AI context)
drop policy if exists "ai_settings_public_select" on public.ai_settings;
drop policy if exists "ai_knowledge_public_select" on public.ai_knowledge;
drop policy if exists "ai_memory_public_select" on public.ai_memory;

create policy "ai_settings_public_select"
on public.ai_settings
for select
to anon, authenticated
using (true);

create policy "ai_knowledge_public_select"
on public.ai_knowledge
for select
to anon, authenticated
using (active = true);

create policy "ai_memory_public_select"
on public.ai_memory
for select
to anon, authenticated
using (active = true);
