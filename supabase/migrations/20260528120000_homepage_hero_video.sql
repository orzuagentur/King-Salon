-- Hero background: image or video

alter table public.homepage_content
  add column if not exists hero_background_media_type text not null default 'image';

alter table public.homepage_content
  drop constraint if exists homepage_content_hero_background_media_type_check;

alter table public.homepage_content
  add constraint homepage_content_hero_background_media_type_check
  check (hero_background_media_type in ('image', 'video'));

update public.homepage_content
set hero_background_media_type = 'image'
where hero_background_media_type is null;

-- Allow video uploads in gallery bucket (hero background media)
update storage.buckets
set
  file_size_limit = 26214400,
  allowed_mime_types = array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
where id = 'gallery';
