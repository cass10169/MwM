import Link from "next/link";
import type { Photograph } from "@/lib/content";
import { PlaceholderFrame } from "./placeholder-frame";

export function PhotoCard({ photo, priority = false }: { photo: Photograph; priority?: boolean }) {
  const ratio =
    photo.orientation === "portrait"
      ? "4 / 5"
      : photo.orientation === "square"
        ? "1 / 1"
        : photo.orientation === "panoramic"
          ? "2 / 1"
          : "3 / 2";
  return (
    <article className={`photo-card photo-${photo.orientation}`} data-priority={priority || undefined}>
      <Link href={(["Landscapes", "Wildlife", "Nature & Macro"].includes(photo.category)) ? `/prints/${photo.slug}` : `/photography/${photo.slug}`} aria-label={`View ${photo.title}, photographed at ${photo.location}`}>
        <div className="photo-frame">
          <PlaceholderFrame
            label={photo.title}
            filename={photo.filename}
            ratio={ratio}
            variant={photo.variant}
            src={photo.displayUrl}
            alt={photo.altText}
            focalPointX={photo.focalPointX}
            focalPointY={photo.focalPointY}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        <div className="photo-meta">
          <h3>{photo.title}</h3>
          <p>{photo.location}</p>
        </div>
      </Link>
    </article>
  );
}
