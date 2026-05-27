import { getHomepageContent } from "@/lib/data/homepage";
import { getSalonContact } from "@/lib/data/settings";
import { defaultHomepageContent } from "@/lib/homepage/defaults";
import { parseAreaTags } from "@/lib/homepage/branding";

export type LocalSectionContent = {
  areaDescription: string;
  areaEyebrow: string;
  areaTags: string[];
  formattedAddress: string;
  locationEyebrow: string;
  siteName: string;
};

function formatAddress(street: string, city: string, country: string) {
  const parts = [street, city, country].filter(Boolean);
  return parts.join(", ");
}

export async function getLocalSectionContent(): Promise<LocalSectionContent> {
  const [homepage, contact] = await Promise.all([getHomepageContent(), getSalonContact()]);

  return {
    siteName: homepage.site_name,
    locationEyebrow: homepage.local_location_eyebrow,
    areaEyebrow: homepage.local_area_eyebrow,
    areaDescription: homepage.local_area_description,
    areaTags: parseAreaTags(homepage.local_area_tags),
    formattedAddress: formatAddress(
      contact.address.street,
      contact.address.city,
      contact.address.country,
    ),
  };
}

export function getDefaultLocalSectionContent(): LocalSectionContent {
  return {
    siteName: defaultHomepageContent.site_name,
    locationEyebrow: defaultHomepageContent.local_location_eyebrow,
    areaEyebrow: defaultHomepageContent.local_area_eyebrow,
    areaDescription: defaultHomepageContent.local_area_description,
    areaTags: parseAreaTags(defaultHomepageContent.local_area_tags),
    formattedAddress: "—",
  };
}
