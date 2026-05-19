import type { StorageBucket } from "@/lib/storage/constants";

export function extractStorageObjectPath(imageValue: string, bucket: StorageBucket) {
  const publicMarker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = imageValue.indexOf(publicMarker);

  if (markerIndex >= 0) {
    return imageValue.slice(markerIndex + publicMarker.length).split("?")[0] ?? null;
  }

  if (
    !imageValue.startsWith("/") &&
    !imageValue.startsWith("http://") &&
    !imageValue.startsWith("https://")
  ) {
    return imageValue;
  }

  return null;
}
