import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { MastersManager } from "@/components/admin/masters/MastersManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllMasters } from "@/lib/data/masters";

export const metadata: Metadata = {
  title: "Meister | King Salon Admin",
};

export default async function AdminMastersPage() {
  const { admin } = await requireAdmin();
  const masters = await getAllMasters();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Barber und Meister für die Online-Terminbuchung verwalten."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Meister"
      />

      <MastersManager masters={masters} />
    </div>
  );
}
