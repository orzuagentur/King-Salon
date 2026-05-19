type AdminPageConfig = {
  description: string;
  placeholderMessage: string;
  placeholderTitle: string;
  title: string;
};

export const adminPageConfig: Record<string, AdminPageConfig> = {
  "/admin/leistungen": {
    description: "Verwalten Sie alle Services, Beschreibungen, Preise und Dauer.",
    placeholderMessage:
      "Leistungen und Preise werden direkt in diesem Bereich verwaltet.",
    placeholderTitle: "Leistungen & Preise",
    title: "Leistungen",
  },
  "/admin/galerie": {
    description: "Laden Sie Bilder hoch, ordnen Sie Kategorien und verwalten Sie die Galerie.",
    placeholderMessage: "Galeriebilder werden direkt in diesem Bereich verwaltet.",
    placeholderTitle: "Galerie-Verwaltung",
    title: "Galerie",
  },
  "/admin/bewertungen": {
    description: "Bearbeiten Sie Kundenbewertungen und steuern Sie die Sichtbarkeit.",
    placeholderMessage:
      "Die Bewertungsverwaltung mit Freigabe-Logik folgt in der nächsten Admin-Phase.",
    placeholderTitle: "Bewertungen",
    title: "Bewertungen",
  },
  "/admin/kontakt": {
    description: "Telefon, E-Mail, Adresse und Social-Media-Links pflegen.",
    placeholderMessage: "Kontaktdaten werden direkt in diesem Bereich gespeichert.",
    placeholderTitle: "Kontaktinformationen",
    title: "Kontakt",
  },
  "/admin/oeffnungszeiten": {
    description: "Öffnungszeiten für alle Wochentage verwalten.",
    placeholderMessage: "Öffnungszeiten werden direkt in diesem Bereich gespeichert.",
    placeholderTitle: "Öffnungszeiten",
    title: "Öffnungszeiten",
  },
  "/admin/startseite": {
    description: "Hero-Texte und Inhalte der Startseite anpassen.",
    placeholderMessage: "Hero-Inhalte werden direkt in diesem Bereich gespeichert.",
    placeholderTitle: "Startseite",
    title: "Startseite",
  },
  "/admin/seo": {
    description: "Meta-Titel, Beschreibung und lokale SEO-Einstellungen.",
    placeholderMessage: "SEO-Einstellungen werden direkt in diesem Bereich gespeichert.",
    placeholderTitle: "SEO-Einstellungen",
    title: "SEO",
  },
};

export function getAdminPageConfig(pathname: string): AdminPageConfig {
  return (
    adminPageConfig[pathname] ?? {
      description: "Admin-Bereich",
      placeholderMessage: "Dieser Bereich wird bald verfügbar sein.",
      placeholderTitle: "In Entwicklung",
      title: "Admin",
    }
  );
}
