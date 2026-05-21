import { updateSeoSettings } from "@/app/admin/(dashboard)/seo/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { SeoSettings } from "@/lib/seo/defaults";

type SeoSettingsFormProps = {
  seo: SeoSettings;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function SeoSettingsForm({ seo }: SeoSettingsFormProps) {
  return (
    <form
      action={updateSeoSettings}
      className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">SEO</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
        Meta-Daten bearbeiten
      </h2>
      <p className="mt-2 text-sm text-muted">
        Diese Angaben steuern den Seitentitel und die Beschreibung in Google und bei Social-Media-Vorschauen.
      </p>

      <div className="mt-6 space-y-5">
        <label className={labelClassName}>
          Meta-Titel *
          <input
            className={`${inputClassName} h-11`}
            defaultValue={seo.seo_title}
            maxLength={70}
            name="seo_title"
            placeholder="King Salon Celle | Luxus-Barbershop"
            required
            type="text"
          />
          <span className="mt-2 block text-xs text-muted">Empfohlen: max. 60 Zeichen</span>
        </label>

        <label className={labelClassName}>
          Meta-Beschreibung *
          <textarea
            className={`${inputClassName} min-h-32 resize-none`}
            defaultValue={seo.seo_description}
            maxLength={160}
            name="seo_description"
            placeholder="Premium-Haarschnitte, Fades und Bartpflege in Celle..."
            required
          />
          <span className="mt-2 block text-xs text-muted">Empfohlen: max. 155 Zeichen</span>
        </label>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Vorschau Google
          </p>
          <p className="mt-3 text-base font-medium text-[#8ab4f8]">{seo.seo_title}</p>
          <p className="mt-1 text-xs text-[#3c4043]">kingsalon-celle.de</p>
          <p className="mt-2 text-sm leading-6 text-[#4d5156]">{seo.seo_description}</p>
        </div>
      </div>

      <AdminSubmitButton className="mt-6">SEO speichern</AdminSubmitButton>
    </form>
  );
}
