import { PlaceholderFrame } from "./placeholder-frame";
import type { Photograph } from "@/lib/content";
export function EditorialPhoto({ photo, ratio = "3 / 2", eager = false, sizes, fit }: { photo?: Photograph; ratio?: string; eager?: boolean; sizes?: string; fit?: "cover" | "contain" }) {
  if (!photo) return null;
  return <PlaceholderFrame label={photo.title} filename={photo.filename} src={photo.displayUrl} alt={photo.altText ?? photo.title}
    ratio={ratio} loading={eager ? "eager" : "lazy"} sizes={sizes} fit={fit} focalPointX={photo.focalPointX} focalPointY={photo.focalPointY} />;
}
