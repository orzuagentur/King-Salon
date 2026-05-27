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

export type BookingContextStats = {
  nextSevenDays: {
    confirmed: number;
    pending: number;
    total: number;
  };
};

export async function getBookingContextStats(): Promise<BookingContextStats> {
  const now = new Date();
  const start = now.toISOString().slice(0, 10);
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 7);
  const end = endDate.toISOString().slice(0, 10);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("status")
    .gte("appointment_date", start)
    .lte("appointment_date", end)
    .in("status", ["pending", "confirmed"]);

  if (error || !data) {
    return {
      nextSevenDays: {
        pending: 0,
        confirmed: 0,
        total: 0,
      },
    };
  }

  const pending = data.filter((row) => row.status === "pending").length;
  const confirmed = data.filter((row) => row.status === "confirmed").length;

  return {
    nextSevenDays: {
      pending,
      confirmed,
      total: pending + confirmed,
    },
  };
}
