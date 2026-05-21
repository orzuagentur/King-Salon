import { defaultHomepageContent } from "@/lib/homepage/defaults";
import type { HomepageContent } from "@/lib/homepage/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("homepage_content")
    .select(
      "hero_eyebrow, hero_title, hero_subtitle, site_name, hero_background_image, hero_image, hero_image_alt",
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
    hero_image: data.hero_image ?? defaultHomepageContent.hero_image,
    hero_image_alt: data.hero_image_alt ?? defaultHomepageContent.hero_image_alt,
  };
}
