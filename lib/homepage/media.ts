import type { HomepageBackgroundMediaType } from "@/lib/homepage/types";

const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|mov)(\?.*)?$/i;

export function inferHomepageBackgroundMediaType(
  url: string,
  storedType?: string | null,
): HomepageBackgroundMediaType {
  if (storedType === "image" || storedType === "video") {
    return storedType;
  }

  return VIDEO_EXTENSION_PATTERN.test(url) ? "video" : "image";
}

export function isHomepageBackgroundVideo(
  url: string,
  storedType?: string | null,
): boolean {
  return inferHomepageBackgroundMediaType(url, storedType) === "video";
}
