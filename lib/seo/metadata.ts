import type { Metadata } from "next";

import { getLocalGeoMetaTags, localBusiness } from "@/lib/seo/local";
import { siteConfig } from "@/lib/seo/site";

type PageMetadataOptions = {
  description?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  path?: string;
  title?: string;
};

export function createPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const title = options.title ?? siteConfig.name;
  const description = options.description ?? siteConfig.description;
  const canonicalPath = options.path ?? "";
  const url = `${siteConfig.url}${canonicalPath}`;
  const ogImage = options.image ?? siteConfig.ogImage;
  const ogImageAlt = options.imageAlt ?? siteConfig.ogImageAlt;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalPath || "/",
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function createLocalPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const base = createPageMetadata({
    ...options,
    description: options.description ?? localBusiness.description,
  });

  return {
    ...base,
    keywords: [...siteConfig.keywords, ...localBusiness.localKeywords],
    other: getLocalGeoMetaTags(),
  };
}

export const defaultMetadata: Metadata = {
  ...createLocalPageMetadata(),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
};

export const adminMetadata = createPageMetadata({
  title: "Admin",
  description: "Geschützter Verwaltungsbereich für King Salon Celle.",
  noIndex: true,
  path: "/admin",
});
