import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getPublicPhotographs } from "@/lib/catalog";

const map = {
 landscapes:{title:"Landscapes",intro:"High country, still water, open prairie, and changing weather."},
 wildlife:{title:"Wildlife",intro:"Wildlife encounters from Colorado and Kansas."},
 waterfalls:{title:"Waterfalls",intro:"Water moving through Colorado’s mountain terrain."},
 night:{title:"Night / Astro",intro:"The sky above Clinton Lake, photographed after dark."},
 colorado:{title:"Colorado",intro:"Mountain landscapes, alpine water, and wildlife from Colorado."},
 kansas:{title:"Kansas",intro:"Heartland water, wildlife, and light close to home."},
 "national-parks":{title:"National Parks",intro:"High country and wildlife in Rocky Mountain National Park."},
 events:{title:"Events",intro:"Gatherings, celebrations, and documentary moments."},
} as const;
function matches(photo: import("@/lib/content").Photograph, category: string) {
 if(category==="waterfalls")return ["canyon-cascade","cascade-above-timberline"].includes(photo.slug);
 if(category==="night")return photo.slug==="road-beneath-the-stars";
 if(category==="colorado")return /colorado/i.test(photo.location)&&["Landscapes","Wildlife"].includes(photo.category);
 if(category==="kansas")return /kansas|\\bKS\\b/i.test(photo.location)&&["Landscapes","Wildlife","Nature & Macro"].includes(photo.category);
 if(category==="national-parks")return /Rocky Mountain National Park/i.test(photo.location);
 return photo.category.toLowerCase()===category;
}
export function generateStaticParams() {
  return Object.keys(map).map((category) => ({ category }));
}
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const details = map[category as keyof typeof map];
  return details ? { title: `${details.title} Photography`, description: details.intro, alternates: { canonical: `/portfolio/${category}` } } : {};
}
export default async function CategoryPortfolioPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const details = map[category as keyof typeof map];
  if (!details) notFound();
  const filtered = (await getPublicPhotographs()).filter((photo) => matches(photo, category));
  return (
    <main id="main-content">
      <PageHero eyebrow="Portfolio collection" title={details.title} intro={details.intro} />
      <section className="gallery-section section-ivory">
        <div className="container-wide">
          <PortfolioBrowser initialPhotos={filtered} />
        </div>
      </section>
    </main>
  );
}
