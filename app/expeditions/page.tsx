import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { EditorialPhoto } from "@/components/editorial-photo";
import { getPublicPhotographs } from "@/lib/catalog";
import { publishedExpeditions } from "@/lib/expeditions";
import { pageMetadata } from "@/lib/outdoor";
export const metadata = pageMetadata("Expeditions & Field Archive", "Photographic field archives and opportunities to support future outdoor photography projects.", "/expeditions");
export default async function Expeditions() {
 const photos=await getPublicPhotographs();
 return <main id="main-content"><PageHero eyebrow="Expeditions / Field archive" title="The journey belongs in the story." intro="Explore the existing photographic archive, and discuss a future field project shaped around a destination, creative mission, and agreed deliverables." />
 <section className="section section-ivory"><div className="container-wide">{publishedExpeditions.map(e=><article className="outdoor-feature" key={e.slug}><EditorialPhoto photo={photos.find(p=>p.slug==="high-country-passage")} ratio="2.8 / 1" /><div><p className="eyebrow ink">{e.destination} / Selected work</p><h2>{e.title}</h2><p>{e.mission}</p><Link className="text-link" href={`/expeditions/${e.slug}`}>Open the field archive →</Link></div></article>)}</div></section>
 <section className="cta-band section-dark"><div className="container-narrow"><p className="eyebrow">Build the next field story</p><h2>Become an expedition partner.</h2><p>Discuss a mission, destination, timing, and production scope. Travel and equipment support can be part of an agreed partnership.</p><Link className="button button-outline-light" href="/contact?service=Expedition%20Partnership">Discuss a field project →</Link></div></section></main>;
}
