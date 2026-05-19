export const serviceCategories = [
  {
    description:
      "Saubere Konturen, moderne Fades und individuelle Beratung für einen starken Look.",
    eyebrow: "Haarschnitt",
    services: ["Fade Cut", "Taper Fade", "Klassischer Haarschnitt", "Moderner Haarschnitt"],
    title: "Präzise Schnitte",
  },
  {
    description:
      "Bartpflege mit klarer Form, ruhiger Technik und gepflegtem Finish für jeden Stil.",
    eyebrow: "Bart",
    services: ["Bart trimmen", "Bartstyling", "Hot-Towel-Rasur"],
    title: "Premium Bartpflege",
  },
  {
    description:
      "Das volle King Salon Erlebnis mit Haarschnitt, Bartpflege und exklusivem Grooming.",
    eyebrow: "Premium",
    services: ["VIP-Paket", "Premium-Grooming"],
    title: "VIP Erlebnis",
  },
] as const;

export const pricingCards = [
  {
    description: "Exakter Schnitt, Styling und klare Konturen für einen gepflegten Auftritt.",
    features: ["Beratung", "Haarschnitt", "Styling-Finish"],
    label: "Essential",
    price: "Preis im Salon",
    title: "Fresh Cut",
  },
  {
    description: "Bartform, Konturen und gepflegtes Finish mit ruhiger Premium-Behandlung.",
    features: ["Bart trimmen", "Konturen", "Pflege-Finish"],
    label: "Detail",
    price: "Preis im Salon",
    title: "Beard Styling",
  },
  {
    description: "Das volle King Salon Erlebnis für Haare, Bart und einen besonders starken Look.",
    features: ["Haarschnitt", "Bartpflege", "VIP-Grooming"],
    label: "Signature",
    price: "Preis im Salon",
    title: "VIP Paket",
  },
] as const;

export const galleryImages = [
  {
    alt: "Außenansicht von King Salon Celle in der Hehlentorstraße",
    category: "Salon",
    featured: true,
    src: "/images/salon-aussenansicht.png",
    title: "King Salon Celle",
  },
  {
    alt: "Moderner Barber-Arbeitsplatz im King Salon mit professioneller Ausstattung",
    category: "Atmosphäre",
    featured: true,
    src: "/images/salon-interior.png",
    title: "Premium Atmosphäre",
  },
  {
    alt: "Präziser Haarschnitt mit Maschine im King Salon Celle",
    category: "Haarschnitt",
    src: "/images/barber-haarschnitt.png",
    title: "Präziser Schnitt",
  },
  {
    alt: "Styling und Finish mit Föhn im King Salon",
    category: "Styling",
    src: "/images/barber-styling.png",
    title: "Styling & Finish",
  },
  {
    alt: "Premium Barber-Technik im King Salon Celle",
    category: "Technik",
    src: "/images/barber-technik.png",
    title: "Premium Technik",
  },
  {
    alt: "Spiegelmoment mit Kunde und Barber im King Salon",
    category: "Erlebnis",
    src: "/images/salon-spiegel.png",
    title: "Kundenmoment",
  },
  {
    alt: "King Salon Team mit charakteristischem Branding",
    category: "Team",
    src: "/images/king-brand.png",
    title: "King Salon Team",
  },
  {
    alt: "Damen-Styling und Make-up im King Salon Celle",
    category: "Damen",
    src: "/images/damen-styling.png",
    title: "Damen Styling",
  },
] as const;

export const salonContact = {
  address: {
    city: "29221 Celle",
    country: "Deutschland",
    street: "Hehlentorstraße 8",
  },
  facebook: "https://m.facebook.com/kingsaloncelle/",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=Hehlentorstra%C3%9Fe+8,+29221+Celle,+Deutschland&hl=de&z=16&output=embed",
  googleMapsUrl: "https://maps.app.goo.gl/Qe2Zj9kCn49fUBgL8",
  instagram: "https://www.instagram.com/_king_salon_/",
  phone: "+491738882560",
  phoneDisplay: "+49 173 8882560",
  whatsapp: "https://wa.me/491738882560",
} as const;

export const openingHours = [
  { day: "Montag", hours: "09:00 - 19:00" },
  { day: "Dienstag", hours: "09:00 - 19:00" },
  { day: "Mittwoch", hours: "09:00 - 19:00" },
  { day: "Donnerstag", hours: "09:00 - 19:00" },
  { day: "Freitag", hours: "09:00 - 19:00" },
  { day: "Samstag", hours: "09:00 - 16:00" },
  { day: "Sonntag", hours: "Geschlossen" },
] as const;

export const salonReviewsSummary = {
  averageRating: 5,
  reviewCount: 120,
  source: "Google",
} as const;

export const salonReviews = [
  {
    name: "Markus H.",
    rating: 5,
    text: "Bester Fade in Celle. Saubere Konturen, ruhige Atmosphäre und ein Team, das genau weiß, was es tut.",
  },
  {
    name: "Jonas K.",
    rating: 5,
    text: "Premium-Erlebnis vom ersten Moment an. Haarschnitt und Bartpflege waren perfekt abgestimmt – absolut empfehlenswert.",
  },
  {
    name: "Emre Y.",
    rating: 5,
    text: "Sehr professionell, freundlich und präzise. Man fühlt sich direkt willkommen und verlässt den Salon mit einem starken Look.",
  },
  {
    name: "Daniel R.",
    rating: 5,
    text: "King Salon ist für mich die erste Adresse in Celle. Styling, Beratung und Finish sind auf einem echten Premium-Niveau.",
  },
] as const;
