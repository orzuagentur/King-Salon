-- King Salon – Masters (Barber) & Bookings

create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create table public.masters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger masters_set_updated_at
before update on public.masters
for each row
execute function public.set_updated_at();

create index masters_active_sort_idx on public.masters (active, sort_order);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.masters (id) on delete restrict,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  message text,
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

create index bookings_date_time_idx on public.bookings (appointment_date, appointment_time);
create index bookings_master_date_idx on public.bookings (master_id, appointment_date);
create index bookings_status_idx on public.bookings (status);

-- Ein aktiver Termin pro Meister, Datum und Uhrzeit
create unique index bookings_master_slot_active_uidx
on public.bookings (master_id, appointment_date, appointment_time)
where status in ('pending', 'confirmed');

-- Verfügbarkeit prüfen (öffentlich aufrufbar)
create or replace function public.is_booking_slot_available(
  p_master_id uuid,
  p_date date,
  p_time time
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.bookings b
    where b.master_id = p_master_id
      and b.appointment_date = p_date
      and b.appointment_time = p_time
      and b.status in ('pending', 'confirmed')
  );
$$;

grant execute on function public.is_booking_slot_available(uuid, date, time) to anon, authenticated;

insert into public.masters (name, title, active, sort_order)
values
  ('King Master', 'Senior Barber', true, 1),
  ('Salon Team', 'Barber & Styling', true, 2);
