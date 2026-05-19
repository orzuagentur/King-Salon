import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminDashboardStats = {
  activeReviews: number;
  activeServices: number;
  galleryImages: number;
  hasSettings: boolean;
  pendingBookings: number;
};

const emptyStats: AdminDashboardStats = {
  activeReviews: 0,
  activeServices: 0,
  galleryImages: 0,
  hasSettings: false,
  pendingBookings: 0,
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const supabase = await createSupabaseServerClient();

    const [servicesResult, galleryResult, reviewsResult, settingsResult, bookingsResult] =
      await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("settings").select("id").eq("id", "main").maybeSingle(),
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

    return {
      activeReviews: reviewsResult.count ?? 0,
      activeServices: servicesResult.count ?? 0,
      galleryImages: galleryResult.count ?? 0,
      hasSettings: Boolean(settingsResult.data),
      pendingBookings: bookingsResult.count ?? 0,
    };
  } catch {
    return emptyStats;
  }
}
