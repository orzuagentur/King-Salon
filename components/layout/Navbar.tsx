"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LuxuryButton } from "@/components/ui/LuxuryButton";

const navigationItems = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#preise", label: "Preise" },
  { href: "#galerie", label: "Galerie" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#kontakt", label: "Kontakt" },
];

const menuVariants = {
  closed: { opacity: 0, y: -12 },
  open: { opacity: 1, y: 0 },
};

const linkVariants = {
  closed: { opacity: 0, x: 16 },
  open: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type NavbarProps = {
  siteName?: string;
};

export function Navbar({ siteName = "King Salon" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
        <nav
          aria-label="Hauptnavigation"
          className="mx-auto flex h-[var(--nav-height)] max-w-7xl items-center justify-between gap-3 px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:gap-4 sm:px-8 lg:px-12"
        >
          <Link
            className="touch-press shrink-0 text-sm font-semibold uppercase tracking-[0.28em] sm:tracking-[0.34em]"
            href="/"
            onClick={closeMenu}
          >
            {siteName}
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navigationItems.map((item) => (
              <a
                className="text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:text-gold"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              className="touch-press hidden min-h-11 items-center rounded-full border border-border bg-white/5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-gold hover:text-gold sm:inline-flex"
              href="tel:+491738882560"
            >
              Anrufen
            </a>
            <a
              className="touch-press hidden min-h-11 items-center rounded-full border border-gold bg-gold px-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gold-soft md:inline-flex"
              href="#termin"
            >
              Termin
            </a>

            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              className="touch-press relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated/80 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span className="sr-only">Navigation</span>
              <span className="flex w-5 flex-col items-end gap-1.5">
                <span
                  className={`block h-0.5 w-full bg-foreground transition duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
                />
                <span
                  className={`block h-0.5 w-3.5 bg-gold transition duration-300 ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 w-full bg-foreground transition duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            animate="open"
            className="fixed inset-0 z-40 md:hidden"
            exit="closed"
            initial="closed"
            variants={menuVariants}
          >
            <button
              aria-label="Menü schließen"
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={closeMenu}
              type="button"
            />

            <motion.div
              className="absolute inset-x-0 bottom-0 top-[var(--nav-height)] flex flex-col overflow-y-auto overscroll-contain border-t border-border bg-background/95 px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-6 backdrop-blur-2xl"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-gold">
                Navigation
              </p>

              <ul className="mt-6 flex flex-col gap-1">
                {navigationItems.map((item, index) => (
                  <motion.li custom={index} key={item.href} variants={linkVariants}>
                    <a
                      className="touch-press flex min-h-14 items-center rounded-2xl border border-transparent px-4 text-lg font-semibold tracking-[-0.02em] text-foreground transition active:border-border active:bg-surface"
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-10">
                <LuxuryButton className="w-full" href="#termin" onClick={closeMenu}>
                  Termin anfragen
                </LuxuryButton>
                <LuxuryButton
                  className="w-full"
                  href="tel:+491738882560"
                  onClick={closeMenu}
                  variant="secondary"
                >
                  Jetzt anrufen
                </LuxuryButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
