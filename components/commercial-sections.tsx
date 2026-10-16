import Link from "next/link";
import { commercialCapabilities, sampleDeliverables } from "@/lib/commercial";

export function CommercialValue() {
  return <section className="section section-stone"><div className="container-wide">
    <div className="outdoor-heading"><p className="eyebrow ink">Why work with Memories with Mike</p><h2>Field craft.<br />Commercial purpose.</h2><p>Start with the images your audience needs, then define a practical way to make them.</p></div>
    <div className="commercial-grid">{commercialCapabilities.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    <Link className="text-link" href="/expeditions/colorado-field-archive">See the Colorado field story →</Link>
  </div></section>;
}

export function SampleDeliverables() {
  return <section className="section section-ivory"><div className="container-wide">
    <div className="outdoor-heading"><p className="eyebrow ink">Sample deliverables</p><h2>Scope the work.<br />Know the result.</h2><p>Illustrative scopes to build a brief around. Each assignment has its own agreed deliverables, access requirements, timing, rights, and budget.</p></div>
    <div className="commercial-grid three">{sampleDeliverables.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul></article>)}</div>
    <p className="scope-note">These are configurable possibilities, not completed client campaigns or fixed packages. Production capabilities and deliverable specifications are confirmed before booking.</p>
  </div></section>;
}
