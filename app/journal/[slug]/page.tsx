import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlaceholderFrame } from "@/components/placeholder-frame";
import { JournalBody } from "@/components/journal-body";
import { getJournalPosts, getPublicPhotographs } from "@/lib/catalog";

const journalCoverSlugs: Record<string, string> = {
  "waiting-for-the-lake-to-go-still": "painted-silence",
  "photographing-wildlife-with-presence": "the-observer",
  "choosing-a-fine-art-print": "still-waters",
};

export async function generateStaticParams() {
  return (await getJournalPosts()).map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getJournalPosts()).find((item) => item.slug === slug);
  return post
    ? {
        title: post.title,
        description: post.excerpt,
        robots: post.published ? undefined : { index: false, follow: true },
      }
    : {};
}
export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [posts, photographs] = await Promise.all([getJournalPosts(), getPublicPhotographs()]);
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const cover = photographs.find((photo) => photo.slug === journalCoverSlugs[slug]);
  const articleStructured = post.published
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        author: { "@type": "Person", name: "Michael Kennedy" },
        publisher: { "@type": "Organization", name: "Memories with Mike" },
        mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com"}/journal/${slug}`,
      }
    : null;
  return (
    <main id="main-content">
      {articleStructured && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructured) }} />
      )}
      <article>
        <header className="article-header section-dark">
          <div className="container-narrow">
            <Breadcrumbs
              currentPath={`/journal/${slug}`}
              items={[{ label: "Journal", href: "/journal" }, { label: post.title }]}
            />
            <p className="eyebrow">
              {post.category} · {post.readingTime}
              {post.published ? "" : " · Draft preview"}
            </p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
        </header>
        <div className="article-cover container-wide">
          <PlaceholderFrame
            label={post.title}
            filename={cover?.filename ?? `${post.slug}-cover-2000x1250.webp`}
            ratio="8 / 5"
            variant={cover?.variant ?? (slug.includes("wildlife") ? "wildlife" : "mountain")}
            src={cover?.displayUrl}
            alt={cover ? `${post.title}: ${cover.altText ?? cover.title}` : post.title}
            focalPointX={cover?.focalPointX}
            focalPointY={cover?.focalPointY}
          />
        </div>
        <div className="article-body container-narrow">
          <JournalBody markdown={post.body ?? post.excerpt} />
          {!post.published && (
            <aside>
              <strong>Draft content</strong>
              <span>
                This article is excluded from indexing until Michael replaces the sample writing and publishes it.
              </span>
            </aside>
          )}
          <Link className="text-link" href="/journal">
            ← Return to the journal
          </Link>
        </div>
      </article>
    </main>
  );
}
