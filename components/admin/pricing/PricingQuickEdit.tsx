"use client";

import { updateServicePrice } from "@/app/admin/(dashboard)/leistungen/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { Service } from "@/lib/data/services";
import { formatPriceLabel } from "@/lib/format/price";

type PricingQuickEditProps = {
  services: Service[];
};

export function PricingQuickEdit({ services }: PricingQuickEditProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Preisliste</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
        Preise schnell bearbeiten
      </h2>
      <p className="mt-2 text-sm text-muted">
        Aktualisieren Sie Preise direkt. Bei 0 EUR wird auf der Website „Preis im Salon“ angezeigt.
      </p>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <form
            action={updateServicePrice}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-end"
            key={service.id}
          >
            <input name="id" type="hidden" value={service.id} />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{service.title}</p>
              <p className="mt-1 text-xs text-muted">
                Aktuell auf der Website: {formatPriceLabel(service.price)}
              </p>
            </div>

            <label className="block text-sm font-medium text-foreground sm:w-40">
              Preis (EUR)
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-gold"
                defaultValue={service.price.toString()}
                min="0"
                name="price"
                required
                step="0.01"
                type="number"
              />
            </label>

            <AdminSubmitButton className="shrink-0 px-5 tracking-[0.2em]">
              Speichern
            </AdminSubmitButton>
          </form>
        ))}
      </div>
    </section>
  );
}
