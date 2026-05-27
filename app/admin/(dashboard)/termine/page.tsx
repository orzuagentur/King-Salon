import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingsManager } from "@/components/admin/bookings/BookingsManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllBookings } from "@/lib/data/bookings";

export const metadata: Metadata = {
  title: "Termine | King Salon Admin",
};

export default async function AdminBookingsPage() {
  const { admin } = await requireAdmin();
  const bookings = await getAllBookings();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Alle Terminanfragen von der Website – Status ändern oder löschen."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Termine"
      />

      <BookingsManager bookings={bookings} />
    </div>
  );
}
