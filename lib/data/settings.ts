import { defaultSalonContact } from "@/lib/contact/defaults";
import { mapSettingsToContact } from "@/lib/contact/map-settings";
import type { SalonContact } from "@/lib/contact/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Settings = Database["public"]["Tables"]["settings"]["Row"];

export async function getSettings() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", "main").maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getSalonContact(): Promise<SalonContact> {
  const settings = await getSettings();

  if (!settings) {
    return defaultSalonContact;
  }

  return mapSettingsToContact(settings);
}
