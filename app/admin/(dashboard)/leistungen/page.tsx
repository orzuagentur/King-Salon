import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PricingQuickEdit } from "@/components/admin/pricing/PricingQuickEdit";
import { ServicesManager } from "@/components/admin/services/ServicesManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Leistungen | King Salon Admin",
};

type AdminServicesPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminServicesPage({ searchParams }: AdminServicesPageProps) {
  const { admin } = await requireAdmin();
  const services = await getAllServices();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Verwalten Sie alle Services, Beschreibungen, Preise und Dauer."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Leistungen"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <PricingQuickEdit services={services} />
      <ServicesManager services={services} />
    </div>
  );
}
