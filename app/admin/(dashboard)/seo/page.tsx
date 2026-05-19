import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SeoSettingsForm } from "@/components/admin/seo/SeoSettingsForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getSeoSettings } from "@/lib/data/seo";
import { adminMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = adminMetadata;

type AdminSeoPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminSeoPage({ searchParams }: AdminSeoPageProps) {
  const { admin } = await requireAdmin();
  const seo = await getSeoSettings();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Meta-Titel, Beschreibung und lokale SEO-Einstellungen."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="SEO"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <SeoSettingsForm seo={seo} />
    </div>
  );
}
