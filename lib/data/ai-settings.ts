import type { AiSettingsRow } from "@/lib/ai/context/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAiSettings(): Promise<AiSettingsRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_settings")
    .select("id, system_prompt, tone, behavior_notes, updated_at")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
