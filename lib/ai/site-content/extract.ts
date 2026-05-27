import { pricingCards, serviceCategories } from "@/lib/content/salon";
import { siteSectionCopy } from "@/lib/content/site-sections";
import type { SiteContentPage } from "@/lib/ai/site-content/types";
import { getActiveAiKnowledge } from "@/lib/data/ai-knowledge";
import { getAllGalleryItems } from "@/lib/data/gallery";
import { getHomepageContent } from "@/lib/data/homepage";
import { getActiveReviews } from "@/lib/data/reviews";
import { getActiveServices } from "@/lib/data/services";
import { getSettings } from "@/lib/data/settings";
import { getSeoSettings } from "@/lib/data/seo";
import { formatPriceLabel } from "@/lib/format/price";
import { getFormattedLocalAddress, localBusiness } from "@/lib/seo/local";
import { siteConfig } from "@/lib/seo/site";

function formatPages(pages: SiteContentPage[]) {
  return pages.map((page) => `## ${page.title} (${page.section})\n${page.body}`).join("\n\n");
}

export async function extractSiteContentPages(): Promise<SiteContentPage[]> {
  const [homepage, seo, settings, services, gallery, reviews, knowledge] = await Promise.all([
    getHomepageContent(),
    getSeoSettings(),
    getSettings(),
    getActiveServices(),
    getAllGalleryItems(),
    getActiveReviews(),
    getActiveAiKnowledge(),
  ]);

  const pages: SiteContentPage[] = [
    {
      id: "hero",
      section: "Startseite",
      title: "Hero",
      body: [
        homepage.hero_eyebrow,
        homepage.hero_title,
        homepage.hero_subtitle,
        `Standort: ${homepage.hero_card_street}, ${homepage.hero_card_city}`,
        homepage.hero_card_hours,
      ].join("\n"),
    },
    {
      id: "about",
      section: "Über uns",
      title: siteSectionCopy.about.eyebrow,
      body: [
        localBusiness.name,
        getFormattedLocalAddress(),
        siteSectionCopy.about.description,
        `Einzugsgebiet: ${localBusiness.areaServed.join(", ")}`,
      ].join("\n"),
    },
    {
      id: "services-intro",
      section: "Leistungen",
      title: siteSectionCopy.services.title,
      body: `${siteSectionCopy.services.eyebrow}\n${siteSectionCopy.services.subtitle}`,
    },
    {
      id: "pricing-intro",
      section: "Preise",
      title: siteSectionCopy.pricing.title,
      body: `${siteSectionCopy.pricing.eyebrow}\n${siteSectionCopy.pricing.subtitle}`,
    },
    {
      id: "contact-intro",
      section: "Kontakt",
      title: siteSectionCopy.contact.title,
      body: `${siteSectionCopy.contact.eyebrow}\n${siteSectionCopy.contact.subtitle}`,
    },
    {
      id: "seo",
      section: "SEO",
      title: "Meta",
      body: `${seo.seo_title}\n${seo.seo_description}`,
    },
  ];

  if (services.length > 0) {
    for (const service of services) {
      pages.push({
        id: `service-${service.id}`,
        section: "Leistungen",
        title: service.title,
        body: `${service.description}\nPreis: ${formatPriceLabel(Number(service.price))}${service.duration ? `\nDauer: ${service.duration}` : ""}`,
      });
    }
  } else {
    for (const category of serviceCategories) {
      pages.push({
        id: `service-cat-${category.title}`,
        section: "Leistungen",
        title: category.title,
        body: `${category.description}\nServices: ${category.services.join(", ")}`,
      });
    }
  }

  for (const card of pricingCards) {
    pages.push({
      id: `pricing-${card.title}`,
      section: "Preise",
      title: card.title,
      body: `${card.label}: ${card.description}\nFeatures: ${card.features.join(", ")}\n${card.price}`,
    });
  }

  if (services.length > 0) {
    for (const service of services) {
      pages.push({
        id: `pricing-db-${service.id}`,
        section: "Preise",
        title: `Preis — ${service.title}`,
        body: formatPriceLabel(Number(service.price)),
      });
    }
  }

  for (const item of gallery.slice(0, 12)) {
    pages.push({
      id: `gallery-${item.id}`,
      section: "Galerie",
      title: item.title ?? item.category,
      body: item.alt ?? item.title ?? "Galeriebild",
    });
  }

  pages.push({
    id: "gallery-intro",
    section: "Galerie",
    title: siteSectionCopy.gallery.title,
    body: `${siteSectionCopy.gallery.eyebrow}\n${siteSectionCopy.gallery.subtitle}`,
  });

  for (const review of reviews.slice(0, 8)) {
    pages.push({
      id: `review-${review.id}`,
      section: "Bewertungen",
      title: review.name,
      body: `${review.rating}/5 — „${review.text}"`,
    });
  }

  pages.push({
    id: "reviews-intro",
    section: "Bewertungen",
    title: siteSectionCopy.reviews.title,
    body: `${siteSectionCopy.reviews.eyebrow}\n${siteSectionCopy.reviews.subtitle}`,
  });

  if (settings) {
    pages.push({
      id: "contact-data",
      section: "Kontakt",
      title: "Kontaktdaten",
      body: [
        settings.address,
        settings.phone,
        settings.instagram ?? "",
        settings.whatsapp ?? "",
        settings.google_maps_url ?? "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  const faqItems = knowledge.filter((item) => item.category.toLowerCase() === "faq");

  for (const faq of faqItems) {
    pages.push({
      id: `faq-${faq.id}`,
      section: "FAQ",
      title: faq.title,
      body: faq.content,
    });
  }

  pages.push({
    id: "site-meta",
    section: "Website",
    title: siteConfig.name,
    body: `${siteConfig.description}\n${siteConfig.url}`,
  });

  return pages;
}

export function buildFormattedSiteContent(pages: SiteContentPage[]) {
  return [
    `INDEXIERTE SEITEN: ${pages.length}`,
    `WEBSITE: ${siteConfig.url}`,
    "",
    formatPages(pages),
  ].join("\n");
}
