"use client";

import { useMemo, useState } from "react";

import {
  clearAiMemoryCache,
  createAiMemory,
  deleteAiMemory,
  updateAiMemory,
} from "@/app/admin/(dashboard)/ki-assistent/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { AiMemoryRow } from "@/lib/ai/context/types";

type AiMemoryManagerProps = {
  memoryItems: AiMemoryRow[];
};

type SortMode = "default" | "title-asc" | "title-desc";

export function AiMemoryManager({ memoryItems }: AiMemoryManagerProps) {
  const [editingItem, setEditingItem] = useState<AiMemoryRow | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(memoryItems.length === 0);
  const [query, setQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";
  const compactInputClassName = `${inputClassName} h-11`;

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const next = memoryItems.filter((item) => {
      if (showActiveOnly && !item.active) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return item.title.toLowerCase().includes(normalized) || item.content.toLowerCase().includes(normalized);
    });

    const sorted = [...next];
    if (sortMode === "title-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMode === "title-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      sorted.sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.sort_order - b.sort_order);
    }

    return sorted;
  }, [memoryItems, query, showActiveOnly, sortMode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 lg:flex-row lg:items-end">
        <label className="block flex-1 text-sm font-medium text-foreground">
          Suche
          <input
            className={compactInputClassName}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Titel oder Inhalt…"
            type="text"
            value={query}
          />
        </label>

        <label className="flex h-11 items-center gap-3 rounded-full border border-border px-4 text-sm text-foreground">
          <input
            checked={showActiveOnly}
            className="h-4 w-4 accent-gold"
            onChange={(event) => setShowActiveOnly(event.target.checked)}
            type="checkbox"
          />
          Nur aktive
        </label>

        <label className="block text-sm font-medium text-foreground lg:w-56">
          Sortierung
          <select
            className={compactInputClassName}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            value={sortMode}
          >
            <option value="default">Standard (Pinned + Reihenfolge)</option>
            <option value="title-asc">Titel A–Z</option>
            <option value="title-desc">Titel Z–A</option>
          </select>
        </label>

        <form action={clearAiMemoryCache}>
          <AdminSubmitButton className="w-full lg:w-auto" loadingLabel="Cache wird geleert…" variant="secondary">
            Cache leeren
          </AdminSubmitButton>
        </form>
      </div>

      {!showCreateForm && !editingItem ? (
        <button
          className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
          onClick={() => setShowCreateForm(true)}
          type="button"
        >
          Neuer Speicher-Eintrag
        </button>
      ) : null}

      {(showCreateForm || editingItem) ? (
        <form
          action={editingItem ? updateAiMemory : createAiMemory}
          className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            {editingItem ? "Speicher bearbeiten" : "Neuer Speicher-Eintrag"}
          </p>
          {editingItem ? <input name="id" type="hidden" value={editingItem.id} /> : null}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-foreground sm:col-span-2">
              Titel *
              <input
                className={compactInputClassName}
                defaultValue={editingItem?.title ?? ""}
                name="title"
                placeholder="z. B. Antwortregel für Terminfragen"
                required
                type="text"
              />
            </label>

            <label className="block text-sm font-medium text-foreground sm:col-span-2">
              Inhalt *
              <textarea
                className={`${inputClassName} min-h-36 resize-y py-3`}
                defaultValue={editingItem?.content ?? ""}
                name="content"
                placeholder="Regel, Erinnerung oder wichtige Info für den Assistenten…"
                required
              />
            </label>

            <label className="block text-sm font-medium text-foreground">
              Sortierung
              <input
                className={compactInputClassName}
                defaultValue={editingItem?.sort_order.toString() ?? "0"}
                name="sort_order"
                type="number"
              />
            </label>

            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  className="h-4 w-4 accent-gold"
                  defaultChecked={editingItem?.active ?? true}
                  name="active"
                  type="checkbox"
                />
                <span className="text-sm text-foreground">Aktiv im Chat</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  className="h-4 w-4 accent-gold"
                  defaultChecked={editingItem?.pinned ?? false}
                  name="pinned"
                  type="checkbox"
                />
                <span className="text-sm text-foreground">Wichtig (anpinnen)</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AdminSubmitButton>Speichern</AdminSubmitButton>
            <button
              className="h-11 rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition hover:border-gold hover:text-gold"
              onClick={() => {
                setEditingItem(null);
                setShowCreateForm(false);
              }}
              type="button"
            >
              Abbrechen
            </button>
          </div>
        </form>
      ) : null}

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
            Keine Speicher-Einträge gefunden.
          </p>
        ) : null}

        {filteredItems.map((item) => (
          <article
            className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 sm:p-6"
            key={item.id}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.pinned ? (
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
                      Wichtig
                    </span>
                  ) : null}
                  {!item.active ? (
                    <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                      Inaktiv
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">{item.content}</p>
                <p className="mt-3 text-xs text-muted">Sortierung: {item.sort_order}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  className="h-10 rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-gold hover:text-gold"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingItem(item);
                  }}
                  type="button"
                >
                  Bearbeiten
                </button>
                <form action={deleteAiMemory}>
                  <input name="id" type="hidden" value={item.id} />
                  <AdminSubmitButton
                    className="h-10 tracking-[0.2em]"
                    loadingLabel="Wird gelöscht…"
                    onClick={(event) => {
                      if (!window.confirm(`Eintrag „${item.title}“ wirklich löschen?`)) {
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

