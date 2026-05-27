import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { OpeningHoursForm } from "@/components/admin/hours/OpeningHoursForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getOpeningHours } from "@/lib/data/opening-hours";

export const metadata: Metadata = {
  title: "Öffnungszeiten",
};

export default async function AdminHoursPage() {
  const { admin } = await requireAdmin();
  const openingHours = await getOpeningHours();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Öffnungszeiten für alle Wochentage verwalten."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Öffnungszeiten"
      />

      <OpeningHoursForm openingHours={openingHours} />
    </div>
  );
}
