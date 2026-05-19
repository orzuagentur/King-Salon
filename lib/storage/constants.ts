export const STORAGE_BUCKETS = {
  gallery: "gallery",
  services: "services",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const STORAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;

export const STORAGE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const STORAGE_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
