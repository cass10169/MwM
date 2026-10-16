import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getPublicPhotographs } from "@/lib/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Photography Portfolio",
  description: "Explore fine-art landscapes, wildlife encounters, and selected event photography by Michael Kennedy.",
};
export default async function PortfolioPage() {
  const photographs = await getPublicPhotographs();
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Portfolio"
        title="Photographs that hold the feeling of being there."
        intro="Explore landscapes, wildlife, and human moments shaped by patience, light, and a sense of place."
      />
      <section className="gallery-section section-ivory">
        <div className="container-wide">
          <nav className="explore-topics" aria-label="Explore photography topics">{[["landscapes","Landscapes"],["wildlife","Wildlife"],["waterfalls","Waterfalls"],["night","Night / Astro"],["colorado","Colorado"],["kansas","Kansas"],["national-parks","National Parks"]].map(([slug,label])=><Link key={slug} href={`/portfolio/${slug}`}>{label}</Link>)}</nav>
          <PortfolioBrowser initialPhotos={photographs} />
        </div>
      </section>
    </main>
  );
}
