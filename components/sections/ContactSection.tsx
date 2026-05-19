import { ContactSectionClient } from "@/components/sections/ContactSectionClient";
import { getActiveMasters } from "@/lib/data/masters";
import { getOpeningHours } from "@/lib/data/opening-hours";
import { getSalonContact } from "@/lib/data/settings";

export async function ContactSection() {
  const [contact, openingHours, masters] = await Promise.all([
    getSalonContact(),
    getOpeningHours(),
    getActiveMasters(),
  ]);

  return (
    <ContactSectionClient contact={contact} masters={masters} openingHours={openingHours} />
  );
}
