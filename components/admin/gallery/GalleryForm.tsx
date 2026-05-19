"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryItem } from "@/lib/data/gallery";
import { resolveImageUrl } from "@/lib/storage/urls";
import { uploadGalleryImage } from "@/lib/storage/upload";

type GalleryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  item?: GalleryItem;
  onCancel?: () => void;
  submitLabel: string;
  title: string;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

const categorySuggestions = [
  "Salon",
  "Atmosphäre",
  "Haarschnitt",
  "Styling",
  "Technik",
  "Erlebnis",
  "Team",
  "Damen",
];

export function GalleryForm({ action, item, onCancel, submitLabel, title }: GalleryFormProps) {
  const [imageUrl, setImageUrl] = useState(item?.image ?? "");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const previewSrc = imageUrl ? resolveImageUrl(imageUrl, "gallery") : null;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setIsUploading(true);

    const result = await uploadGalleryImage(file);

    setIsUploading(false);

    if ("error" in result) {
      setUploadError(result.error.message);
      return;
    }

    setImageUrl(result.data.publicUrl);
  }

  return (
    <form action={action} className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">{title}</p>

      {item ? <input name="id" type="hidden" value={item.id} /> : null}
      <input name="image" required type="hidden" value={imageUrl} />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className={`${labelClassName} sm:col-span-2`}>
          Bild hochladen
          <input
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-black"
            disabled={isUploading}
            onChange={handleFileChange}
            type="file"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Bild-URL (alternativ)
          <input
            className={inputClassName}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/images/barber-haarschnitt.png"
            type="text"
            value={imageUrl}
          />
        </label>

        {uploadError ? (
          <p className="sm:col-span-2 text-sm text-red-300">{uploadError}</p>
        ) : null}

        {isUploading ? (
          <p className="sm:col-span-2 text-sm text-muted">Bild wird hochgeladen…</p>
        ) : null}

        {previewSrc ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border sm:col-span-2">
            <Image
              alt="Vorschau"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src={previewSrc}
            />
          </div>
        ) : null}

        <label className={labelClassName}>
          Kategorie *
          <input
            className={inputClassName}
            defaultValue={item?.category ?? ""}
            list="gallery-categories"
            name="category"
            placeholder="z. B. Haarschnitt"
            required
            type="text"
          />
          <datalist id="gallery-categories">
            {categorySuggestions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <label className={labelClassName}>
          Sortierung
          <input
            className={inputClassName}
            defaultValue={item?.sort_order?.toString() ?? "0"}
            name="sort_order"
            type="number"
          />
        </label>

        <label className={labelClassName}>
          Titel
          <input
            className={inputClassName}
            defaultValue={item?.title ?? ""}
            name="title"
            placeholder="z. B. Präziser Schnitt"
            type="text"
          />
        </label>

        <label className={labelClassName}>
          Alt-Text
          <input
            className={inputClassName}
            defaultValue={item?.alt ?? ""}
            name="alt"
            placeholder="Beschreibung für Barrierefreiheit"
            type="text"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!imageUrl || isUploading}
          type="submit"
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            className="h-11 rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition hover:border-gold hover:text-gold"
            onClick={onCancel}
            type="button"
          >
            Abbrechen
          </button>
        ) : null}
      </div>
    </form>
  );
}
