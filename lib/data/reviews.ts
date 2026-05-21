import { salonReviews, salonReviewsSummary } from "@/lib/content/salon";
import type { Review, ReviewDisplay, ReviewsSummary } from "@/lib/reviews/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type DbReview = Database["public"]["Tables"]["reviews"]["Row"];

const fallbackReviews: ReviewDisplay[] = salonReviews.map((review, index) => ({
  id: `fallback-${index}`,
  name: review.name,
  text: review.text,
  rating: review.rating,
}));

function mapRowToReview(row: DbReview): Review {
  return {
    id: row.id,
    name: row.name,
    text: row.text,
    rating: row.rating,
    active: row.active,
    sort_order: row.sort_order,
  };
}

function mapRowToDisplay(row: DbReview): ReviewDisplay {
  return {
    id: row.id,
    name: row.name,
    text: row.text,
    rating: row.rating,
  };
}

export function buildReviewsSummary(reviews: ReviewDisplay[]): ReviewsSummary {
  if (reviews.length === 0) {
    return salonReviewsSummary;
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return {
    averageRating,
    reviewCount: salonReviewsSummary.reviewCount,
    source: salonReviewsSummary.source,
  };
}

export async function getActiveReviews(): Promise<ReviewDisplay[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, text, rating")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackReviews;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    text: row.text,
    rating: row.rating,
  }));
}

export async function getActiveReviewsSummary(): Promise<ReviewsSummary> {
  const reviews = await getActiveReviews();
  return buildReviewsSummary(reviews);
}

export async function getAllReviews(): Promise<Review[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(mapRowToReview);
}
