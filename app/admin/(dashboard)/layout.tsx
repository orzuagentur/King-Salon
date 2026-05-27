import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { getHomepageContent } from "@/lib/data/homepage";
import { getAdminBrandName } from "@/lib/homepage/branding";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageContent();
  const brandName = getAdminBrandName(homepage);

  return {
    title: {
      default: `${brandName} Admin`,
      template: `%s | ${brandName} Admin`,
    },
    description: `Verwaltungsbereich für ${brandName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
