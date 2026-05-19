-- Öffentlich gebuchte Slots lesen (für Verfügbarkeitsprüfung auf der Website)

drop policy if exists "bookings_public_read_slots" on public.bookings;

create policy "bookings_public_read_slots"
on public.bookings
for select
to anon, authenticated
using (status in ('pending', 'confirmed'));
