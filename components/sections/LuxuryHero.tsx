import { LuxuryHeroClient } from "@/components/sections/LuxuryHeroClient";
import { getHomepageContent } from "@/lib/data/homepage";
import { getSalonContact } from "@/lib/data/settings";

export async function LuxuryHero() {
  const [content, contact] = await Promise.all([getHomepageContent(), getSalonContact()]);

  return (
    <LuxuryHeroClient
      content={content}
      instagramUrl={contact.instagram}
      phone={contact.phone}
      phoneDisplay={contact.phoneDisplay}
    />
  );
}
