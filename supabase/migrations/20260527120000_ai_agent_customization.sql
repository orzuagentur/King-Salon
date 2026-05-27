-- AI agent branding & chat customization

alter table public.ai_settings
  add column if not exists agent_name text default 'King Salon Assistent',
  add column if not exists agent_avatar text default 'spark',
  add column if not exists welcome_message text,
  add column if not exists language text not null default 'de',
  add column if not exists theme_color text not null default '#c8a45d';

update public.ai_settings
set
  agent_name = coalesce(agent_name, 'King Salon Assistent'),
  agent_avatar = coalesce(agent_avatar, 'spark'),
  welcome_message = coalesce(
    welcome_message,
    'Willkommen bei King Salon Celle. Ich helfe bei Leistungen, Preisen, Öffnungszeiten — und Sie können direkt einen Termin buchen.'
  ),
  language = coalesce(language, 'de'),
  theme_color = coalesce(theme_color, '#c8a45d')
where id = 'main';
