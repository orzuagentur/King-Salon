import {
  STORAGE_ALLOWED_EXTENSIONS,
  STORAGE_ALLOWED_VIDEO_EXTENSIONS,
} from "@/lib/storage/constants";

export function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "")
    .replace(/-+/g, "-");
}

export function buildStoragePath(folder: string, fileName: string) {
  const safeName = sanitizeFileName(fileName);
  const timestamp = Date.now();

  return `${folder}/${timestamp}-${safeName}`;
}

export function isAllowedImageFile(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  return (
    file.type.startsWith("image/") &&
    STORAGE_ALLOWED_EXTENSIONS.includes(extension as (typeof STORAGE_ALLOWED_EXTENSIONS)[number])
  );
}

export function isAllowedVideoFile(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  return (
    file.type.startsWith("video/") &&
    STORAGE_ALLOWED_VIDEO_EXTENSIONS.includes(
      extension as (typeof STORAGE_ALLOWED_VIDEO_EXTENSIONS)[number],
    )
  );
}
