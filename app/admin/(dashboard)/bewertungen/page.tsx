import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReviewsManager } from "@/components/admin/reviews/ReviewsManager";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllReviews } from "@/lib/data/reviews";

export const metadata: Metadata = {
  title: "Bewertungen | King Salon Admin",
};

export default async function AdminReviewsPage() {
  const { admin } = await requireAdmin();
  const reviews = await getAllReviews();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Kundenbewertungen hinzufügen, bearbeiten und auf der Website ein- oder ausblenden."
        email={admin.email}
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Bewertungen"
      />

      <ReviewsManager reviews={reviews} />
    </div>
  );
}
