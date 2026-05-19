-- King Salon Celle – Seed Data
-- Run after initial_schema migration

insert into public.settings (
  id,
  phone,
  email,
  address,
  instagram,
  facebook,
  whatsapp,
  google_maps_url,
  opening_hours,
  seo_title,
  seo_description
)
values (
  'main',
  '+49 173 8882560',
  null,
  'Hehlentorstraße 8, 29221 Celle, Deutschland',
  'https://www.instagram.com/_king_salon_/',
  'https://m.facebook.com/kingsaloncelle/',
  'https://wa.me/491738882560',
  'https://maps.app.goo.gl/Qe2Zj9kCn49fUBgL8',
  '[
    {"day": "Montag", "hours": "09:00 - 19:00"},
    {"day": "Dienstag", "hours": "09:00 - 19:00"},
    {"day": "Mittwoch", "hours": "09:00 - 19:00"},
    {"day": "Donnerstag", "hours": "09:00 - 19:00"},
    {"day": "Freitag", "hours": "09:00 - 19:00"},
    {"day": "Samstag", "hours": "09:00 - 16:00"},
    {"day": "Sonntag", "hours": "Geschlossen"}
  ]'::jsonb,
  'King Salon Celle | Luxus-Barbershop & Hairstylist',
  'Premium-Haarschnitte, Fades, Bartpflege und VIP-Grooming in Celle. King Salon – Präzision, Stil und Luxury-Atmosphäre.'
)
on conflict (id) do update set
  phone = excluded.phone,
  address = excluded.address,
  instagram = excluded.instagram,
  facebook = excluded.facebook,
  whatsapp = excluded.whatsapp,
  google_maps_url = excluded.google_maps_url,
  opening_hours = excluded.opening_hours,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = timezone('utc', now());

insert into public.homepage_content (
  id,
  hero_eyebrow,
  hero_title,
  hero_subtitle
)
values (
  'main',
  'Luxus-Barbershop & Hairstylist in Celle',
  'Präzision. Stil. Königliche Ausstrahlung.',
  'Premium-Haarschnitte, Fades, Bartpflege und VIP-Grooming für Männer, die einen starken Auftritt erwarten.'
)
on conflict (id) do update set
  hero_eyebrow = excluded.hero_eyebrow,
  hero_title = excluded.hero_title,
  hero_subtitle = excluded.hero_subtitle,
  updated_at = timezone('utc', now());

insert into public.services (title, description, price, duration, image, active, sort_order)
values
  (
    'Fade Cut',
    'Moderner Fade mit sauberen Konturen und individuellem Finish.',
    0,
    '45 Min',
    '/images/barber-haarschnitt.png',
    true,
    1
  ),
  (
    'Taper Fade',
    'Weicher Übergang mit präziser Form und gepflegtem Styling.',
    0,
    '45 Min',
    null,
    true,
    2
  ),
  (
    'Klassischer Haarschnitt',
    'Zeitloser Schnitt mit klarer Beratung und Premium-Finish.',
    0,
    '40 Min',
    null,
    true,
    3
  ),
  (
    'Bart trimmen',
    'Saubere Bartform mit definierter Linie und gepflegtem Look.',
    0,
    '25 Min',
    null,
    true,
    4
  ),
  (
    'Bartstyling',
    'Form, Konturen und Finish für einen starken Auftritt.',
    0,
    '30 Min',
    null,
    true,
    5
  ),
  (
    'VIP-Paket',
    'Das volle King Salon Erlebnis: Haarschnitt, Bartpflege und Premium-Grooming.',
    0,
    '75 Min',
    '/images/salon-interior.png',
    true,
    6
  );

insert into public.gallery (image, category, title, alt, sort_order)
values
  (
    '/images/salon-aussenansicht.png',
    'Salon',
    'King Salon Celle',
    'Außenansicht von King Salon Celle in der Hehlentorstraße',
    1
  ),
  (
    '/images/salon-interior.png',
    'Atmosphäre',
    'Premium Atmosphäre',
    'Moderner Barber-Arbeitsplatz im King Salon',
    2
  ),
  (
    '/images/barber-haarschnitt.png',
    'Haarschnitt',
    'Präziser Schnitt',
    'Präziser Haarschnitt im King Salon Celle',
    3
  ),
  (
    '/images/barber-styling.png',
    'Styling',
    'Styling & Finish',
    'Styling und Finish mit Föhn im King Salon',
    4
  ),
  (
    '/images/barber-technik.png',
    'Technik',
    'Premium Technik',
    'Premium Barber-Technik im King Salon',
    5
  ),
  (
    '/images/salon-spiegel.png',
    'Erlebnis',
    'Kundenmoment',
    'Spiegelmoment mit Kunde und Barber im King Salon',
    6
  ),
  (
    '/images/king-brand.png',
    'Team',
    'King Salon Team',
    'King Salon Team mit charakteristischem Branding',
    7
  ),
  (
    '/images/damen-styling.png',
    'Damen',
    'Damen Styling',
    'Damen-Styling im King Salon Celle',
    8
  );

insert into public.reviews (name, text, rating, active, sort_order)
values
  (
    'Markus H.',
    'Bester Fade in Celle. Saubere Konturen, ruhige Atmosphäre und ein Team, das genau weiß, was es tut.',
    5,
    true,
    1
  ),
  (
    'Jonas K.',
    'Premium-Erlebnis vom ersten Moment an. Haarschnitt und Bartpflege waren perfekt abgestimmt – absolut empfehlenswert.',
    5,
    true,
    2
  ),
  (
    'Emre Y.',
    'Sehr professionell, freundlich und präzise. Man fühlt sich direkt willkommen und verlässt den Salon mit einem starken Look.',
    5,
    true,
    3
  ),
  (
    'Daniel R.',
    'King Salon ist für mich die erste Adresse in Celle. Styling, Beratung und Finish sind auf einem echten Premium-Niveau.',
    5,
    true,
    4
  );
