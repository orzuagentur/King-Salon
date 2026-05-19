"use client";

import { motion } from "framer-motion";

import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import {
  salonContact,
  salonReviews,
  salonReviewsSummary,
} from "@/lib/content/salon";
import { containerClassName, sectionClassName } from "@/lib/layout/classes";

export function ReviewsSection() {
  return (
    <section className={sectionClassName} id="bewertungen">
      <div className={containerClassName}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Bewertungen"
            subtitle="Vertrauen entsteht durch Ergebnisse. Unsere Kunden schätzen Präzision, Atmosphäre und den charakteristischen King Salon Look."
            title="Was unsere Kunden sagen."
          />

          <motion.aside
            className="shrink-0 rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              {salonReviewsSummary.source} Bewertungen
            </p>
            <p className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-foreground">
              {salonReviewsSummary.averageRating.toFixed(1)}
            </p>
            <StarRating className="mt-3" rating={salonReviewsSummary.averageRating} />
            <p className="mt-4 text-sm text-muted">
              Basierend auf über {salonReviewsSummary.reviewCount}+ Bewertungen in Celle
            </p>
            <LuxuryButton
              className="mt-6 w-full sm:w-auto"
              href={salonContact.googleMapsUrl}
              rel="noopener noreferrer"
              target="_blank"
              variant="secondary"
            >
              Google Bewertungen
            </LuxuryButton>
          </motion.aside>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {salonReviews.map((review, index) => (
            <motion.blockquote
              className="relative overflow-hidden rounded-[2rem] border border-border bg-surface-elevated p-6 shadow-luxury sm:p-8"
              initial={{ opacity: 0, y: 24 }}
              key={review.name}
              transition={{ delay: index * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <StarRating rating={review.rating} />
              <p className="mt-5 text-base leading-7 text-foreground">&ldquo;{review.text}&rdquo;</p>
              <footer className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                <cite className="text-sm font-semibold not-italic text-foreground">
                  {review.name}
                </cite>
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                  Google
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
