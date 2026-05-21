export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  active: boolean;
  sort_order: number;
};

export type ReviewDisplay = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

export type ReviewsSummary = {
  averageRating: number;
  reviewCount: number;
  source: string;
};
