import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotograph } from "@/lib/catalog";
import { PageHero } from "@/components/page-hero";
import { EditorialPhoto } from "@/components/editorial-photo";
import { pageMetadata } from "@/lib/outdoor";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;const p=await getPhotograph(slug);return p?pageMetadata(p.title,p.story,`/photography/${slug}`):{}; }
export default async function PhotographPage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const p=await getPhotograph(slug); if(!p)notFound();
 return <main id="main-content"><PageHero eyebrow={`${p.category} / ${p.location}`} title={p.title} intro={p.story}/><section className="section section-ivory"><div className="container-narrow"><EditorialPhoto photo={p} ratio={p.orientation==="portrait"?"2 / 3":"3 / 2"} fit="contain" eager sizes="(max-width: 900px) calc(100vw - 48px), 860px"/><div className="photo-story-cta"><h2>Planning photographs of your own?</h2><Link className="button button-dark" href="/contact?service=Photography%20Services">Discuss your session →</Link></div></div></section></main>;
}
