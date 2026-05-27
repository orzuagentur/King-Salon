"use client";

import { useMemo, useState } from "react";

import {
  createAiKnowledge,
  deleteAiKnowledge,
  updateAiKnowledge,
} from "@/app/admin/(dashboard)/ki-assistent/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { AiKnowledgeRow } from "@/lib/ai/context/types";

type AiKnowledgeManagerProps = {
  knowledge: AiKnowledgeRow[];
};

type SortMode = "default" | "category-asc" | "category-desc" | "title-asc" | "title-desc";

export function AiKnowledgeManager({ knowledge }: AiKnowledgeManagerProps) {
  const [editingItem, setEditingItem] = useState<AiKnowledgeRow | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(knowledge.length === 0);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";
  const compactInputClassName = `${inputClassName} h-11`;

  const categories = useMemo(
    () => Array.from(new Set(knowledge.map((item) => item.category))).sort((a, b) => a.localeCompare(b)),
    [knowledge],
  );

  const filteredKnowledge = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const next = knowledge.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      if (!matchesCategory) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalized) ||
        item.content.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
      );
    });

    const sorted = [...next];
    switch (sortMode) {
      case "category-asc":
        sorted.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
        break;
      case "category-desc":
        sorted.sort((a, b) => b.category.localeCompare(a.category) || a.title.localeCompare(b.title));
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.pinned) - Number(a.pinned) ||
            a.category.localeCompare(b.category) ||
            a.sort_order - b.sort_order,
        );
    }

    return sorted;
  }, [categoryFilter, knowledge, query, sortMode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm font-medium text-foreground">
          Suche
          <input
            className={compactInputClassName}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Titel, Inhalt oder Kategorie…"
            type="text"
            value={query}
          />
        </label>
        <label className="block text-sm font-medium text-foreground sm:w-56">
          Kategorie
          <select
            className={compactInputClassName}
            onChange={(event) => setCategoryFilter(event.target.value)}
            value={categoryFilter}
          >
            <option value="all">Alle Kategorien</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-foreground sm:w-56">
          Sortierung
          <select
            className={compactInputClassName}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            value={sortMode}
          >
            <option value="default">Standard (Pinned + Reihenfolge)</option>
            <option value="category-asc">Kategorie A–Z</option>
            <option value="category-desc">Kategorie Z–A</option>
            <option value="title-asc">Titel A–Z</option>
            <option value="title-desc">Titel Z–A</option>
          </select>
        </label>
      </div>

      {!showCreateForm && !editingItem ? (
        <button
          className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
          onClick={() => setShowCreateForm(true)}
          type="button"
        >
          Neuer Eintrag
        </button>
      ) : null}

      {(showCreateForm || editingItem) ? (
        <form
          action={editingItem ? updateAiKnowledge : createAiKnowledge}
          className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            {editingItem ? "Eintrag bearbeiten" : "Neuer Wissenseintrag"}
          </p>
          {editingItem ? <input name="id" type="hidden" value={editingItem.id} /> : null}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-foreground">
              Kategorie *
              <input
                className={compactInputClassName}
                defaultValue={editingItem?.category ?? ""}
                name="category"
                placeholder="z. B. FAQ"
                required
                type="text"
              />
            </label>

            <label className="block text-sm font-medium text-foreground">
              Titel *
              <input
                className={compactInputClassName}
                defaultValue={editingItem?.title ?? ""}
                name="title"
                placeholder="z. B. Termin buchen"
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
                placeholder="Antwort, Richtlinie oder Info für den Assistenten…"
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
                <span className="text-sm text-foreground">Anpinnen (hohe Priorität)</span>
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
        {filteredKnowledge.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
            Keine Einträge gefunden. Passen Sie Filter an oder erstellen Sie einen neuen Eintrag.
          </p>
        ) : null}

        {filteredKnowledge.map((item) => (
          <article
            className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 sm:p-6"
            key={item.id}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
                    {item.category}
                  </span>
                  {item.pinned ? (
                    <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                      Pinned
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
                <form action={deleteAiKnowledge}>
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

