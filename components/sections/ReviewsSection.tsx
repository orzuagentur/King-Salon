import { ReviewsSectionClient } from "@/components/sections/ReviewsSectionClient";
import { getActiveReviews, getActiveReviewsSummary } from "@/lib/data/reviews";
import { getSalonContact } from "@/lib/data/settings";

export async function ReviewsSection() {
  const [reviews, summary, contact] = await Promise.all([
    getActiveReviews(),
    getActiveReviewsSummary(),
    getSalonContact(),
  ]);

  return (
    <ReviewsSectionClient
      googleMapsUrl={contact.googleMapsUrl}
      reviews={reviews}
      summary={summary}
    />
  );
}
