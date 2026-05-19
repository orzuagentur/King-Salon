-- King Salon Celle – Supabase Storage
-- Buckets: gallery, services (öffentlich lesbar, Admin-Upload)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'gallery',
    'gallery',
    true,
    5242880,
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'services',
    'services',
    true,
    5242880,
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

-- Gallery: öffentlich lesen
create policy "gallery_public_read"
on storage.objects
for select
to public
using (bucket_id = 'gallery');

-- Gallery: Admin hochladen, aktualisieren, löschen
create policy "gallery_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery' and public.is_admin());

create policy "gallery_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery' and public.is_admin())
with check (bucket_id = 'gallery' and public.is_admin());

create policy "gallery_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery' and public.is_admin());

-- Services: öffentlich lesen
create policy "services_public_read"
on storage.objects
for select
to public
using (bucket_id = 'services');

-- Services: Admin hochladen, aktualisieren, löschen
create policy "services_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'services' and public.is_admin());

create policy "services_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'services' and public.is_admin())
with check (bucket_id = 'services' and public.is_admin());

create policy "services_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'services' and public.is_admin());
