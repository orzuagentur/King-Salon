-- Cached website content index for AI context

create table public.ai_site_content_cache (
  id text primary key default 'main',
  fingerprint text not null,
  payload jsonb not null,
  page_count integer not null default 0,
  synced_at timestamptz not null default timezone('utc', now())
);

alter table public.ai_site_content_cache enable row level security;

drop policy if exists "ai_site_content_cache_public_select" on public.ai_site_content_cache;
drop policy if exists "ai_site_content_cache_admin_all" on public.ai_site_content_cache;

create policy "ai_site_content_cache_public_select"
on public.ai_site_content_cache
for select
to anon, authenticated
using (true);

create policy "ai_site_content_cache_admin_all"
on public.ai_site_content_cache
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
