import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { EditorialPhoto } from "@/components/editorial-photo";
import { CommercialValue, SampleDeliverables } from "@/components/commercial-sections";
import { getPublicPhotographs } from "@/lib/catalog";
import { pageMetadata, partnershipModels } from "@/lib/outdoor";
import { verifiedAudienceMetrics, inquiryLink } from "@/lib/commercial";
export const metadata = pageMetadata("Commercial Media Kit", "Outdoor brand and destination photography, selected work, configurable deliverables, licensing and partnership models from Michael Kennedy in Lawrence, Kansas.", "/media-kit");
export default async function MediaKit() {
 const photos = await getPublicPhotographs();
 const selection = ["high-country-passage","monarch-of-the-meadow","canyon-cascade","painted-silence","crystal-mill","valley-before-rain","alpine-afterglow","road-beneath-the-stars","the-observer"];
 return <main id="main-content"><PageHero eyebrow="Memories with Mike / Commercial media kit" title="Photography. Exploration. Stories from the Wild." intro="Michael Kennedy — Outdoor Photographer & Field Content Creator. Lawrence, Kansas. Landscape, wildlife, adventure and outdoor commercial photography."/>
 <section className="section section-ivory"><div className="container-wide"><div className="media-overview"><div><h2>What Michael creates.</h2><p>Field photography, destination imagery, product-in-environment photography, expedition storytelling and commissioned assignments. Existing photographs can also be licensed for an agreed use.</p><Link className="text-link" href="/expeditions/colorado-field-archive">Explore the Colorado field story →</Link></div><dl><div><dt>Photographer</dt><dd>Michael Kennedy</dd></div><div><dt>Geographic base</dt><dd>Lawrence, Kansas</dd></div><div><dt>Assignments</dt><dd>Regional and travel-based projects by discussion. Dates, access and travel scope are confirmed for each assignment.</dd></div></dl></div>
 <div className="section-heading"><p className="eyebrow ink">Selected work</p><h2>A sense of place.<br />A point of view.</h2><p>Existing landscape and wildlife work demonstrates the photographic approach. These images are not presented as commissioned brand campaigns.</p></div>
 <div className="commercial-selection">{selection.map(slug=>{const p=photos.find(p=>p.slug===slug);return p?<figure key={slug}><Link href={`/prints/${slug}`}><EditorialPhoto photo={p} ratio="3 / 2" sizes="(max-width:480px) 100vw, (max-width:800px) 50vw, 33vw" fit="contain"/></Link><figcaption><strong>{p.title}</strong><br/>{p.location}<br/><Link className="text-link" href={inquiryLink("Licensing",slug)}>License this image →</Link></figcaption></figure>:null;})}</div>
 </div></section>
 <CommercialValue/>
 <section className="section section-dark"><div className="container-wide"><div className="outdoor-heading"><p className="eyebrow">Commercial applications</p><h2>Images with<br />a job to do.</h2><p>Build a brief around websites, digital campaigns, social media, email campaigns, brochures, editorial features, tourism marketing, product pages or print collateral. File dimensions, crops and permissions are agreed for the intended use.</p></div><Link className="button button-outline-light" href="/licensing">Understand image licensing →</Link></div></section>
 <section className="section section-ivory"><div className="container-wide"><div className="outdoor-heading"><p className="eyebrow ink">Partnership models</p><h2>A working relationship<br />with a clear scope.</h2></div><div className="commercial-grid">{partnershipModels.map(m=><article key={m.title}><h3>{m.title}</h3><p>{m.description}</p></article>)}<article><h3>Licensed photography</h3><p>Select existing photographs for a defined use. Request a license for the media, territory, duration and exclusivity your project needs.</p></article></div></div></section>
 <SampleDeliverables/>
 {verifiedAudienceMetrics.length>0&&<section className="section section-stone"><div className="container-wide"><h2>Verified audience</h2><dl>{verifiedAudienceMetrics.map(m=><div key={m.label}><dt>{m.label}</dt><dd>{m.value} · As of {m.asOf} · {m.source}</dd></div>)}</dl></div></section>}
 <section className="cta-band section-copper"><div className="container-narrow"><h2>Discuss a project.</h2><p>Share your company, objective, destination, timing, desired assets and intended usage. Michael will help define the next step.</p><Link className="button button-dark" href="/contact?service=Brand%20Partnership">Discuss a project →</Link><p><a href="mailto:michael.kennedy@ku.edu">michael.kennedy@ku.edu</a></p></div></section>
 </main>;
}
