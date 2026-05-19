import type { GalleryItem } from "@/lib/data/gallery";
import { resolveImageUrl } from "@/lib/storage/urls";

export type GalleryImageDisplay = {
  alt: string;
  category: string;
  featured: boolean;
  id: string;
  src: string;
  title: string;
};

export function mapGalleryItemsForDisplay(items: GalleryItem[]): GalleryImageDisplay[] {
  return items.map((item, index) => ({
    alt: item.alt ?? item.title ?? "Galeriebild King Salon Celle",
    category: item.category,
    featured: index < 2,
    id: item.id,
    src: resolveImageUrl(item.image, "gallery"),
    title: item.title ?? item.category,
  }));
}
