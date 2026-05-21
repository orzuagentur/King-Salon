"use client";

import Image from "next/image";
import { useState } from "react";

import {
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "@/app/admin/(dashboard)/galerie/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { GalleryForm } from "@/components/admin/gallery/GalleryForm";
import type { GalleryItem } from "@/lib/data/gallery";
import { resolveImageUrl } from "@/lib/storage/urls";

type GalleryManagerProps = {
  items: GalleryItem[];
};

export function GalleryManager({ items }: GalleryManagerProps) {
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(items.length === 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {items.length} Bild{items.length === 1 ? "" : "er"} in der Galerie
        </p>
        {!showCreateForm && !editingItem ? (
          <button
            className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
            onClick={() => setShowCreateForm(true)}
            type="button"
          >
            Neues Bild
          </button>
        ) : null}
      </div>

      {showCreateForm && !editingItem ? (
        <GalleryForm
          action={createGalleryItem}
          onCancel={() => setShowCreateForm(false)}
          submitLabel="Bild hinzufügen"
          title="Neues Galeriebild"
        />
      ) : null}

      {editingItem ? (
        <GalleryForm
          action={updateGalleryItem}
          item={editingItem}
          onCancel={() => setEditingItem(null)}
          submitLabel="Änderungen speichern"
          title="Galeriebild bearbeiten"
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const imageSrc = resolveImageUrl(item.image, "gallery");

          return (
            <article
              className="overflow-hidden rounded-[1.75rem] border border-border bg-surface-elevated shadow-luxury"
              key={item.id}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  alt={item.alt ?? item.title ?? "Galerie"}
                  className="object-cover"
                  fill
                  sizes="400px"
                  src={imageSrc}
                />
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    {item.title ?? "Ohne Titel"}
                  </h2>
                  <p className="mt-1 text-xs text-muted">Sortierung: {item.sort_order}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
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
                  <form action={deleteGalleryItem}>
                    <input name="id" type="hidden" value={item.id} />
                    <input name="image" type="hidden" value={item.image} />
                    <AdminSubmitButton
                      className="h-10 w-full tracking-[0.2em] sm:w-auto"
                      loadingLabel="Wird gelöscht…"
                      onClick={(event) => {
                        if (!window.confirm("Galeriebild wirklich löschen?")) {
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
          );
        })}
      </div>

      {items.length === 0 && !showCreateForm ? (
        <p className="rounded-[1.75rem] border border-dashed border-border bg-surface/60 p-8 text-center text-sm text-muted">
          Noch keine Galeriebilder vorhanden. Laden Sie das erste Bild hoch.
        </p>
      ) : null}
    </div>
  );
}
