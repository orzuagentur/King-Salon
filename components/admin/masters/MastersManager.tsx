"use client";

import { useState } from "react";

import { createMaster, deleteMaster, updateMaster } from "@/app/admin/(dashboard)/meister/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { Master } from "@/lib/data/masters";

type MastersManagerProps = {
  masters: Master[];
};

export function MastersManager({ masters }: MastersManagerProps) {
  const [editingMaster, setEditingMaster] = useState<Master | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(masters.length === 0);

  const inputClassName =
    "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {masters.length} Meister{masters.length === 1 ? "" : ""} im System
        </p>
        {!showCreateForm && !editingMaster ? (
          <button
            className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black"
            onClick={() => setShowCreateForm(true)}
            type="button"
          >
            Neuer Meister
          </button>
        ) : null}
      </div>

      {(showCreateForm || editingMaster) && (
        <form
          action={editingMaster ? updateMaster : createMaster}
          className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            {editingMaster ? "Meister bearbeiten" : "Neuer Meister"}
          </p>
          {editingMaster ? <input name="id" type="hidden" value={editingMaster.id} /> : null}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-foreground">
              Name *
              <input
                className={inputClassName}
                defaultValue={editingMaster?.name ?? ""}
                name="name"
                required
                type="text"
              />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Titel
              <input
                className={inputClassName}
                defaultValue={editingMaster?.title ?? ""}
                name="title"
                placeholder="Senior Barber"
                type="text"
              />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Sortierung
              <input
                className={inputClassName}
                defaultValue={editingMaster?.sort_order?.toString() ?? "0"}
                name="sort_order"
                type="number"
              />
            </label>
            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                className="h-4 w-4 accent-gold"
                defaultChecked={editingMaster?.active ?? true}
                name="active"
                type="checkbox"
              />
              <span className="text-sm text-foreground">Auf der Website buchbar</span>
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <AdminSubmitButton>Speichern</AdminSubmitButton>
            <button
              className="h-11 rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em]"
              onClick={() => {
                setEditingMaster(null);
                setShowCreateForm(false);
              }}
              type="button"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {masters.map((master) => (
          <article
            className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 sm:p-6"
            key={master.id}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{master.name}</h2>
                <p className="mt-1 text-sm text-muted">{master.title ?? "—"}</p>
                <p className="mt-2 text-xs text-muted">
                  Sortierung: {master.sort_order} · {master.active ? "Aktiv" : "Inaktiv"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="h-10 rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em]"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingMaster(master);
                  }}
                  type="button"
                >
                  Bearbeiten
                </button>
                <form action={deleteMaster}>
                  <input name="id" type="hidden" value={master.id} />
                  <AdminSubmitButton
                    className="h-10 tracking-[0.2em]"
                    loadingLabel="Wird gelöscht…"
                    onClick={(event) => {
                      if (!window.confirm(`„${master.name}“ wirklich löschen?`)) {
                        event.preventDefault();
                      }
                    }}
                    variant="danger"
                  >
                    Löschen
                  </AdminSubmitButton>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
