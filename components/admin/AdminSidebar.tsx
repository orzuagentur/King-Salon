"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavItems } from "@/lib/admin/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          King Salon
        </p>
        <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
          Admin CMS
        </p>
      </div>

      <nav aria-label="Admin Navigation" className="flex flex-col gap-1">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              className={`rounded-2xl px-4 py-3 transition ${
                isActive
                  ? "border border-gold/30 bg-gold/10 text-gold-soft"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
              href={item.href}
              key={item.href}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 opacity-80">{item.description}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        className="mt-auto rounded-2xl border border-border px-4 py-3 text-sm text-muted transition hover:border-gold hover:text-gold"
        href="/"
      >
        Zur Website
      </Link>
    </aside>
  );
}
