import type { ReactNode } from "react";
import { Suspense } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminToast } from "@/components/admin/AdminToast";
import { getHomepageContent } from "@/lib/data/homepage";
import { getAdminBrandName } from "@/lib/homepage/branding";

type AdminShellProps = {
  children: ReactNode;
};

export async function AdminShell({ children }: AdminShellProps) {
  const homepage = await getHomepageContent();
  const brandName = getAdminBrandName(homepage);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-8">
        <div className="lg:sticky lg:top-8 lg:w-72 lg:shrink-0 lg:self-start">
          <AdminSidebar brandName={brandName} />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
