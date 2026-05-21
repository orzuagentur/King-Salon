import { resolveImageUrl } from "@/lib/storage/urls";

export function resolveHomepageImageUrl(storedPath: string) {
  return resolveImageUrl(storedPath, "gallery");
}
