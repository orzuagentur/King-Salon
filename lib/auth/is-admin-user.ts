import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export async function isAdminUser(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("admins")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  return !error && Boolean(data);
}
