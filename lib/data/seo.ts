import { defaultSeoSettings, type SeoSettings } from "@/lib/seo/defaults";
import { getSettings } from "@/lib/data/settings";

export async function getSeoSettings(): Promise<SeoSettings> {
  const settings = await getSettings();

  if (!settings?.seo_title || !settings?.seo_description) {
    return defaultSeoSettings;
  }

  return {
    seo_title: settings.seo_title,
    seo_description: settings.seo_description,
  };
}
