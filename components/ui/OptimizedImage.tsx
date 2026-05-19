import Image, { type ImageProps } from "next/image";

import { imageBlurPlaceholder, imageDefaults } from "@/lib/images/config";

type OptimizedImageProps = Omit<ImageProps, "quality" | "placeholder" | "alt"> & {
  alt?: string;
  decorative?: boolean;
  placeholder?: "blur" | "empty";
  priority?: boolean;
  quality?: number;
};

export function OptimizedImage({
  decorative = false,
  placeholder = "blur",
  priority = false,
  quality,
  loading,
  alt,
  ...props
}: OptimizedImageProps) {
  const resolvedQuality =
    quality ?? (decorative ? imageDefaults.qualityDecorative : imageDefaults.quality);

  return (
    <Image
      alt={decorative ? "" : (alt ?? "")}
      aria-hidden={decorative ? true : undefined}
      blurDataURL={placeholder === "blur" ? imageBlurPlaceholder : undefined}
      loading={priority ? undefined : (loading ?? "lazy")}
      placeholder={placeholder}
      priority={priority}
      quality={resolvedQuality}
      {...props}
    />
  );
}
