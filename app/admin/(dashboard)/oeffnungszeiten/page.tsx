import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OpeningHoursForm } from "@/components/admin/hours/OpeningHoursForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getOpeningHours } from "@/lib/data/opening-hours";

export const metadata: Metadata = {
  title: "Öffnungszeiten | King Salon Admin",
};

type AdminHoursPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminHoursPage({ searchParams }: AdminHoursPageProps) {
  const { admin } = await requireAdmin();
  const openingHours = await getOpeningHours();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Öffnungszeiten für alle Wochentage verwalten."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Öffnungszeiten"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <OpeningHoursForm openingHours={openingHours} />
    </div>
  );
}
