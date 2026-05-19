import { updateHomepageContent } from "@/app/admin/(dashboard)/startseite/actions";
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
        Hero-Bereich bearbeiten
      </h2>
      <p className="mt-2 text-sm text-muted">
        Diese Texte erscheinen prominent im Hero-Bereich der Startseite.
      </p>

      <div className="mt-6 space-y-5">
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
      </div>

      <button
        className="mt-6 h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
        type="submit"
      >
        Hero speichern
      </button>
    </form>
  );
}
