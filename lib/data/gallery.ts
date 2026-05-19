import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type GalleryItem = Database["public"]["Tables"]["gallery"]["Row"];

export async function getAllGalleryItems() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }

  return data;
}

export async function getGalleryItems() {
  return getAllGalleryItems();
}
