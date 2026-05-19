import { GallerySectionClient } from "@/components/sections/GallerySectionClient";
import { getGalleryItems } from "@/lib/data/gallery";
import { mapGalleryItemsForDisplay } from "@/lib/gallery/display";

export async function GallerySection() {
  const items = await getGalleryItems();

  return <GallerySectionClient images={mapGalleryItemsForDisplay(items)} />;
}
