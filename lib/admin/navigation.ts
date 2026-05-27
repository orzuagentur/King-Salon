export type AdminNavItem = {
  description: string;
  href: string;
  label: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    description: "Übersicht und Kennzahlen",
    href: "/admin",
    label: "Dashboard",
  },
  {
    description: "Preise und Services für die Startseite verwalten",
    href: "/admin/leistungen",
    label: "Preise",
  },
  {
    description: "Terminanfragen bestätigen und verwalten",
    href: "/admin/termine",
    label: "Termine",
  },
  {
    description: "Barber für die Online-Buchung verwalten",
    href: "/admin/meister",
    label: "Meister",
  },
  {
    description: "Galerie-Bilder hochladen und sortieren",
    href: "/admin/galerie",
    label: "Galerie",
  },
  {
    description: "Kundenbewertungen bearbeiten",
    href: "/admin/bewertungen",
    label: "Bewertungen",
  },
  {
    description: "Telefon, Adresse und Social Media",
    href: "/admin/kontakt",
    label: "Kontakt",
  },
  {
    description: "Öffnungszeiten anpassen",
    href: "/admin/oeffnungszeiten",
    label: "Öffnungszeiten",
  },
  {
    description: "Hero-Texte und Startseiten-Inhalte",
    href: "/admin/startseite",
    label: "Startseite",
  },
  {
    description: "Meta-Titel und Beschreibung",
    href: "/admin/seo",
    label: "SEO",
  },
  {
    description: "KI-Chat, Prompt, Wissen und Verhalten",
    href: "/admin/ki-assistent",
    label: "KI-Assistent",
  },
];

export function getAdminNavItem(pathname: string) {
  return adminNavItems.find((item) => item.href === pathname) ?? adminNavItems[0];
}
