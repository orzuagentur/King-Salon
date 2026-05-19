import { ServicesSectionClient } from "@/components/sections/ServicesSectionClient";
import { getActiveServices } from "@/lib/data/services";

export async function ServicesSection() {
  const services = await getActiveServices();

  return <ServicesSectionClient services={services} />;
}
