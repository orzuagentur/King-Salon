import type { StorageBucket } from "@/lib/storage/constants";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function buildPublicStorageUrl(bucket: StorageBucket, path: string) {
  const { url } = getSupabaseConfig();

  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

export function resolveImageUrl(storedPath: string, bucket: StorageBucket) {
  if (storedPath.startsWith("http://") || storedPath.startsWith("https://")) {
    return storedPath;
  }

  if (storedPath.startsWith("/")) {
    return storedPath;
  }

  return buildPublicStorageUrl(bucket, storedPath);
}
