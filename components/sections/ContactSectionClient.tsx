"use client";

import { motion } from "framer-motion";

import { ContactForm } from "@/components/sections/ContactForm";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getFacebookDisplay,
  getInstagramDisplay,
} from "@/lib/contact/parse";
import type { SalonContact } from "@/lib/contact/types";
import type { MasterOption } from "@/lib/booking/types";
import type { OpeningHoursEntry } from "@/lib/opening-hours/types";
import { containerClassName, sectionClassName } from "@/lib/layout/classes";

type ContactSectionClientProps = {
  contact: SalonContact;
  masters: MasterOption[];
  openingHours: OpeningHoursEntry[];
};

export function ContactSectionClient({
  contact,
  masters,
  openingHours,
}: ContactSectionClientProps) {
  const contactLinks = [
    {
      href: `tel:${contact.phone}`,
      label: "Telefon",
      value: contact.phoneDisplay,
    },
    {
      href: contact.instagram,
      label: "Instagram",
      value: getInstagramDisplay(contact.instagram),
    },
    {
      href: contact.facebook,
      label: "Facebook",
      value: getFacebookDisplay(),
    },
    {
      href: contact.googleMapsUrl,
      label: "Google Maps",
      value: "Route planen",
    },
  ];

  return (
    <section className={sectionClassName} id="kontakt">
      <div className={containerClassName}>
        <SectionHeading
          eyebrow="Kontakt"
          subtitle="Besuchen Sie King Salon Celle in der Hehlentorstraße – für Premium-Haarschnitte, Bartpflege und einen Look mit starker Ausstrahlung."
          title="Ihr Termin in Celle."
        />

        <motion.div
          className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.1fr]"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
            <article className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Adresse</p>
              <address className="mt-4 not-italic">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {contact.address.street}
                </p>
                <p className="mt-2 text-base text-muted">
                  {contact.address.city}, {contact.address.country}
                </p>
              </address>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <LuxuryButton href={contact.googleMapsUrl} rel="noopener noreferrer" target="_blank">
                  Route öffnen
                </LuxuryButton>
                <LuxuryButton href={`tel:${contact.phone}`} variant="secondary">
                  Jetzt anrufen
                </LuxuryButton>
              </div>
            </article>

            <div className="grid gap-3 sm:grid-cols-2">
              {contactLinks.map((link) => (
                <a
                  className="touch-press flex min-h-[4.5rem] flex-col justify-center rounded-[1.5rem] border border-border bg-surface-elevated p-5 transition active:border-gold active:bg-surface sm:min-h-0"
                  href={link.href}
                  key={link.label}
                  rel="noopener noreferrer"
                  target={link.href.startsWith("tel:") ? undefined : "_blank"}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                    {link.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{link.value}</p>
                </a>
              ))}
            </div>

            <article className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
                Öffnungszeiten
              </p>
              <dl className="mt-5 space-y-3">
                {openingHours.map((entry) => (
                  <div
                    className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                    key={entry.day}
                  >
                    <dt className="text-sm text-muted">{entry.day}</dt>
                    <dd
                      className={`text-sm font-semibold ${
                        entry.hours === "Geschlossen" ? "text-muted" : "text-foreground"
                      }`}
                    >
                      {entry.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-luxury">
              <iframe
                allowFullScreen
                className="min-h-[min(52vw,360px)] w-full grayscale-[20%] invert-[92%] contrast-[90%] sm:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={contact.googleMapsEmbedUrl}
                title="King Salon Celle auf Google Maps"
              />
            </div>
            <ContactForm masters={masters} whatsappUrl={contact.whatsapp} />
          </div>
        </motion.div>

        <footer className="mt-16 border-t border-border pt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground">
            King Salon Celle
          </p>
          <p className="mt-3 text-xs text-muted">
            © {new Date().getFullYear()} King Salon. Alle Rechte vorbehalten.
          </p>
        </footer>
      </div>
    </section>
  );
}
