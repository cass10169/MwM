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
 return <main id="main-content"><PageHero eyebrow="Colorado / Photographic field archive" title={e.title} intro={e.mission??""}/><section className="section section-ivory"><div className="container-wide"><p className="archive-note">A selection from Michael’s Colorado work, presented by location. This archive brings together photographs from different outings.</p><div className="field-story-copy"><h2>The photographic objective</h2><p>This selection studies how light, water and terrain give a place its identity. The archive connects a wide mountain basin with quieter lake reflections, moving water and the built landmark at Crystal.</p><h2>The environments</h2><p>The photograph records identify Monarch Lake, the San Juan Mountains, Crystal and nearby mountain valleys. The images show different scales of the Colorado landscape: expansive roads and ridges, water in a canyon, and intimate reflections.</p><h2>Reading the field context</h2><p>A panoramic road image leaves room for the surrounding basin; the waterfall frames moving water against rock; the lake photographs emphasize reflection and changing light. These are observations of the selected images, not a reconstructed itinerary or a report of unrecorded conditions.</p><h2>From a place to a commercial brief</h2><p>A similar assignment could plan a destination hero image, landscape details, vertical and horizontal compositions, and written field observations. A product-in-environment brief would additionally define placement, access, permitted activity and usage before production.</p><p>Potential outputs include a licensed image library, web and social crops, tourism collateral and an editorial field story. Those are future scope options, not claims of completed sponsor deliverables.</p></div><div className="editorial-grid">{photos.map(p=><PhotoCard key={p.slug} photo={p}/>)}</div></div></section><section className="cta-band section-dark"><div className="container-narrow"><h2>Shape the next story.</h2><Link className="button button-outline-light" href="/contact?service=Expedition%20Partnership">Plan a field assignment →</Link></div></section></main>;
}
