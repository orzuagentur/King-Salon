import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { GalleryManager } from "@/components/admin/gallery/GalleryManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllGalleryItems } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Galerie | King Salon Admin",
};

export default async function AdminGalleryPage() {
  const { admin } = await requireAdmin();
  const items = await getAllGalleryItems();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Laden Sie Bilder hoch, ordnen Sie Kategorien und verwalten Sie die Galerie."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Galerie"
      />

      <GalleryManager items={items} />
    </div>
  );
}
