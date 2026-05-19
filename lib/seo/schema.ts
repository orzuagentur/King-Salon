import { openingHours, salonContact, salonReviews, salonReviewsSummary } from "@/lib/content/salon";
import { localBusiness } from "@/lib/seo/local";
import { siteConfig } from "@/lib/seo/site";

const dayOfWeekMap: Record<string, string> = {
  Montag: "Monday",
  Dienstag: "Tuesday",
  Mittwoch: "Wednesday",
  Donnerstag: "Thursday",
  Freitag: "Friday",
  Samstag: "Saturday",
  Sonntag: "Sunday",
};

function parseOpeningHours() {
  const specifications: Array<{
    "@type": "OpeningHoursSpecification";
    closes: string;
    dayOfWeek: string | string[];
    opens: string;
  }> = [];

  const weekdayGroups = new Map<string, string[]>();

  for (const entry of openingHours) {
    if (entry.hours === "Geschlossen") {
      continue;
    }

    const [opens, closes] = entry.hours.split(" - ");
    const englishDay = dayOfWeekMap[entry.day];

    if (!opens || !closes || !englishDay) {
      continue;
    }

    const key = `${opens}-${closes}`;
    const days = weekdayGroups.get(key) ?? [];
    days.push(englishDay);
    weekdayGroups.set(key, days);
  }

  for (const [hoursKey, days] of weekdayGroups) {
    const [opens, closes] = hoursKey.split("-");

    specifications.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.length === 1 ? days[0] : days,
      opens,
      closes,
    });
  }

  return specifications;
}

export function getWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: localBusiness.description,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": `${siteConfig.url}/#business`,
    },
  };
}

export function getHairSalonSchema() {
  const imageUrl = `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    "@type": "HairSalon",
    "@id": `${siteConfig.url}/#business`,
    name: localBusiness.name,
    description: localBusiness.description,
    url: siteConfig.url,
    image: imageUrl,
    telephone: localBusiness.phoneDisplay,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: localBusiness.streetAddress,
      addressLocality: localBusiness.addressLocality,
      addressRegion: localBusiness.addressRegion,
      postalCode: localBusiness.postalCode,
      addressCountry: localBusiness.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: localBusiness.geo.latitude,
      longitude: localBusiness.geo.longitude,
    },
    areaServed: localBusiness.areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    openingHoursSpecification: parseOpeningHours(),
    sameAs: [
      salonContact.instagram,
      salonContact.facebook,
      salonContact.googleMapsUrl,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: salonReviewsSummary.averageRating,
      reviewCount: salonReviewsSummary.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: salonReviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
    })),
    hasMap: salonContact.googleMapsUrl,
  };
}

export function getSchemaOrgGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [getWebsiteSchema(), getHairSalonSchema()],
  };
}
