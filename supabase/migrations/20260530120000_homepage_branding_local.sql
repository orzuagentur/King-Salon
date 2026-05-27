-- Admin branding, login copy, and local business section (footer area)

alter table public.homepage_content
  add column if not exists admin_brand_name text,
  add column if not exists admin_login_subtitle text,
  add column if not exists local_location_eyebrow text,
  add column if not exists local_area_eyebrow text,
  add column if not exists local_area_description text,
  add column if not exists local_area_tags text;

update public.homepage_content
set
  local_location_eyebrow = coalesce(local_location_eyebrow, 'Standort'),
  local_area_eyebrow = coalesce(local_area_eyebrow, 'Einzugsgebiet'),
  local_area_description = coalesce(
    local_area_description,
    'Wir betreuen Kunden aus der Region — zentral erreichbar und mit persönlicher Beratung.'
  ),
  local_area_tags = coalesce(local_area_tags, 'Celle, Region, Niedersachsen'),
  admin_login_subtitle = coalesce(
    admin_login_subtitle,
    'Melden Sie sich an, um Inhalte, Preise, Galerie und Salon-Daten sicher zu verwalten.'
  )
where id = 'main';
