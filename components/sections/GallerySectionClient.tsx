"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { galleryImages } from "@/lib/content/salon";
import type { GalleryImageDisplay } from "@/lib/gallery/display";
import { imageSizePresets } from "@/lib/images/config";
import { containerClassName, sectionClassName } from "@/lib/layout/classes";

type GallerySectionClientProps = {
  images: GalleryImageDisplay[];
};

const staticImages: GalleryImageDisplay[] = galleryImages.map((image) => ({
  alt: image.alt,
  category: image.category,
  featured: "featured" in image && image.featured === true,
  id: image.src,
  src: image.src,
  title: image.title,
}));

export function GallerySectionClient({ images }: GallerySectionClientProps) {
  const displayImages = images.length > 0 ? images : staticImages;

  return (
    <section className={sectionClassName} id="galerie">
      <motion.div
        className={containerClassName}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <SectionHeading
          eyebrow="Galerie"
          subtitle="Einblicke in Atmosphäre, Handwerk und den King Salon Look – von präzisen Schnitten bis zum vollständigen Premium-Erlebnis in Celle."
          title="Cinematic Moments im Salon."
        />

        <motion.div
          className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          {displayImages.map((image, index) => {
            const spanClass = image.featured
              ? index === 0
                ? "col-span-2 row-span-2 min-h-[min(68vw,340px)] md:col-span-2 md:row-span-2 md:min-h-[320px]"
                : "col-span-2 min-h-[200px] max-md:col-span-1 max-md:row-span-1 md:col-span-2"
              : "col-span-1 min-h-[min(42vw,220px)] md:min-h-[220px]";

            return (
              <motion.figure
                className={`group relative overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-luxury sm:rounded-[1.75rem] ${spanClass}`}
                key={image.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.97, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <OptimizedImage
                  alt={image.alt}
                  className="object-cover transition duration-700 group-hover:scale-105"
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  sizes={
                    image.featured ? imageSizePresets.galleryFeatured : imageSizePresets.galleryStandard
                  }
                  src={image.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold sm:text-xs">
                    {image.category}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-foreground sm:text-lg">
                    {image.title}
                  </p>
                </figcaption>
              </motion.figure>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
