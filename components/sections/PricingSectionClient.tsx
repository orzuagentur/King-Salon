"use client";

import { motion } from "framer-motion";

import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingCards } from "@/lib/content/salon";
import type { Service } from "@/lib/data/services";
import { formatPriceLabel } from "@/lib/format/price";
import { containerClassName, sectionClassName } from "@/lib/layout/classes";

type PricingSectionClientProps = {
  services: Service[];
};

function buildFeatures(service: Service) {
  const features = [];

  if (service.duration) {
    features.push(service.duration);
  }

  features.push("Persönliche Beratung");

  return features;
}

export function PricingSectionClient({ services }: PricingSectionClientProps) {
  const pricingServices = services.slice(0, 3);
  const useDatabasePricing = pricingServices.length > 0;

  return (
    <section className={sectionClassName} id="preise">
      <div className={containerClassName}>
        <SectionHeading
          eyebrow="Preise"
          subtitle="Transparente Pakete für schnelle Orientierung. Die finalen Preise werden im Salon passend zu Aufwand, Länge und Styling-Wunsch abgestimmt."
          title="Premium-Service ohne Kompromisse."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {useDatabasePricing
            ? pricingServices.map((service, index) => (
                <motion.article
                  className="relative flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface-elevated p-6 shadow-luxury sm:min-h-[420px] sm:rounded-[2rem]"
                  initial={{ opacity: 0, y: 26 }}
                  key={service.id}
                  transition={{ delay: index * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                      {service.duration ?? "King Salon"}
                    </p>
                    <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted">{service.description}</p>
                  </div>

                  <p className="relative mt-8 text-2xl font-semibold tracking-[-0.04em] text-gold-soft">
                    {formatPriceLabel(service.price)}
                  </p>

                  <ul className="relative mt-8 space-y-3">
                    {buildFeatures(service).map((feature) => (
                      <li className="flex items-center gap-3 text-sm text-foreground" key={feature}>
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <LuxuryButton className="relative mt-auto w-full" href="#termin">
                    Termin anfragen
                  </LuxuryButton>
                </motion.article>
              ))
            : pricingCards.map((card, index) => (
                <motion.article
                  className="relative flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface-elevated p-6 shadow-luxury sm:min-h-[420px] sm:rounded-[2rem]"
                  initial={{ opacity: 0, y: 26 }}
                  key={card.title}
                  transition={{ delay: index * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                      {card.label}
                    </p>
                    <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted">{card.description}</p>
                  </div>

                  <p className="relative mt-8 text-2xl font-semibold tracking-[-0.04em] text-gold-soft">
                    {card.price}
                  </p>

                  <ul className="relative mt-8 space-y-3">
                    {card.features.map((feature) => (
                      <li className="flex items-center gap-3 text-sm text-foreground" key={feature}>
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <LuxuryButton className="relative mt-auto w-full" href="#termin">
                    Termin anfragen
                  </LuxuryButton>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
}
