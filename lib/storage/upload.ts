"use client";

import {
  STORAGE_ALLOWED_MIME_TYPES,
  STORAGE_ALLOWED_VIDEO_MIME_TYPES,
  STORAGE_MAX_FILE_SIZE,
  STORAGE_MAX_VIDEO_FILE_SIZE,
  type StorageBucket,
} from "@/lib/storage/constants";
import { buildStoragePath, isAllowedImageFile, isAllowedVideoFile } from "@/lib/storage/paths";
import { buildPublicStorageUrl } from "@/lib/storage/urls";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type UploadImageResult = {
  bucket: StorageBucket;
  path: string;
  publicUrl: string;
};

export type UploadImageError = {
  message: string;
};

function validateImageFile(file: File): UploadImageError | null {
  if (!isAllowedImageFile(file)) {
    return { message: "Nur JPG, PNG oder WebP Dateien sind erlaubt." };
  }

  if (file.size > STORAGE_MAX_FILE_SIZE) {
    return { message: "Die Datei darf maximal 5 MB groß sein." };
  }

  if (
    !STORAGE_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof STORAGE_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return { message: "Ungültiger Bildtyp." };
  }

  return null;
}

export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  folder = "uploads",
): Promise<{ data: UploadImageResult } | { error: UploadImageError }> {
  const validationError = validateImageFile(file);

  if (validationError) {
    return { error: validationError };
  }

  const supabase = createSupabaseBrowserClient();
  const path = buildStoragePath(folder, file.name);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: { message: "Upload fehlgeschlagen. Bitte erneut versuchen." } };
  }

  return {
    data: {
      bucket,
      path,
      publicUrl: buildPublicStorageUrl(bucket, path),
    },
  };
}

export async function deleteStorageImage(bucket: StorageBucket, path: string) {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { error: { message: "Löschen fehlgeschlagen." } };
  }

  return { success: true as const };
}

export async function uploadGalleryImage(file: File, folder = "uploads") {
  return uploadImage("gallery", file, folder);
}

export async function uploadServiceImage(file: File, folder = "uploads") {
  return uploadImage("services", file, folder);
}

export async function uploadHomepageImage(file: File, folder = "homepage") {
  return uploadImage("gallery", file, folder);
}

function validateVideoFile(file: File): UploadImageError | null {
  if (!isAllowedVideoFile(file)) {
    return { message: "Nur MP4, WebM oder MOV Dateien sind erlaubt." };
  }

  if (file.size > STORAGE_MAX_VIDEO_FILE_SIZE) {
    return { message: "Das Video darf maximal 25 MB groß sein." };
  }

  if (
    !STORAGE_ALLOWED_VIDEO_MIME_TYPES.includes(
      file.type as (typeof STORAGE_ALLOWED_VIDEO_MIME_TYPES)[number],
    )
  ) {
    return { message: "Ungültiger Videotyp." };
  }

  return null;
}

export async function uploadHomepageVideo(file: File, folder = "homepage/videos") {
  const validationError = validateVideoFile(file);

  if (validationError) {
    return { error: validationError };
  }

  const supabase = createSupabaseBrowserClient();
  const path = buildStoragePath(folder, file.name);

  const { error } = await supabase.storage.from("gallery").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: { message: "Video-Upload fehlgeschlagen. Bitte erneut versuchen." } };
  }

  return {
    data: {
      bucket: "gallery" as const,
      path,
      publicUrl: buildPublicStorageUrl("gallery", path),
    },
  };
}

export async function uploadHomepageBackgroundMedia(file: File) {
  if (isAllowedVideoFile(file)) {
    return uploadHomepageVideo(file);
  }

  return uploadHomepageImage(file, "homepage");
}
