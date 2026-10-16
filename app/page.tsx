import Link from "next/link";
import { EditorialPhoto } from "@/components/editorial-photo";
import { getPublicPhotographs } from "@/lib/catalog";
import { imageRoles, pageMetadata } from "@/lib/outdoor";
export const metadata = pageMetadata("Outdoor Photography & Field Content", "Landscape and wildlife photography, outdoor brand content, and field stories by Michael Kennedy in Lawrence, Kansas.", "/");
export default async function Home() {
  const photographs = await getPublicPhotographs();
  const photo = (slug: string) => photographs.find(p => p.slug === slug);
  const hero = photo(imageRoles.hero);
  return <main id="main-content" className="outdoor-home">
    <section className="hero outdoor-hero section-dark" aria-labelledby="hero-heading">
      <div className="hero-art"><EditorialPhoto photo={hero} eager ratio="16 / 9" sizes="(min-width: 2048px) 2048px, 100vw" /><div className="hero-vignette" /></div>
      <div className="hero-content container-wide">
        <p className="eyebrow">Michael Kennedy · Outdoor Photographer &amp; Field Content Creator</p>
        <h1 id="hero-heading">Wild Places.<br />Real Adventures.<br /><em>Lasting Stories.</em></h1>
        <p className="hero-copy">Mountains, wildlife, weather, and the journey behind the image. Photography and field stories from Kansas to Colorado’s high country.</p>
        <div className="button-row"><Link className="button button-light" href="/portfolio">Explore the photography ↗</Link><Link className="button button-outline-light" href="/partners">Partner with Mike →</Link></div>
      </div>
      <p className="outdoor-caption">{hero?.title} · {hero?.location}</p>
    </section>
    <div className="intro-strip"><div className="container-wide intro-strip-inner"><p>Based in Lawrence, Kansas</p><p className="intro-statement">Photography. Exploration. Stories from the Wild.</p><Link className="text-link" href="/prints">Fine-art prints ↗</Link></div></div>
    <section className="section section-ivory" aria-labelledby="beyond-heading"><div className="container-wide">
      <div className="outdoor-heading"><p className="eyebrow ink">01 / The work</p><h2 id="beyond-heading">Photography beyond<br />the trailhead.</h2><p>The destination is only part of the story. Discover expansive landscapes, close wildlife encounters, and the roads and waterways that lead there.</p></div>
      <div className="outdoor-stories">
        {[{slug:imageRoles.landscape,title:"Landscapes",text:"Scale, weather, and the character of a place.",href:"/portfolio/landscapes",ratio:"2.8 / 1"},
          {slug:imageRoles.wildlife,title:"Wildlife",text:"Encounters that reward a patient eye.",href:"/portfolio/wildlife",ratio:"1 / 1"},
          {slug:imageRoles.adventure,title:"Adventure",text:"The places reached, and the experience of getting there.",href:"/expeditions",ratio:"4 / 5"}].map((item,i)=><article className={`outdoor-story story-${i}`} key={item.slug}><Link href={item.href}><EditorialPhoto photo={photo(item.slug)} ratio={item.ratio} sizes={i===0?"(max-width: 800px) 100vw, 1440px":"(max-width: 800px) 100vw, 700px"}/><div className="outdoor-story-copy"><span className="eyebrow ink">{String(i+1).padStart(2,"0")}</span><h3>{item.title} ↗</h3><p>{item.text}</p></div></Link></article>)}
      </div>
    </div></section>
    <section className="section section-dark outdoor-partners" aria-labelledby="partner-heading"><div className="container-wide">
      <div className="outdoor-heading"><p className="eyebrow">02 / Create together</p><h2 id="partner-heading">Partner with<br /><em>Memories with Mike.</em></h2><p>Put your brand in the landscape. Commission photography, destination stories, and practical field content shaped around a clear creative brief.</p></div>
      <div className="partnership-sectors">{["Photography","Outdoor","Adventure & Vehicle","Technology"].map((name,i)=><div key={name}><span>0{i+1}</span><h3>{name}</h3><p>{["Tools for making and carrying photographs.","Systems for time on trails and in camp.","Travel, storage, and access to the field.","Power, navigation, communications, and production."][i]}</p></div>)}</div>
      <div className="button-row"><Link className="button button-light" href="/partners">Explore partnership opportunities →</Link><Link className="text-link light" href="/media-kit">View the media kit ↗</Link></div>
    </div></section>
    <section className="section section-stone"><div className="container-wide outdoor-feature"><EditorialPhoto photo={photo(imageRoles.print)} ratio="3 / 2" /><div><p className="eyebrow ink">03 / Bring the landscape home</p><h2>More than a view.<br /><em>A place to return to.</em></h2><p>Explore Michael’s landscape and wildlife photographs. Ask about a specific image, print size, or finish, and receive a tailored estimate.</p><Link className="button button-dark" href="/prints">Explore fine-art prints →</Link></div></div></section>
    <section className="section section-ivory"><div className="container-wide outdoor-feature outdoor-about"><EditorialPhoto photo={photo(imageRoles.portrait)} ratio="3 / 2" fit="contain" /><div><p className="eyebrow ink">04 / Behind the camera</p><h2>Michael Kennedy.</h2><p>Outdoor photographer and field content creator based in Lawrence, Kansas. Landscapes, wildlife, travel, and the stories that connect an image to its place.</p><Link className="text-link" href="/about">Meet Michael →</Link></div></div></section>
    <section className="outdoor-local section-dark"><div className="container-wide"><div><p className="eyebrow">Closer to home</p><h2>People. Milestones.<br />Your next chapter.</h2><p>Portraits, graduations, weddings, families, and events in Lawrence, Topeka, and the Kansas City area.</p></div><Link className="button button-outline-light" href="/services">Photography services →</Link></div></section>
  </main>;
}
