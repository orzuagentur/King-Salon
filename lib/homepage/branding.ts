import type { HomepageContent } from "@/lib/homepage/types";

export function getAdminBrandName(content: HomepageContent) {
  const custom = content.admin_brand_name?.trim();
  return custom || content.site_name;
}

export function parseAreaTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
