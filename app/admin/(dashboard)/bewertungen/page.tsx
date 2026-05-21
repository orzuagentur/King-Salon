import type { Metadata } from "next";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReviewsManager } from "@/components/admin/reviews/ReviewsManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllReviews } from "@/lib/data/reviews";

export const metadata: Metadata = {
  title: "Bewertungen | King Salon Admin",
};

type AdminReviewsPageProps = {
  searchParams: Promise<{
    erfolg?: string;
    fehler?: string;
  }>;
};

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const { admin } = await requireAdmin();
  const reviews = await getAllReviews();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Kundenbewertungen hinzufügen, bearbeiten und auf der Website ein- oder ausblenden."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Bewertungen"
      />

      <AdminAlert message={params.erfolg} type="success" />
      <AdminAlert message={params.fehler} type="error" />

      <ReviewsManager reviews={reviews} />
    </div>
  );
}
