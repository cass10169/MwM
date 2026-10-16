import { isOutdoor } from "@/lib/commercial";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getPublicPhotographs } from "@/lib/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Photography Portfolio",
  description: "Outdoor landscape, wildlife, waterfall and night photography by Michael Kennedy, based in Lawrence, Kansas.",
};
export default async function PortfolioPage() {
  const photographs = await getPublicPhotographs();
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Portfolio"
        title="Photographs that hold the feeling of being there."
        intro="Explore landscapes, wildlife, and outdoor environments shaped by patience, light, and a sense of place."
      />
      <section className="gallery-section section-ivory">
        <div className="container-wide">
          <nav className="explore-topics" aria-label="Explore photography topics">{[["landscapes","Landscapes"],["wildlife","Wildlife"],["waterfalls","Waterfalls"],["night","Night / Astro"],["colorado","Colorado"],["kansas","Kansas"],["national-parks","National Parks"],["adventure","Adventure / Field"]].map(([slug,label])=><Link key={slug} href={`/portfolio/${slug}`}>{label}</Link>)}</nav>
          <p className="gallery-paths">Looking for weddings, graduations, portraits or events? <Link className="text-link" href="/portfolio/people-events">People &amp; Events →</Link></p><PortfolioBrowser initialPhotos={photographs.filter(isOutdoor)} />
        </div>
      </section>
    </main>
  );
}
