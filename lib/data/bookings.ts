import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  masters: Pick<Database["public"]["Tables"]["masters"]["Row"], "id" | "name" | "title"> | null;
};

export async function getAllBookings() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, masters(id, name, title)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) {
    return [];
  }

  return data as Booking[];
}

export async function getBookingsForDate(dateIso: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("master_id, appointment_time, status")
    .eq("appointment_date", dateIso)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    return [];
  }

  return data;
}
