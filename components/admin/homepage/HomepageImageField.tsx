"use client";

import Image from "next/image";
import { useState } from "react";

import { resolveHomepageImageUrl } from "@/lib/homepage/images";
import { uploadHomepageImage } from "@/lib/storage/upload";

type HomepageImageFieldProps = {
  defaultAlt?: string;
  defaultValue: string;
  description: string;
  hiddenInputName: string;
  label: string;
  placeholder?: string;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function HomepageImageField({
  defaultAlt,
  defaultValue,
  description,
  hiddenInputName,
  label,
  placeholder,
}: HomepageImageFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const previewSrc = imageUrl ? resolveHomepageImageUrl(imageUrl) : null;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setIsUploading(true);

    const result = await uploadHomepageImage(file);

    setIsUploading(false);

    if ("error" in result) {
      setUploadError(result.error.message);
      return;
    }

    setImageUrl(result.data.publicUrl);
  }

  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <p className={labelClassName}>{label}</p>
      <p className="mt-1 text-xs text-muted">{description}</p>

      <input name={hiddenInputName} type="hidden" value={imageUrl} />

      <label className={`${labelClassName} mt-4`}>
        Bild hochladen
        <input
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-black"
          disabled={isUploading}
          onChange={handleFileChange}
          type="file"
        />
      </label>

      <label className={`${labelClassName} mt-4`}>
        Bild-URL (alternativ)
        <input
          className={inputClassName}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={imageUrl}
        />
      </label>

      {uploadError ? <p className="mt-3 text-sm text-red-300">{uploadError}</p> : null}
      {isUploading ? <p className="mt-3 text-sm text-muted">Bild wird hochgeladen…</p> : null}

      {previewSrc ? (
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-border">
          <Image
            alt={defaultAlt ?? "Vorschau"}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            src={previewSrc}
          />
        </div>
      ) : null}
    </div>
  );
}
