import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { SeoSettingsForm } from "@/components/admin/seo/SeoSettingsForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getSeoSettings } from "@/lib/data/seo";
import { adminMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = adminMetadata;

export default async function AdminSeoPage() {
  const { admin } = await requireAdmin();
  const seo = await getSeoSettings();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Meta-Titel, Beschreibung und lokale SEO-Einstellungen."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="SEO"
      />

      <SeoSettingsForm seo={seo} />
    </div>
  );
}
