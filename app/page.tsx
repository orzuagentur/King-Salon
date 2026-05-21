import type { Metadata } from "next";

import { FloatingContactActions } from "@/components/layout/FloatingContactActions";
import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { LuxuryHero } from "@/components/sections/LuxuryHero";
import { PricingSection } from "@/components/sections/PricingSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { LocalBusinessInfo } from "@/components/seo/LocalBusinessInfo";
import { getHomepageContent } from "@/lib/data/homepage";
import { getSeoSettings } from "@/lib/data/seo";
import { getSalonContact } from "@/lib/data/settings";
import { createLocalPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return createLocalPageMetadata({
    title: seo.seo_title,
    description: seo.seo_description,
    path: "/",
    image: siteConfig.ogImage,
    imageAlt: siteConfig.ogImageAlt,
  });
}

export default async function Home() {
  const [contact, homepage] = await Promise.all([getSalonContact(), getHomepageContent()]);

  return (
    <>
      <Navbar phone={contact.phone} siteName={homepage.site_name} />
      <LuxuryHero />
      <ServicesSection />
      <PricingSection />
      <GallerySection />
      <ReviewsSection />
      <ContactSection />
      <LocalBusinessInfo />
      <FloatingContactActions phone={contact.phone} whatsappUrl={contact.whatsapp} />
    </>
  );
}
