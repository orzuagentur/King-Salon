"use client";

import { useState } from "react";

import {
  createReview,
  deleteReview,
  updateReview,
} from "@/app/admin/(dashboard)/bewertungen/actions";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/lib/reviews/types";

type ReviewsManagerProps = {
  reviews: Review[];
};

export function ReviewsManager({ reviews }: ReviewsManagerProps) {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(reviews.length === 0);

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";
  const compactInputClassName = `${inputClassName} h-11`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {reviews.length} Bewertung{reviews.length === 1 ? "" : "en"} im System
        </p>
        {!showCreateForm && !editingReview ? (
          <button
            className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
            onClick={() => setShowCreateForm(true)}
            type="button"
          >
            Neue Bewertung
          </button>
        ) : null}
      </div>

      {(showCreateForm || editingReview) && (
        <form
          action={editingReview ? updateReview : createReview}
          className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            {editingReview ? "Bewertung bearbeiten" : "Neue Bewertung"}
          </p>
          {editingReview ? <input name="id" type="hidden" value={editingReview.id} /> : null}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-foreground">
              Name *
              <input
                className={compactInputClassName}
                defaultValue={editingReview?.name ?? ""}
                name="name"
                placeholder="z. B. Markus H."
                required
                type="text"
              />
            </label>

            <label className="block text-sm font-medium text-foreground">
              Sterne (1–5) *
              <select
                className={compactInputClassName}
                defaultValue={editingReview?.rating?.toString() ?? "5"}
                name="rating"
                required
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? "Stern" : "Sterne"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-foreground sm:col-span-2">
              Bewertungstext *
              <textarea
                className={`${inputClassName} min-h-32 resize-none`}
                defaultValue={editingReview?.text ?? ""}
                name="text"
                placeholder="Was hat der Kunde geschrieben?"
                required
              />
            </label>

            <label className="block text-sm font-medium text-foreground">
              Sortierung
              <input
                className={compactInputClassName}
                defaultValue={editingReview?.sort_order?.toString() ?? "0"}
                name="sort_order"
                type="number"
              />
            </label>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                className="h-4 w-4 accent-gold"
                defaultChecked={editingReview?.active ?? true}
                name="active"
                type="checkbox"
              />
              <span className="text-sm text-foreground">Auf der Website anzeigen</span>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
              type="submit"
            >
              Speichern
            </button>
            <button
              className="h-11 rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition hover:border-gold hover:text-gold"
              onClick={() => {
                setEditingReview(null);
                setShowCreateForm(false);
              }}
              type="button"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
            Noch keine Bewertungen. Legen Sie die erste Bewertung an.
          </p>
        ) : null}

        {reviews.map((review) => (
          <article
            className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 sm:p-6"
            key={review.id}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">{review.name}</h2>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-3 text-xs text-muted">
                  Sortierung: {review.sort_order} · {review.active ? "Sichtbar" : "Ausgeblendet"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  className="h-10 rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-gold hover:text-gold"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingReview(review);
                  }}
                  type="button"
                >
                  Bearbeiten
                </button>
                <form action={deleteReview}>
                  <input name="id" type="hidden" value={review.id} />
                  <button
                    className="h-10 rounded-full border border-red-500/40 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-300 transition hover:border-red-400"
                    onClick={(event) => {
                      if (!window.confirm(`Bewertung von „${review.name}“ wirklich löschen?`)) {
                        event.preventDefault();
                      }
                    }}
                    type="submit"
                  >
                    Löschen
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
