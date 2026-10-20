import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoadBlock, RoadImage } from "@/components/road-story";
import { getRoadStory, storyInquiry, storyPath } from "@/lib/tales";
import { getStoreProducts } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
  const story=getRoadStory((await params).slug);
  if(!story) return {title:"Story not found",robots:{index:false}};
  const image=story.hero?.src ?? "/og.png";
  return {title:story.title,description:story.description,alternates:{canonical:storyPath(story.slug)},openGraph:{title:story.title,description:story.description,url:storyPath(story.slug),type:"article",publishedTime:story.publishedAt,modifiedTime:story.updatedAt,authors:["Michael Kennedy"],images:[{url:image,alt:story.hero?.alt ?? "Memories with Mike"}]},twitter:{card:"summary_large_image",title:story.title,description:story.description,images:[image]}};
}
export default async function RoadStoryPage({ params }: { params: Promise<{slug:string}> }) {
  const story=getRoadStory((await params).slug);
  if(!story) notFound();
  const products=await getStoreProducts();
  const printLinks=Object.fromEntries(products.filter(p=>p.enabled && p.variants.some(v=>v.available && !v.id.startsWith("sample-"))).map(p=>[p.photographSlug,`/prints/${p.slug}`]));
  const finalImages=story.blocks.flatMap(b=>b.type === "image" || b.type === "behind-shot" ? [b.image] : b.type === "gallery" ? b.images : []).filter(image=>image.approvedFinal && image.photographSlug && printLinks[image.photographSlug]);
  const chapters=story.blocks.filter(b=>"title" in b && b.title && ["intro","text","wildlife","route","campsite"].includes(b.type));
  const base="https://memorieswithmike.com";
  const schema=[{"@context":"https://schema.org","@type":"BlogPosting",headline:story.title,description:story.description,datePublished:story.publishedAt,dateModified:story.updatedAt,author:{"@type":"Person",name:"Michael Kennedy",url:base+"/about"},publisher:{"@type":"Organization",name:"Memories with Mike"},mainEntityOfPage:base+storyPath(story.slug),...(story.hero ? {image:{"@type":"ImageObject",url:base+story.hero.src,width:story.hero.width,height:story.hero.height,caption:story.hero.caption}} : {})},{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{name:"Field Journal",item:base+"/journal"},{name:"Tales from the Road",item:base+"/tales-from-the-road"},{name:story.title,item:base+storyPath(story.slug)}].map((item,i)=>({"@type":"ListItem",position:i+1,...item}))}];
  return <main id="main-content" className="road-story">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <article>
      <header className="road-header section-dark"><div className="container-wide">
        <nav className="road-breadcrumb" aria-label="Breadcrumb"><Link href="/journal">Field Journal</Link><span aria-hidden="true"> / </span><Link href="/tales-from-the-road">Tales from the Road</Link></nav>
        <p className="eyebrow">Tales from the Road / {story.tripLabel}</p><h1>{story.title}</h1><p className="road-subtitle">{story.subtitle}</p><p className="road-meta">Words & photographs by Michael Kennedy · Version {story.version} · Updated <time dateTime={story.updatedAt}>{new Date(story.updatedAt+"T12:00:00Z").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"})}</time></p>
      </div></header>
      {story.hero && <div className="road-hero-photo"><RoadImage image={story.hero} eager storySlug={story.slug}/></div>}
      <div className="road-prose road-note"><p className="eyebrow ink">An evolving field journal</p><p>{story.growingNote}</p>{story.mediaNote && <p>{story.mediaNote}</p>}</div>
      <nav className="road-prose road-contents" aria-label="Story chapters"><details><summary>Along the way</summary><ol>{chapters.map(block=><li key={block.id}><a href={`#${block.id}`}>{"title" in block ? block.title : ""}</a></li>)}</ol></details></nav>
      <div className="road-body">{story.blocks.map(block=><RoadBlock key={block.id} block={block} story={story} printLinks={printLinks}/>)}</div>
      <footer className="road-prose road-endnote"><p className="eyebrow ink">To be continued</p><p>{story.growingNote}</p><p className="road-meta">Businesses and equipment appear here as parts of my trip, not as sponsors or partners.</p><Link className="text-link" href="/tales-from-the-road">All tales from the road →</Link></footer>
    </article>
    <aside className="section section-stone"><div className="road-prose"><p className="eyebrow ink">Beyond the story</p><h2>Bring a Story to Life</h2><p>Let’s discuss destination photography, outdoor campaigns, environmental product photography, expedition storytelling, commercial image licensing, or a travel-based creative assignment.</p><p>Image availability and usage rights are confirmed individually.</p><div className="road-commercial-links">{finalImages.length>0 && <Link className="text-link" href={printLinks[finalImages[0].photographSlug!]}>View Colorado prints →</Link>}<Link className="text-link" href={storyInquiry(story.slug,"licensing")}>License an image →</Link><Link className="text-link" href={storyInquiry(story.slug,"partnership")}>Discuss a Partnership →</Link></div></div></aside>
  </main>;
}
