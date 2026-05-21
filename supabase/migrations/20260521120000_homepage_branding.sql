-- Homepage branding: site name and hero images

alter table public.homepage_content
  add column if not exists site_name text,
  add column if not exists hero_background_image text,
  add column if not exists hero_image text,
  add column if not exists hero_image_alt text;

update public.homepage_content
set
  site_name = coalesce(site_name, 'King Salon'),
  hero_background_image = coalesce(hero_background_image, '/images/salon-interior.png'),
  hero_image = coalesce(hero_image, '/images/barber-haarschnitt.png'),
  hero_image_alt = coalesce(hero_image_alt, 'Präziser Haarschnitt im King Salon Celle')
where id = 'main';

alter table public.homepage_content
  alter column site_name set default 'King Salon',
  alter column hero_background_image set default '/images/salon-interior.png',
  alter column hero_image set default '/images/barber-haarschnitt.png',
  alter column hero_image_alt set default 'Präziser Haarschnitt im King Salon Celle';

alter table public.homepage_content
  alter column site_name set not null,
  alter column hero_background_image set not null,
  alter column hero_image set not null,
  alter column hero_image_alt set not null;
