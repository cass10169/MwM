import { CommercialValue, SampleDeliverables } from "@/components/commercial-sections";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { EditorialPhoto } from "@/components/editorial-photo";
import { getPublicPhotographs } from "@/lib/catalog";
import { pageMetadata, partnershipModels } from "@/lib/outdoor";
export const metadata = pageMetadata("Partner With Mike", "Outdoor brand photography, adventure storytelling, destination content, licensing, and expedition partnership opportunities.", "/partners");
export default async function Partners() {
  const photos = await getPublicPhotographs();
  return <main id="main-content"><PageHero eyebrow="Partnership opportunities" title="Let’s explore together." intro="Photography, outdoor, travel, automotive, and technology brands: bring a creative brief, a destination, or a product with a field story to tell." />
    <section className="section section-ivory"><div className="container-wide outdoor-feature"><EditorialPhoto photo={photos.find(p=>p.slug==="valley-before-rain")} /><div><p className="eyebrow ink">A considered creative partnership</p><h2>Real places.<br />Purposeful content.</h2><p>Memories with Mike is Michael Kennedy’s outdoor photography and field storytelling practice. Projects begin with your goals, intended audience, and the uses you need from the finished work.</p><Link className="button button-dark" href="/contact?service=Brand%20Partnership">Discuss a partnership →</Link></div></div></section>
    <CommercialValue />
    <section className="section section-dark"><div className="container-wide"><div className="outdoor-heading"><p className="eyebrow">The creative scope</p><h2>Built around<br />your brief.</h2></div><div className="offering-list">{[
      ["Field Photography","Commission photographs made in real outdoor environments, with the product, destination, or experience at the center of the brief."],
      ["Adventure Storytelling","Connect the finished photographs to the journey, conditions, and observations that give them context."],
      ["Product-in-Environment Photography","Plan images in mountain, trail, forest, waterfall, camp, road, or destination settings suitable for the assignment."],
      ["Field Evaluations","Discuss practical product use and documented observations. Testing scope and claims are agreed before production."],
      ["Destination Content","Create location photography and stories for parks, towns, trails, lodging, and tourism projects."],
      ["Social Content","Photography and written field stories can be scoped for social channels. Plan vertical and horizontal still-image assets with written captions or field observations."],
      ["Commercial Asset Licensing","Request image usage for websites, advertising, social media, email, or print campaigns. Licensing covers specific uses, duration, territory, and exclusivity."]
    ].map(([title,text],i)=><article key={title}><span className="eyebrow">0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
    <section className="section section-ivory"><div className="container-wide"><div className="outdoor-heading"><p className="eyebrow ink">Ways to work together</p><h2>A model that fits<br />the project.</h2></div><div className="partnership-models">{partnershipModels.map(model=><article key={model.title}><h3>{model.title}</h3><p>{model.description}</p></article>)}</div><p className="scope-note">All deliverables, timelines, compensation, usage rights, approvals, and disclosures are defined for each project. These are opportunities for future collaboration.</p></div></section>
    <SampleDeliverables />
    <section className="cta-band section-copper"><div className="container-narrow"><h2>What are you planning?</h2><p>Share your company, objective, timing, destination, and the content you need.</p><div className="button-row"><Link className="button button-dark" href="/contact?service=Brand%20Partnership">Start a partnership inquiry →</Link><Link className="text-link" href="/media-kit">View media kit ↗</Link></div></div></section>
  </main>;
}
