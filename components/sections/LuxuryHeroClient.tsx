"use client";

import { motion } from "framer-motion";

import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { HeroBackgroundMedia } from "@/components/sections/HeroBackgroundMedia";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { resolveHomepageImageUrl } from "@/lib/homepage/images";
import type { HomepageContent } from "@/lib/homepage/types";
import { containerClassName } from "@/lib/layout/classes";
import { imageDefaults, imageSizePresets } from "@/lib/images/config";

type LuxuryHeroClientProps = {
  content: HomepageContent;
  instagramUrl: string;
  phone: string;
  phoneDisplay: string;
};

export function LuxuryHeroClient({
  content,
  instagramUrl,
  phone,
  phoneDisplay,
}: LuxuryHeroClientProps) {
  const heroImageSrc = resolveHomepageImageUrl(content.hero_image);

  const heroStats = [
    { label: "Standort", value: content.hero_stat_location },
    { label: "Stil", value: content.hero_stat_style },
    { label: "Kontakt", value: phoneDisplay },
  ];

  return (
    <section className="relative isolate flex min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <HeroBackgroundMedia
          mediaType={content.hero_background_media_type}
          src={content.hero_background_image}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,93,0.22),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.35)_0%,#050505_88%)]" />
      </div>
      <div className="absolute inset-x-3 top-[calc(var(--nav-height)+0.5rem)] -z-10 h-56 rounded-full bg-gold/10 blur-3xl sm:inset-x-4 sm:top-8 sm:h-72" />

      <div className={`${containerClassName} luxury-hero-shell flex w-full flex-col justify-between gap-10 sm:gap-12`}>
        <div className="grid flex-1 items-end gap-8 py-6 sm:gap-10 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-16">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
            initial={{ opacity: 0, y: 28 }}
            transition={{ delay: 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold sm:mb-5 sm:text-xs sm:tracking-[0.4em]">
              {content.hero_eyebrow}
            </p>
            <h1 className="luxury-display font-semibold text-foreground">{content.hero_title}</h1>
            <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-muted sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
              {content.hero_subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <LuxuryButton href="#termin">Termin anfragen</LuxuryButton>
              <LuxuryButton href={instagramUrl} variant="secondary">
                Instagram ansehen
              </LuxuryButton>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative min-h-[min(72vw,420px)] overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-luxury sm:min-h-[400px] sm:rounded-[2.5rem] lg:min-h-[460px]"
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ delay: 0.28, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <OptimizedImage
              alt={content.hero_image_alt}
              className="object-cover"
              fill
              priority
              quality={imageDefaults.qualityHero}
              sizes={imageSizePresets.hero}
              src={heroImageSrc}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] border border-gold/20 bg-black/40 p-4 backdrop-blur sm:inset-x-8 sm:bottom-8 sm:rounded-[2rem] sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-xs sm:tracking-[0.32em]">
                {content.hero_card_street}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-foreground sm:mt-3 sm:text-2xl">
                {content.hero_card_city}
              </p>
              <p className="mt-2 text-xs leading-6 text-muted sm:mt-3 sm:text-sm">
                {content.hero_card_hours}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.dl
          animate={{ opacity: 1, y: 0 }}
          className="luxury-snap-row border-t border-border pt-5"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.42, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroStats.map((stat) => (
            <div
              className="rounded-3xl border border-border bg-white/[0.03] p-4 sm:p-5"
              key={stat.label}
            >
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted sm:text-xs sm:tracking-[0.28em]">
                {stat.label}
              </dt>
              <dd className="mt-2 text-base font-semibold text-foreground sm:text-lg">{stat.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
