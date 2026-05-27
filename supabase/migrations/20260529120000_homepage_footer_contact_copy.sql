-- Footer and contact section copy (white-label / admin editable)

alter table public.homepage_content
  add column if not exists footer_tagline text,
  add column if not exists footer_rights text default 'Alle Rechte vorbehalten.',
  add column if not exists contact_section_eyebrow text,
  add column if not exists contact_section_title text,
  add column if not exists contact_section_subtitle text;

update public.homepage_content
set
  footer_rights = coalesce(footer_rights, 'Alle Rechte vorbehalten.'),
  contact_section_eyebrow = coalesce(contact_section_eyebrow, 'Kontakt'),
  contact_section_title = coalesce(contact_section_title, 'Ihr Termin beginnt hier.'),
  contact_section_subtitle = coalesce(
    contact_section_subtitle,
    'Besuchen Sie uns vor Ort — für Premium-Grooming, Beratung und einen starken Auftritt.'
  )
where id = 'main';
