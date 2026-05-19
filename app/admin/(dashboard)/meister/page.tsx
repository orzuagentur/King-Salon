import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MastersManager } from "@/components/admin/masters/MastersManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllMasters } from "@/lib/data/masters";

export const metadata: Metadata = {
  title: "Meister | King Salon Admin",
};

type AdminMastersPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminMastersPage({ searchParams }: AdminMastersPageProps) {
  const { admin } = await requireAdmin();
  const masters = await getAllMasters();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Barber und Meister für die Online-Terminbuchung verwalten."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Meister"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <MastersManager masters={masters} />
    </div>
  );
}
