export const imageDefaults = {
  quality: 80,
  qualityDecorative: 60,
  qualityHero: 85,
} as const;

/** Dunkler Blur-Platzhalter für sanftes Laden */
export const imageBlurPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycnPjxyZWN0IHdpZHRoPScxNicgaGVpZ2h0PScxNicgZmlsbD0nIzA1MDUwNScvPjwvc3ZnPg==";

export const imageSizePresets = {
  hero: "(max-width: 1024px) 100vw, 50vw",
  heroBackground: "100vw",
  galleryFeatured: "(max-width: 768px) 100vw, 50vw",
  galleryStandard: "(max-width: 768px) 50vw, 25vw",
} as const;
