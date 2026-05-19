import type { StorageBucket } from "@/lib/storage/constants";
import { extractStorageObjectPath } from "@/lib/storage/extract-path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteStorageObject(bucket: StorageBucket, imageValue: string) {
  const path = extractStorageObjectPath(imageValue, bucket);

  if (!path) {
    return { skipped: true as const };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}
