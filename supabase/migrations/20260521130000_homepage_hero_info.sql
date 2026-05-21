-- Homepage hero: location card overlay and stat blocks (Standort, Stil)

alter table public.homepage_content
  add column if not exists hero_card_street text,
  add column if not exists hero_card_city text,
  add column if not exists hero_card_hours text,
  add column if not exists hero_stat_location text,
  add column if not exists hero_stat_style text;

update public.homepage_content
set
  hero_card_street = coalesce(hero_card_street, 'Hehlentorstraße 8'),
  hero_card_city = coalesce(hero_card_city, '29221 Celle'),
  hero_card_hours = coalesce(
    hero_card_hours,
    'Montag bis Freitag 09:00 - 19:00, Samstag 09:00 - 16:00'
  ),
  hero_stat_location = coalesce(hero_stat_location, 'Celle Zentrum'),
  hero_stat_style = coalesce(hero_stat_style, 'Luxury Grooming')
where id = 'main';

alter table public.homepage_content
  alter column hero_card_street set default 'Hehlentorstraße 8',
  alter column hero_card_city set default '29221 Celle',
  alter column hero_card_hours set default 'Montag bis Freitag 09:00 - 19:00, Samstag 09:00 - 16:00',
  alter column hero_stat_location set default 'Celle Zentrum',
  alter column hero_stat_style set default 'Luxury Grooming';

alter table public.homepage_content
  alter column hero_card_street set not null,
  alter column hero_card_city set not null,
  alter column hero_card_hours set not null,
  alter column hero_stat_location set not null,
  alter column hero_stat_style set not null;
