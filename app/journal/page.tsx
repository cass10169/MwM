import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PlaceholderFrame } from "@/components/placeholder-frame";
import { getJournalPosts, getPublicPhotographs } from "@/lib/catalog";

const journalCoverSlugs: Record<string, string> = {
  "waiting-for-the-lake-to-go-still": "painted-silence",
  "photographing-wildlife-with-presence": "the-observer",
  "choosing-a-fine-art-print": "still-waters",
};

export const metadata: Metadata = {
  alternates: { canonical: "/journal" },
  title: "Field Journal",
  description:
    "Field notes, behind-the-image stories, destinations, and fine-art print guidance from Memories with Mike.",
};
export default async function JournalPage() {
  const [journalPosts, photographs] = await Promise.all([getJournalPosts(), getPublicPhotographs()]);
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Field notes"
        title="The stories beyond the frame."
        intro="Behind-the-image notes, journeys, wildlife encounters, and practical guidance for living with photographic art."
      />
      <section className="section section-ivory">
        <div className="container-wide journal-list">
          {journalPosts.filter(post => post.published).map((post, index) => {
            const cover = photographs.find((photo) => photo.slug === journalCoverSlugs[post.slug]);
            return (
              <article key={post.slug}>
                <Link href={`/journal/${post.slug}`}>
                  <PlaceholderFrame
                    label={post.title}
                    filename={cover?.filename ?? `${post.slug}-cover-1600x1000.webp`}
                    ratio="8 / 5"
                    variant={cover?.variant ?? (index === 1 ? "wildlife" : "mountain")}
                    src={cover?.displayUrl}
                    alt={cover ? `${post.title}: ${cover.altText ?? cover.title}` : post.title}
                    focalPointX={cover?.focalPointX}
                    focalPointY={cover?.focalPointY}
                  />
                  <div>
                    <p className="eyebrow ink">
                      {post.category} · {post.readingTime}
                      {post.published ? "" : " · Draft preview"}
                    </p>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <span className="text-link">Read story →</span>
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
