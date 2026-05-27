"use client";

import Image from "next/image";
import { useState } from "react";

import { inferHomepageBackgroundMediaType } from "@/lib/homepage/media";
import { resolveHomepageImageUrl } from "@/lib/homepage/images";
import type { HomepageBackgroundMediaType } from "@/lib/homepage/types";
import { uploadHomepageBackgroundMedia } from "@/lib/storage/upload";

type HomepageBackgroundMediaFieldProps = {
  defaultMediaType: HomepageBackgroundMediaType;
  defaultValue: string;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function HomepageBackgroundMediaField({
  defaultMediaType,
  defaultValue,
}: HomepageBackgroundMediaFieldProps) {
  const [mediaUrl, setMediaUrl] = useState(defaultValue);
  const [mediaType, setMediaType] = useState<HomepageBackgroundMediaType>(
    inferHomepageBackgroundMediaType(defaultValue, defaultMediaType),
  );
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const previewSrc = mediaUrl ? resolveHomepageImageUrl(mediaUrl) : null;
  const previewIsVideo = mediaType === "video";

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setIsUploading(true);

    const result = await uploadHomepageBackgroundMedia(file);

    setIsUploading(false);

    if ("error" in result) {
      setUploadError(result.error.message);
      return;
    }

    const nextType = file.type.startsWith("video/") ? "video" : "image";
    setMediaType(nextType);
    setMediaUrl(result.data.publicUrl);
  }

  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <p className={labelClassName}>Hintergrund (Bild oder Video)</p>
      <p className="mt-1 text-xs text-muted">
        Großes Hintergrundmedium über der gesamten Hero-Sektion (dezent, mit Overlay). Videos
        werden automatisch stumm und in Endlosschleife abgespielt.
      </p>

      <input name="hero_background_image" type="hidden" value={mediaUrl} />
      <input name="hero_background_media_type" type="hidden" value={mediaType} />

      <fieldset className="mt-4">
        <legend className="sr-only">Medientyp</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "image", label: "Bild" },
              { value: "video", label: "Video" },
            ] as const
          ).map((option) => (
            <button
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                mediaType === option.value
                  ? "border-gold bg-gold text-black"
                  : "border-border text-muted hover:border-gold hover:text-gold"
              }`}
              key={option.value}
              onClick={() => setMediaType(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className={`${labelClassName} mt-4`}>
        {previewIsVideo ? "Video hochladen" : "Bild hochladen"}
        <input
          accept={
            previewIsVideo
              ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              : "image/jpeg,image/png,image/webp"
          }
          className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-black"
          disabled={isUploading}
          onChange={handleFileChange}
          type="file"
        />
      </label>

      <label className={`${labelClassName} mt-4`}>
        Medien-URL (alternativ)
        <input
          className={inputClassName}
          onChange={(event) => {
            const nextUrl = event.target.value;
            setMediaUrl(nextUrl);
            setMediaType(inferHomepageBackgroundMediaType(nextUrl, mediaType));
          }}
          placeholder="/images/salon-interior.png"
          type="text"
          value={mediaUrl}
        />
      </label>

      {uploadError ? <p className="mt-3 text-sm text-red-300">{uploadError}</p> : null}
      {isUploading ? (
        <p className="mt-3 text-sm text-muted">
          {previewIsVideo ? "Video wird hochgeladen…" : "Bild wird hochgeladen…"}
        </p>
      ) : null}

      {previewSrc ? (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-black">
          {previewIsVideo ? (
            <video
              className="h-full w-full object-cover"
              controls
              muted
              playsInline
              preload="metadata"
              src={previewSrc}
            />
          ) : (
            <Image
              alt="Hintergrund-Vorschau"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              src={previewSrc}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
