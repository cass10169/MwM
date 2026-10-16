import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PhotoCard } from "@/components/photo-card";
import { getPublicPhotographs } from "@/lib/catalog";
import { publishedExpeditions } from "@/lib/expeditions";
import { pageMetadata } from "@/lib/outdoor";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const e=publishedExpeditions.find(e=>e.slug===slug);
 return e?pageMetadata(e.title,e.mission??e.destination,`/expeditions/${slug}`):{robots:{index:false}};
}
export default async function ExpeditionPage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const e=publishedExpeditions.find(e=>e.slug===slug); if(!e)notFound();
 const photos=(await getPublicPhotographs()).filter(p=>e.photographSlugs.includes(p.slug));
 return <main id="main-content"><PageHero eyebrow="Colorado / Photographic field archive" title={e.title} intro={e.mission??""}/><section className="section section-ivory"><div className="container-wide"><p className="archive-note">A selection from Michael’s Colorado work, presented by location. This archive brings together photographs from different outings.</p><div className="editorial-grid">{photos.map(p=><PhotoCard key={p.slug} photo={p}/>)}</div></div></section><section className="cta-band section-dark"><div className="container-narrow"><h2>Shape the next story.</h2><Link className="button button-outline-light" href="/contact?service=Expedition%20Partnership">Become an expedition partner →</Link></div></section></main>;
}
