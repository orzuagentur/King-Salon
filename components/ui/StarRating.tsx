type StarRatingProps = {
  className?: string;
  rating: number;
  max?: number;
};

export function StarRating({ className = "", rating, max = 5 }: StarRatingProps) {
  return (
    <div
      aria-label={`${rating} von ${max} Sternen`}
      className={`flex gap-1 ${className}`}
      role="img"
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = index < rating;

        return (
          <span
            className={`text-sm ${filled ? "text-gold" : "text-border"}`}
            key={index}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
