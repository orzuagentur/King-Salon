import { ContactSectionClient } from "@/components/sections/ContactSectionClient";
import { getHomepageContent } from "@/lib/data/homepage";
import { getActiveMasters } from "@/lib/data/masters";
import { getOpeningHours } from "@/lib/data/opening-hours";
import { getSalonContact } from "@/lib/data/settings";

export async function ContactSection() {
  const [contact, openingHours, masters, homepage] = await Promise.all([
    getSalonContact(),
    getOpeningHours(),
    getActiveMasters(),
    getHomepageContent(),
  ]);

  return (
    <ContactSectionClient
      contact={contact}
      masters={masters}
      openingHours={openingHours}
      siteName={homepage.site_name}
    />
  );
}
