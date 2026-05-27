import type { Metadata } from "next";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { requireAdmin } from "@/lib/auth/admin";
import { adminNavItems } from "@/lib/admin/navigation";
import { getAdminDashboardStats } from "@/lib/admin/stats";

export const metadata: Metadata = {
  title: "Dashboard | King Salon Admin",
  description: "Admin-Dashboard für King Salon Celle.",
};

export default async function AdminDashboardPage() {
  const { admin } = await requireAdmin();
  const stats = await getAdminDashboardStats();

  const quickLinks = adminNavItems.filter((item) => item.href !== "/admin");

  return (
    <div className="space-y-8">
      <AdminHeader
        description="Verwalten Sie Inhalte, Preise, Galerie, Bewertungen und Salon-Einstellungen zentral an einem Ort."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="Dashboard"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard
          hint="Neue Anfragen von der Website"
          label="Termine"
          value={stats.pendingBookings}
        />
        <AdminStatCard
          hint="Aktive Leistungen im System"
          label="Preise"
          value={stats.activeServices}
        />
        <AdminStatCard hint="Bilder in der Galerie" label="Galerie" value={stats.galleryImages} />
        <AdminStatCard
          hint="Veröffentlichte Bewertungen"
          label="Bewertungen"
          value={stats.activeReviews}
        />
        <AdminStatCard
          hint={stats.hasSettings ? "Kontaktdaten hinterlegt" : "Noch nicht konfiguriert"}
          label="Einstellungen"
          value={stats.hasSettings ? "Aktiv" : "Ausstehend"}
        />
      </section>

      <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
          Schnellzugriff
        </h2>
        <p className="mt-2 text-sm text-muted">
          Springen Sie direkt zu den wichtigsten Verwaltungsbereichen.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              className="rounded-2xl border border-border bg-background px-5 py-4 transition hover:border-gold hover:text-gold"
              href={item.href}
              key={item.href}
            >
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
