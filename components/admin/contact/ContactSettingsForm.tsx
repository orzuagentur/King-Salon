import { updateContactSettings } from "@/app/admin/(dashboard)/kontakt/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { defaultSalonContact } from "@/lib/contact/defaults";
import { mapSettingsToContact } from "@/lib/contact/map-settings";
import type { Settings } from "@/lib/data/settings";

type ContactSettingsFormProps = {
  settings: Settings | null;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function ContactSettingsForm({ settings }: ContactSettingsFormProps) {
  const contact = settings ? mapSettingsToContact(settings) : defaultSalonContact;

  return (
    <form
      action={updateContactSettings}
      className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Kontakt</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
        Kontaktdaten bearbeiten
      </h2>
      <p className="mt-2 text-sm text-muted">
        Diese Angaben erscheinen im Kontaktbereich, in der Karte, in der Navigation (Anrufen) und
        bei der schwebenden Anruf-Schaltfläche auf dem Handy.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className={labelClassName}>
          Telefon *
          <input
            className={inputClassName}
            defaultValue={contact.phoneDisplay}
            name="phone"
            placeholder="+49 173 8882560"
            required
            type="tel"
          />
          <span className="mt-2 block text-xs text-muted">
            Format mit Ländervorwahl, z. B. +49 173 8882560 — wird für Anruf-Links automatisch
            umgewandelt.
          </span>
        </label>

        <label className={labelClassName}>
          E-Mail
          <input
            className={inputClassName}
            defaultValue={settings?.email ?? ""}
            name="email"
            placeholder="info@kingsalon-celle.de"
            type="email"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Adresse *
          <input
            className={inputClassName}
            defaultValue={
              settings?.address ??
              `${contact.address.street}, ${contact.address.city}, ${contact.address.country}`
            }
            name="address"
            placeholder="Hehlentorstraße 8, 29221 Celle, Deutschland"
            required
            type="text"
          />
          <span className="mt-2 block text-xs text-muted">
            Format: Straße, PLZ Ort, Land (durch Kommas getrennt)
          </span>
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          WhatsApp-Link
          <input
            className={inputClassName}
            defaultValue={contact.whatsapp}
            name="whatsapp"
            placeholder="https://wa.me/491738882560"
            type="url"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Instagram-URL
          <input
            className={inputClassName}
            defaultValue={contact.instagram}
            name="instagram"
            placeholder="https://www.instagram.com/_king_salon_/"
            type="url"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Facebook-URL
          <input
            className={inputClassName}
            defaultValue={contact.facebook}
            name="facebook"
            placeholder="https://m.facebook.com/kingsaloncelle/"
            type="url"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Google Maps-URL
          <input
            className={inputClassName}
            defaultValue={contact.googleMapsUrl}
            name="google_maps_url"
            placeholder="https://maps.app.goo.gl/..."
            type="url"
          />
        </label>
      </div>

      <AdminSubmitButton className="mt-6">Kontaktdaten speichern</AdminSubmitButton>
    </form>
  );
}
