import { PricingSectionClient } from "@/components/sections/PricingSectionClient";
import { getActiveServices } from "@/lib/data/services";

export async function PricingSection() {
  const services = await getActiveServices();

  return <PricingSectionClient services={services} />;
}
