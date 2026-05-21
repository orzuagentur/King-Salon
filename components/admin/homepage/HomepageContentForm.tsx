"use client";

import { updateHomepageContent } from "@/app/admin/(dashboard)/startseite/actions";
import { HomepageImageField } from "@/components/admin/homepage/HomepageImageField";
import type { HomepageContent } from "@/lib/homepage/types";

type HomepageContentFormProps = {
  content: HomepageContent;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function HomepageContentForm({ content }: HomepageContentFormProps) {
  return (
    <form
      action={updateHomepageContent}
      className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Startseite</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
        Startseite bearbeiten
      </h2>
      <p className="mt-2 text-sm text-muted">
        Name, Bilder, Standort-Karte, Info-Blöcke und Hero-Texte der Startseite anpassen.
      </p>

      <div className="mt-6 space-y-8">
        <section className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Marke
          </h3>

          <label className={labelClassName}>
            Name der Website (Navigation) *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.site_name}
              name="site_name"
              placeholder="King Salon"
              required
              type="text"
            />
            <span className="mt-2 block text-xs text-muted">
              Erscheint oben in der Navigation und im Footer.
            </span>
          </label>
        </section>

        <section className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Hero-Bilder
          </h3>

          <HomepageImageField
            defaultValue={content.hero_background_image}
            description="Großes Hintergrundbild über der gesamten Hero-Sektion (dezent, mit Overlay)."
            hiddenInputName="hero_background_image"
            label="Hintergrundbild"
            placeholder="/images/salon-interior.png"
          />

          <HomepageImageField
            defaultAlt={content.hero_image_alt}
            defaultValue={content.hero_image}
            description="Bild im rechten Karten-Block neben Titel und Buttons."
            hiddenInputName="hero_image"
            label="Hero-Kartenbild"
            placeholder="/images/barber-haarschnitt.png"
          />

          <label className={labelClassName}>
            Alt-Text für Hero-Kartenbild
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_image_alt}
              name="hero_image_alt"
              placeholder="Präziser Haarschnitt im King Salon Celle"
              type="text"
            />
          </label>
        </section>

        <section className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Standort-Karte (auf dem Hero-Bild)
          </h3>
          <p className="text-sm text-muted">
            Texte im kleinen Kasten unten auf dem großen Bild rechts — Straße, Ort und Öffnungszeiten.
          </p>

          <label className={labelClassName}>
            Straße *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_card_street}
              name="hero_card_street"
              placeholder="Hehlentorstraße 8"
              required
              type="text"
            />
          </label>

          <label className={labelClassName}>
            Ort / PLZ *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_card_city}
              name="hero_card_city"
              placeholder="29221 Celle"
              required
              type="text"
            />
          </label>

          <label className={labelClassName}>
            Öffnungszeiten (kurz) *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_card_hours}
              name="hero_card_hours"
              placeholder="Montag bis Freitag 09:00 - 19:00, Samstag 09:00 - 16:00"
              required
              type="text"
            />
          </label>
        </section>

        <section className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Info-Blöcke unten (Standort & Stil)
          </h3>
          <p className="text-sm text-muted">
            Die drei Kästchen unter dem Hero — „Standort“ und „Stil“ sind hier editierbar. „Kontakt“
            zeigt automatisch die Telefonnummer aus Kontakt.
          </p>

          <label className={labelClassName}>
            Standort *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_stat_location}
              name="hero_stat_location"
              placeholder="Celle Zentrum"
              required
              type="text"
            />
          </label>

          <label className={labelClassName}>
            Stil *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_stat_style}
              name="hero_stat_style"
              placeholder="Luxury Grooming"
              required
              type="text"
            />
          </label>
        </section>

        <section className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Hero-Texte
          </h3>

          <label className={labelClassName}>
            Eyebrow (kleine Überschrift) *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_eyebrow}
              name="hero_eyebrow"
              placeholder="Luxus-Barbershop & Hairstylist in Celle"
              required
              type="text"
            />
          </label>

          <label className={labelClassName}>
            Haupttitel *
            <input
              className={`${inputClassName} h-11`}
              defaultValue={content.hero_title}
              name="hero_title"
              placeholder="Präzision. Stil. Königliche Ausstrahlung."
              required
              type="text"
            />
          </label>

          <label className={labelClassName}>
            Untertitel *
            <textarea
              className={`${inputClassName} min-h-28 resize-none`}
              defaultValue={content.hero_subtitle}
              name="hero_subtitle"
              placeholder="Premium-Haarschnitte, Fades, Bartpflege..."
              required
            />
          </label>
        </section>
      </div>

      <button
        className="mt-6 h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
        type="submit"
      >
        Startseite speichern
      </button>
    </form>
  );
}
