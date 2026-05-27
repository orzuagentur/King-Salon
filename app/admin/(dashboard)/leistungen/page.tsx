import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { PricingQuickEdit } from "@/components/admin/pricing/PricingQuickEdit";
import { ServicesManager } from "@/components/admin/services/ServicesManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Preise | Admin",
};

export default async function AdminServicesPage() {
  const { admin } = await requireAdmin();
  const services = await getAllServices();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Verwalten Sie alle Services, Beschreibungen, Preise und Dauer."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Preise"
      />

      <PricingQuickEdit services={services} />
      <ServicesManager services={services} />
    </div>
  );
}
