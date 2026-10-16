import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { EditorialPhoto } from "@/components/editorial-photo";
import { getPublicPhotographs } from "@/lib/catalog";
import { pageMetadata } from "@/lib/outdoor";
export const metadata = pageMetadata("Media Kit", "Meet Michael Kennedy and explore outdoor photography, field storytelling, partnership opportunities, and commercial image licensing.", "/media-kit");
export default async function MediaKit() {
 const photos = await getPublicPhotographs();
 return <main id="main-content"><PageHero eyebrow="Memories with Mike / Media kit" title="Photography. Exploration. Stories from the Wild." intro="Michael Kennedy — Outdoor Photographer & Field Content Creator. Based in Lawrence, Kansas; landscapes, wildlife, adventure, and outdoor commercial content." />
 <section className="section section-ivory"><div className="container-wide"><div className="media-overview"><div><h2>A photographer-led practice.</h2><p>Memories with Mike connects photographs to the places and experiences behind them. Projects can include field photography, destination storytelling, commissioned brand content, and licensed imagery.</p></div><dl><div><dt>Photographer</dt><dd>Michael Kennedy</dd></div><div><dt>Home base</dt><dd>Lawrence, Kansas</dd></div><div><dt>Focus</dt><dd>Landscapes · Wildlife · Adventure</dd></div><div><dt>Commercial opportunities</dt><dd>Photography · Field stories · Licensing</dd></div></dl></div>
 <div className="media-selection">{["high-country-passage","monarch-of-the-meadow","canyon-cascade"].map(slug=>{const p=photos.find(p=>p.slug===slug);return p?<figure key={slug}><EditorialPhoto photo={p} ratio={slug==="high-country-passage"?"2.8 / 1":"3 / 2"} /><figcaption>{p.title} · {p.location}</figcaption></figure>:null;})}</div>
 <div className="outdoor-heading"><p className="eyebrow ink">Partnership approach</p><h2>A clear brief.<br />A defined result.</h2><p>Discuss product support, expedition funding, commissioned content, or a continuing brand relationship. Scope, rights, timing, and compensation are agreed individually.</p></div>
 <div className="button-row"><Link className="button button-dark" href="/contact?service=Brand%20Partnership">Contact Michael →</Link><Link className="text-link" href="/partners">Partnership details ↗</Link><Link className="text-link" href="/expeditions">Field archive ↗</Link></div>
 </div></section></main>;
}
