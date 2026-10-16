import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PlaceholderFrame } from "@/components/placeholder-frame";
import { getCollections, getPublicPhotographs } from "@/lib/catalog";

const collectionCoverSlugs: Record<string, string> = {
  "mountain-stillness": "painted-silence",
  "wild-encounters": "the-observer",
  "heartland-light": "night-lift",
  "human-stories": "autumn-story",
};

export const metadata: Metadata = {
  alternates: { canonical: "/collections" },
  title: "Photography Collections",
  description: "Curated fine-art photography collections by Michael Kennedy.",
};
export default async function CollectionsPage() {
  const [collections, photographs] = await Promise.all([getCollections(), getPublicPhotographs()]);
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Curated work"
        title="Collections built around a feeling."
        intro="Each collection gathers photographs that speak to one another through light, movement, place, or memory."
      />
      <section className="section section-stone">
        <div className="container-wide collection-list">
          {collections.map((collection, index) => {
            const cover =
              photographs.find((photo) => photo.slug === collectionCoverSlugs[collection.slug]) ??
              photographs.find((photo) => collection.photographSlugs.includes(photo.slug));
            return (
              <article key={collection.slug}>
                <Link href={`/collections/${collection.slug}`}>
                  <PlaceholderFrame
                    label={collection.title}
                    filename={cover?.filename ?? `${collection.slug}-cover-1800x1200.webp`}
                    ratio="3 / 2"
                    variant={cover?.variant ?? (index === 1 ? "wildlife" : index === 2 ? "prairie" : "mountain")}
                    src={cover?.displayUrl}
                    alt={cover ? `${collection.title}: ${cover.altText ?? cover.title}` : collection.title}
                    focalPointX={cover?.focalPointX}
                    focalPointY={cover?.focalPointY}
                  />
                  <div>
                    <p className="eyebrow ink">Collection {String(index + 1).padStart(2, "0")}</p>
                    <h2>{collection.title}</h2>
                    <p>{collection.description}</p>
                    <span className="text-link">Enter collection →</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
