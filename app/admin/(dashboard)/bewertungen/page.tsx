import type { Metadata } from "next";

import { AdminSectionTemplate } from "@/components/admin/AdminSectionTemplate";

export const metadata: Metadata = {
  title: "Bewertungen | King Salon Admin",
};

export default function AdminReviewsPage() {
  return <AdminSectionTemplate pathname="/admin/bewertungen" />;
}
