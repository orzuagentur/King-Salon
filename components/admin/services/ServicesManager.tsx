"use client";

import { useState } from "react";

import { createService, deleteService, updateService } from "@/app/admin/(dashboard)/leistungen/actions";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import type { Service } from "@/lib/data/services";
import { formatPrice } from "@/lib/format/price";

type ServicesManagerProps = {
  services: Service[];
};

export function ServicesManager({ services }: ServicesManagerProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(services.length === 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {services.length} Leistung{services.length === 1 ? "" : "en"} im System
        </p>
        {!showCreateForm && !editingService ? (
          <button
            className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
            onClick={() => setShowCreateForm(true)}
            type="button"
          >
            Neue Leistung
          </button>
        ) : null}
      </div>

      {showCreateForm && !editingService ? (
        <ServiceForm
          action={createService}
          onCancel={() => setShowCreateForm(false)}
          submitLabel="Leistung erstellen"
          title="Neue Leistung"
        />
      ) : null}

      {editingService ? (
        <ServiceForm
          action={updateService}
          onCancel={() => setEditingService(null)}
          service={editingService}
          submitLabel="Änderungen speichern"
          title="Leistung bearbeiten"
        />
      ) : null}

      <div className="space-y-4">
        {services.map((service) => (
          <article
            className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 shadow-luxury sm:p-6"
            key={service.id}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{service.title}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      service.active
                        ? "border border-gold/30 bg-gold/10 text-gold-soft"
                        : "border border-border bg-background text-muted"
                    }`}
                  >
                    {service.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{service.description}</p>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted">Preis</dt>
                    <dd className="font-semibold text-gold-soft">{formatPrice(service.price)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Dauer</dt>
                    <dd className="text-foreground">{service.duration ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Sortierung</dt>
                    <dd className="text-foreground">{service.sort_order}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  className="h-10 rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-gold hover:text-gold"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingService(service);
                  }}
                  type="button"
                >
                  Bearbeiten
                </button>
                <form action={deleteService}>
                  <input name="id" type="hidden" value={service.id} />
                  <button
                    className="h-10 w-full rounded-full border border-red-500/40 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-300 transition hover:border-red-400 hover:text-red-200 sm:w-auto"
                    onClick={(event) => {
                      if (!window.confirm(`„${service.title}“ wirklich löschen?`)) {
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

        {services.length === 0 && !showCreateForm ? (
          <p className="rounded-[1.75rem] border border-dashed border-border bg-surface/60 p-8 text-center text-sm text-muted">
            Noch keine Leistungen vorhanden. Erstellen Sie die erste Leistung.
          </p>
        ) : null}
      </div>
    </div>
  );
}
