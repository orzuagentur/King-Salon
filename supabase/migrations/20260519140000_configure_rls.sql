-- King Salon Celle – Row Level Security (RLS)
-- Öffentliche Website: lesen | Admin CMS: voller Zugriff

-- Sicherstellen, dass is_admin() existiert (aus Storage-Migration)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where id = auth.uid()
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
alter table public.services enable row level security;

drop policy if exists "services_public_select" on public.services;
drop policy if exists "services_admin_all" on public.services;

create policy "services_public_select"
on public.services
for select
to anon, authenticated
using (active = true);

create policy "services_admin_all"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- gallery
-- ---------------------------------------------------------------------------
alter table public.gallery enable row level security;

drop policy if exists "gallery_public_select" on public.gallery;
drop policy if exists "gallery_admin_all" on public.gallery;

create policy "gallery_public_select"
on public.gallery
for select
to anon, authenticated
using (true);

create policy "gallery_admin_all"
on public.gallery
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------
alter table public.settings enable row level security;

drop policy if exists "settings_public_select" on public.settings;
drop policy if exists "settings_admin_insert" on public.settings;
drop policy if exists "settings_admin_update" on public.settings;

create policy "settings_public_select"
on public.settings
for select
to anon, authenticated
using (true);

create policy "settings_admin_insert"
on public.settings
for insert
to authenticated
with check (public.is_admin());

create policy "settings_admin_update"
on public.settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
alter table public.reviews enable row level security;

drop policy if exists "reviews_public_select" on public.reviews;
drop policy if exists "reviews_admin_all" on public.reviews;

create policy "reviews_public_select"
on public.reviews
for select
to anon, authenticated
using (active = true);

create policy "reviews_admin_all"
on public.reviews
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- homepage_content
-- ---------------------------------------------------------------------------
alter table public.homepage_content enable row level security;

drop policy if exists "homepage_public_select" on public.homepage_content;
drop policy if exists "homepage_admin_insert" on public.homepage_content;
drop policy if exists "homepage_admin_update" on public.homepage_content;

create policy "homepage_public_select"
on public.homepage_content
for select
to anon, authenticated
using (true);

create policy "homepage_admin_insert"
on public.homepage_content
for insert
to authenticated
with check (public.is_admin());

create policy "homepage_admin_update"
on public.homepage_content
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- admins
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;

drop policy if exists "admins_select_own" on public.admins;
drop policy if exists "admins_select_all" on public.admins;
drop policy if exists "admins_admin_insert" on public.admins;
drop policy if exists "admins_admin_update" on public.admins;
drop policy if exists "admins_admin_delete" on public.admins;

-- Eingeloggter Nutzer kann eigenen Admin-Eintrag lesen (Login-Prüfung)
create policy "admins_select_own"
on public.admins
for select
to authenticated
using (id = auth.uid());

-- Admins können alle Admin-Einträge sehen
create policy "admins_select_all"
on public.admins
for select
to authenticated
using (public.is_admin());

-- Nur Rolle 'admin' darf andere Admins verwalten
create policy "admins_admin_insert"
on public.admins
for insert
to authenticated
with check (public.is_super_admin());

create policy "admins_admin_update"
on public.admins
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "admins_admin_delete"
on public.admins
for delete
to authenticated
using (public.is_super_admin());
