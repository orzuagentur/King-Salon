-- King Salon Celle – Initial Database Schema
-- Apply in Supabase SQL Editor or via Supabase CLI: supabase db push

create extension if not exists "pgcrypto";

create type public.admin_role as enum ('admin', 'editor');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  duration text,
  image text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

create index services_active_sort_idx on public.services (active, sort_order);

-- Gallery
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  category text not null,
  title text,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index gallery_category_sort_idx on public.gallery (category, sort_order);

-- Site settings (singleton row: id = 'main')
create table public.settings (
  id text primary key default 'main',
  phone text not null,
  email text,
  address text not null,
  instagram text,
  facebook text,
  whatsapp text,
  google_maps_url text,
  opening_hours jsonb not null default '[]'::jsonb,
  seo_title text not null,
  seo_description text not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger settings_set_updated_at
before update on public.settings
for each row
execute function public.set_updated_at();

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null check (rating between 1 and 5),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index reviews_active_sort_idx on public.reviews (active, sort_order);

-- Admins (linked to Supabase Auth users)
create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.admin_role not null default 'editor',
  created_at timestamptz not null default timezone('utc', now())
);

create index admins_role_idx on public.admins (role);

-- Homepage CMS content (singleton row: id = 'main')
create table public.homepage_content (
  id text primary key default 'main',
  hero_eyebrow text not null,
  hero_title text not null,
  hero_subtitle text not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger homepage_content_set_updated_at
before update on public.homepage_content
for each row
execute function public.set_updated_at();
