import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getCollection, getCollections, getPublicPhotographs } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getCollections()).map((collection) => ({ slug: collection.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  return collection ? { title: collection.title, description: collection.description } : {};
}
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const photos = (await getPublicPhotographs()).filter((photo) => collection.photographSlugs.includes(photo.slug));
  return (
    <main id="main-content">
      <header className="collection-detail-hero section-dark">
        <div className="container-wide">
          <Breadcrumbs
            currentPath={`/collections/${slug}`}
            items={[{ label: "Collections", href: "/collections" }, { label: collection.title }]}
          />
          <p className="eyebrow">Fine-art collection</p>
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
          <span>{photos.length} photographs</span>
        </div>
      </header>
      <section className="gallery-section section-ivory">
        <div className="container-wide">
          <PortfolioBrowser initialPhotos={photos} />
        </div>
      </section>
    </main>
  );
}
