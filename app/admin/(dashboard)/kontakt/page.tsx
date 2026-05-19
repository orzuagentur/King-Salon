import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContactSettingsForm } from "@/components/admin/contact/ContactSettingsForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Kontakt | King Salon Admin",
};

type AdminContactPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminContactPage({ searchParams }: AdminContactPageProps) {
  const { admin } = await requireAdmin();
  const settings = await getSettings();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Telefon, E-Mail, Adresse und Social-Media-Links pflegen."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Kontakt"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <ContactSettingsForm settings={settings} />
    </div>
  );
}
