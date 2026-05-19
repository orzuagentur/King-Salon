import type { MasterOption } from "@/lib/booking/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Master = Database["public"]["Tables"]["masters"]["Row"];

export async function getActiveMasters(): Promise<MasterOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("masters")
    .select("id, name, title")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getAllMasters() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("masters")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }

  return data;
}
