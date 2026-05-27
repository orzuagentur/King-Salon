import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { HomepageContentForm } from "@/components/admin/homepage/HomepageContentForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getHomepageContent } from "@/lib/data/homepage";

export const metadata: Metadata = {
  title: "Startseite | King Salon Admin",
};

export default async function AdminHomepagePage() {
  const { admin } = await requireAdmin();
  const content = await getHomepageContent();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Name, Hero-Bilder, Standort, Stil und Texte der Startseite anpassen."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Startseite"
      />

      <HomepageContentForm content={content} />
    </div>
  );
}
