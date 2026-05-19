import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { HomepageContentForm } from "@/components/admin/homepage/HomepageContentForm";
import { requireAdmin } from "@/lib/auth/admin";
import { getHomepageContent } from "@/lib/data/homepage";

export const metadata: Metadata = {
  title: "Startseite | King Salon Admin",
};

type AdminHomepagePageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminHomepagePage({ searchParams }: AdminHomepagePageProps) {
  const { admin } = await requireAdmin();
  const content = await getHomepageContent();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Hero-Texte und Inhalte der Startseite anpassen."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Startseite"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <HomepageContentForm content={content} />
    </div>
  );
}
