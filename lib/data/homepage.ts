import { defaultHomepageContent } from "@/lib/homepage/defaults";
import { inferHomepageBackgroundMediaType } from "@/lib/homepage/media";
import type { HomepageContent } from "@/lib/homepage/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("homepage_content")
    .select(
      "hero_eyebrow, hero_title, hero_subtitle, site_name, hero_background_image, hero_background_media_type, hero_image, hero_image_alt, hero_card_street, hero_card_city, hero_card_hours, hero_stat_location, hero_stat_style, footer_tagline, footer_rights, contact_section_eyebrow, contact_section_title, contact_section_subtitle, admin_brand_name, admin_login_subtitle, local_location_eyebrow, local_area_eyebrow, local_area_description, local_area_tags",
    )
    .eq("id", "main")
    .maybeSingle();

  if (error || !data) {
    return defaultHomepageContent;
  }

  return {
    hero_eyebrow: data.hero_eyebrow,
    hero_subtitle: data.hero_subtitle,
    hero_title: data.hero_title,
    site_name: data.site_name ?? defaultHomepageContent.site_name,
    hero_background_image:
      data.hero_background_image ?? defaultHomepageContent.hero_background_image,
    hero_background_media_type: inferHomepageBackgroundMediaType(
      data.hero_background_image ?? defaultHomepageContent.hero_background_image,
      data.hero_background_media_type,
    ),
    hero_image: data.hero_image ?? defaultHomepageContent.hero_image,
    hero_image_alt: data.hero_image_alt ?? defaultHomepageContent.hero_image_alt,
    hero_card_street: data.hero_card_street ?? defaultHomepageContent.hero_card_street,
    hero_card_city: data.hero_card_city ?? defaultHomepageContent.hero_card_city,
    hero_card_hours: data.hero_card_hours ?? defaultHomepageContent.hero_card_hours,
    hero_stat_location: data.hero_stat_location ?? defaultHomepageContent.hero_stat_location,
    hero_stat_style: data.hero_stat_style ?? defaultHomepageContent.hero_stat_style,
    footer_tagline: data.footer_tagline ?? defaultHomepageContent.footer_tagline,
    footer_rights: data.footer_rights ?? defaultHomepageContent.footer_rights,
    contact_section_eyebrow:
      data.contact_section_eyebrow ?? defaultHomepageContent.contact_section_eyebrow,
    contact_section_title:
      data.contact_section_title ?? defaultHomepageContent.contact_section_title,
    contact_section_subtitle:
      data.contact_section_subtitle ?? defaultHomepageContent.contact_section_subtitle,
    admin_brand_name: data.admin_brand_name ?? defaultHomepageContent.admin_brand_name,
    admin_login_subtitle:
      data.admin_login_subtitle ?? defaultHomepageContent.admin_login_subtitle,
    local_location_eyebrow:
      data.local_location_eyebrow ?? defaultHomepageContent.local_location_eyebrow,
    local_area_eyebrow: data.local_area_eyebrow ?? defaultHomepageContent.local_area_eyebrow,
    local_area_description:
      data.local_area_description ?? defaultHomepageContent.local_area_description,
    local_area_tags: data.local_area_tags ?? defaultHomepageContent.local_area_tags,
  };
}
