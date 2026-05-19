import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GalleryManager } from "@/components/admin/gallery/GalleryManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllGalleryItems } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Galerie | King Salon Admin",
};

type AdminGalleryPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminGalleryPage({ searchParams }: AdminGalleryPageProps) {
  const { admin } = await requireAdmin();
  const items = await getAllGalleryItems();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Laden Sie Bilder hoch, ordnen Sie Kategorien und verwalten Sie die Galerie."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Galerie"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <GalleryManager items={items} />
    </div>
  );
}
