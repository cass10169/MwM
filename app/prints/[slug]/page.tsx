import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FavoriteButton } from "@/components/favorite-button";
import { PlaceholderFrame } from "@/components/placeholder-frame";
import { PrintViewTracker } from "@/components/print-view-tracker";
import { ProductPurchase } from "@/components/product-purchase";
import { ShareButton } from "@/components/share-button";
import { PhotoCard } from "@/components/photo-card";
import { getPhotograph, getPublicPhotographs, getStoreProduct, getStoreProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/content";

export async function generateStaticParams() {
  return (await getStoreProducts()).map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotograph(slug);
  if (!photo) return {};
  const absoluteImage = photo.displayUrl
    ? new URL(photo.displayUrl, process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com").toString()
    : undefined;
  return {
    title: `${photo.title} Fine-Art Print`,
    description: `${photo.title}, photographed at ${photo.location}. Explore the story and available print materials.`,
    alternates: { canonical: `/prints/${slug}` },
    openGraph: {
      title: `${photo.title} Fine-Art Print`,
      description: photo.story,
      images: absoluteImage ? [{ url: absoluteImage, alt: photo.altText ?? photo.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${photo.title} Fine-Art Print`,
      description: photo.story,
      images: absoluteImage ? [absoluteImage] : [],
    },
  };
}
export default async function PrintDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, photo, photographs] = await Promise.all([
    getStoreProduct(slug),
    getPhotograph(slug),
    getPublicPhotographs(),
  ]);
  if (!product || !photo) notFound();
  const ratio =
    photo.orientation === "portrait"
      ? "4 / 5"
      : photo.orientation === "panoramic"
        ? "2 / 1"
        : photo.orientation === "square"
          ? "1 / 1"
          : "3 / 2";
  const structured = product.enabled
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${photo.title} Fine-Art Print`,
        description: photo.story,
        brand: { "@type": "Brand", name: "Memories with Mike" },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: (product.startingPrice / 100).toFixed(2),
          availability: "https://schema.org/InStock",
          url: `https://memorieswithmike.com/prints/${slug}`,
        },
      }
    : null;
  const related = photographs
    .filter(
      (item) => item.slug !== photo.slug && (item.category === photo.category || item.location === photo.location),
    )
    .slice(0, 3);
  const imageStructured = photo.displayUrl
    ? {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        name: photo.title,
        caption: photo.story,
        contentLocation: photo.location,
        creator: { "@type": "Person", name: "Michael Kennedy" },
        contentUrl: new URL(
          photo.displayUrl,
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com",
        ).toString(),
      }
    : null;
  return (
    <main id="main-content">
      <PrintViewTracker slug={slug} />
      {structured && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      )}
      {imageStructured && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageStructured) }} />
      )}
      <div className="container-wide product-breadcrumb">
        <Breadcrumbs
          currentPath={`/prints/${slug}`}
          items={[{ label: "Fine-art prints", href: "/prints" }, { label: photo.title }]}
        />
      </div>
      <section className="product-detail">
        <div className="product-art section-stone">
          <div className="product-art-inner">
            <PlaceholderFrame
              label={photo.title}
              filename={photo.filename}
              ratio={ratio}
              variant={photo.variant}
              src={photo.displayUrl}
              alt={photo.altText}
              focalPointX={photo.focalPointX}
              focalPointY={photo.focalPointY}
            />
            <div className="product-art-tools">
              <span>
                Web-resolution preview · original file protected
              </span>
              <div className="product-art-actions">
                <FavoriteButton slug={photo.slug} />
                <ShareButton title={photo.title} path={`/prints/${photo.slug}`} />
              </div>
            </div>
          </div>
        </div>
        <div className="product-info section-ivory">
          <div className="product-info-inner">
            <p className="eyebrow ink">
              {photo.category} · {photo.location}
            </p>
            <h1>{photo.title}</h1>
            <p className="product-story">{photo.story}</p>
            <p className="starting-price">
              {product.enabled ? `From ${formatMoney(product.startingPrice)}` : "Available by inquiry"}
            </p>
            <ProductPurchase product={product} />
          </div>
        </div>
      </section>
      {photo.showTechnicalMetadata && (
        <section className="section section-stone">
          <div className="container-narrow">
            <p className="eyebrow ink">Capture details</p>
            <dl className="technical-metadata">
              {photo.capturedAt && (
                <div>
                  <dt>Date</dt>
                  <dd>{new Date(photo.capturedAt).toLocaleDateString()}</dd>
                </div>
              )}
              {photo.camera && (
                <div>
                  <dt>Camera</dt>
                  <dd>{photo.camera}</dd>
                </div>
              )}
              {photo.lens && (
                <div>
                  <dt>Lens</dt>
                  <dd>{photo.lens}</dd>
                </div>
              )}
              {photo.focalLength && (
                <div>
                  <dt>Focal length</dt>
                  <dd>{photo.focalLength}</dd>
                </div>
              )}
              {photo.shutterSpeed && (
                <div>
                  <dt>Shutter</dt>
                  <dd>{photo.shutterSpeed}</dd>
                </div>
              )}
              {photo.aperture && (
                <div>
                  <dt>Aperture</dt>
                  <dd>{photo.aperture}</dd>
                </div>
              )}
              {photo.iso && (
                <div>
                  <dt>ISO</dt>
                  <dd>{photo.iso}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}
      <section className="section section-dark">
        <div className="container-wide product-notes">
          <article>
            <p className="eyebrow">The photograph</p>
            <h2>A moment held in stillness.</h2>
            <p>{photo.story}</p>
          </article>
          <article>
            <p className="eyebrow">Materials &amp; care</p>
            <h2>Made for a lifetime of viewing.</h2>
            <p>
              Material descriptions, care instructions, framing notes, and final lab specifications are managed per
              product so customers see only approved information.
            </p>
            <Link className="text-link light" href="/shipping-returns">
              Shipping and care details →
            </Link>
          </article>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section section-ivory">
          <div className="container-wide">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow ink">Related photographs</p>
                <h2>Continue through the collection.</h2>
              </div>
            </div>
            <div className="standard-photo-grid">
              {related.map((item) => (
                <PhotoCard key={item.slug} photo={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
