-- RLS: masters & bookings

alter table public.masters enable row level security;

drop policy if exists "masters_public_select" on public.masters;
drop policy if exists "masters_admin_all" on public.masters;

create policy "masters_public_select"
on public.masters
for select
to anon, authenticated
using (active = true);

create policy "masters_admin_all"
on public.masters
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.bookings enable row level security;

drop policy if exists "bookings_public_insert" on public.bookings;
drop policy if exists "bookings_admin_all" on public.bookings;

create policy "bookings_public_insert"
on public.bookings
for insert
to anon, authenticated
with check (status = 'pending');

create policy "bookings_admin_all"
on public.bookings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
