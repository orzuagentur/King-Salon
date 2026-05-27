import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceContextItem = Pick<
  Service,
  "id" | "title" | "description" | "price" | "duration" | "sort_order" | "updated_at"
>;

export async function getAllServices() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }

  return data;
}

export async function getActiveServices() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }

  return data;
}

export async function getActiveServicesForContext(): Promise<ServiceContextItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, title, description, price, duration, sort_order, updated_at")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}
