"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { containerClassName, sectionClassName } from "@/lib/layout/classes";
import { serviceCategories } from "@/lib/content/salon";
import type { Service } from "@/lib/data/services";
import { formatPrice } from "@/lib/format/price";

type ServicesSectionClientProps = {
  services: Service[];
};

export function ServicesSectionClient({ services }: ServicesSectionClientProps) {
  const useDatabaseServices = services.length > 0;

  return (
    <section className={sectionClassName} id="leistungen">
      <div className={containerClassName}>
        <SectionHeading
          eyebrow="Leistungen"
          subtitle="King Salon Celle verbindet exakte Barber-Technik mit ruhiger Premium-Atmosphäre und einem Look, der auch nach dem Termin wirkt."
          title="Grooming mit klarer Handschrift."
        />

        {useDatabaseServices ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <motion.article
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-luxury"
                initial={{ opacity: 0, y: 26 }}
                key={service.id}
                transition={{ delay: index * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-80px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  {service.duration ?? "King Salon"}
                </p>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted">{service.description}</p>
                <p className="mt-6 text-xl font-semibold tracking-[-0.04em] text-gold-soft">
                  {formatPrice(service.price)}
                </p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {serviceCategories.map((category, index) => (
              <motion.article
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-luxury"
                initial={{ opacity: 0, y: 26 }}
                key={category.title}
                transition={{ delay: index * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-80px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  {category.eyebrow}
                </p>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {category.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted">{category.description}</p>

                <ul className="mt-8 space-y-3">
                  {category.services.map((item) => (
                    <li
                      className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm text-foreground last:border-b-0 last:pb-0"
                      key={item}
                    >
                      <span>{item}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
