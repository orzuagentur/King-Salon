"use client";

import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { isHomepageBackgroundVideo } from "@/lib/homepage/media";
import { resolveHomepageImageUrl } from "@/lib/homepage/images";
import type { HomepageBackgroundMediaType } from "@/lib/homepage/types";
import { imageDefaults, imageSizePresets } from "@/lib/images/config";

type HeroBackgroundMediaProps = {
  mediaType: HomepageBackgroundMediaType;
  src: string;
};

export function HeroBackgroundMedia({ mediaType, src }: HeroBackgroundMediaProps) {
  const resolvedSrc = resolveHomepageImageUrl(src);
  const isVideo = isHomepageBackgroundVideo(src, mediaType);

  if (isVideo) {
    return (
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        loop
        muted
        playsInline
        preload="metadata"
        src={resolvedSrc}
      />
    );
  }

  return (
    <OptimizedImage
      decorative
      className="object-cover opacity-20"
      fill
      placeholder="empty"
      quality={imageDefaults.qualityDecorative}
      sizes={imageSizePresets.heroBackground}
      src={resolvedSrc}
    />
  );
}
