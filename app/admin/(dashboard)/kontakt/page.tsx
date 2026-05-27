import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContactSettingsForm } from "@/components/admin/contact/ContactSettingsForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default async function AdminContactPage() {
  const { admin } = await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Telefon, E-Mail, Adresse und Social-Media-Links pflegen."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Kontakt"
      />

      <ContactSettingsForm settings={settings} />
    </div>
  );
}
