import { siteConfig } from "@/lib/seo/site";

export type SeoSettings = {
  seo_description: string;
  seo_title: string;
};

export const defaultSeoSettings: SeoSettings = {
  seo_title: "King Salon Celle | Luxus-Barbershop & Hairstylist",
  seo_description: siteConfig.description,
};
