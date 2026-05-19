import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingsManager } from "@/components/admin/bookings/BookingsManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllBookings } from "@/lib/data/bookings";

export const metadata: Metadata = {
  title: "Termine | King Salon Admin",
};

type AdminBookingsPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const { admin } = await requireAdmin();
  const bookings = await getAllBookings();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Alle Terminanfragen von der Website – Status ändern oder löschen."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Termine"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <BookingsManager bookings={bookings} />
    </div>
  );
}
