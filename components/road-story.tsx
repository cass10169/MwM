import Link from "next/link";
import type { RoadStory, StoryBlock, StoryImage } from "@/lib/tales/types";
import { storyInquiry, storyPath } from "@/lib/tales";
import { RoadVideo } from "./road-video";

export function RoadImage({ image, eager = false }: { image: StoryImage; eager?: boolean }) {
  return <figure className={`road-photo road-photo-${image.role}`}>
    {/* Web derivatives retain the source aspect ratio; phone portraits are never forced into landscape crops. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image.src} srcSet={image.sources?.map(s=>`${s.src} ${s.width}w`).join(", ")} sizes="(max-width: 768px) 100vw, 1200px" width={image.width} height={image.height} alt={image.alt} loading={eager ? "eager" : "lazy"} decoding="async" fetchPriority={eager ? "high" : "auto"}/>
    {(image.caption || image.credit) && <figcaption>{image.caption}{image.credit && <span>{image.credit}</span>}</figcaption>}
  </figure>;
}

export function StoryPreview({ story }: { story: RoadStory }) {
  return <section className="section section-stone road-preview"><div className="container-wide road-preview-grid">
    {story.hero ? <Link href={storyPath(story.slug)} aria-label={`Read ${story.title}`}><RoadImage image={story.hero}/></Link> : <div className="road-dispatch" aria-hidden="true"><span>Field journal / Version {story.version}</span><p>Out on<br/>the <em>road.</em></p><span>{story.tripLabel}</span></div>}
    <div><p className="eyebrow ink">Tales from the Road</p><p className="road-deck">Stories, field notes, photographs, and moments from the places behind the finished image.</p><h2>{story.title}</h2><p>{story.excerpt}</p><p className="road-meta">Version {story.version} · An evolving field journal</p><Link className="text-link" href={storyPath(story.slug)}>Read the story →</Link></div>
  </div></section>;
}

export function RoadBlock({ block, story, printLinks }: { block: StoryBlock; story: RoadStory; printLinks: Record<string,string> }) {
  if(block.type === "future") return block.visible ? <aside className="road-prose road-note" id={block.id}>{block.editorialNote}</aside> : null;
  if(block.type === "quote") return <div className="road-pullquote" id={block.id}><p>{block.text}</p><span className="eyebrow ink">From the road</span></div>;
  if(block.type === "image") return <div id={block.id} className={block.fullWidth ? "road-wide" : "road-prose"}><RoadImage image={block.image}/></div>;
  if(block.type === "gallery") return <div id={block.id} className={`road-wide road-gallery road-gallery-${block.images.length}`}>{block.images.map(image=><RoadImage key={image.id} image={image}/>)}</div>;
  if(block.type === "video") return <div className="road-wide" id={block.id}><RoadVideo {...block}/></div>;
  if(block.type === "behind-shot") return block.image.approvedFinal ? <section className="road-wide road-behind" id={block.id}><RoadImage image={block.image}/><div><p className="eyebrow ink">Behind the Shot</p><h2>{block.title}</h2>{block.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</div></section> : null;
  if(block.type === "cta") {
    if(block.kind === "print" && (!block.photographSlug || !printLinks[block.photographSlug])) return null;
    return <div className="road-prose road-inline-cta" id={block.id}><Link className="text-link" href={block.kind === "print" ? printLinks[block.photographSlug!] : storyInquiry(story.slug,block.kind,block.photographSlug)}>{block.kind === "print" ? "View this print" : block.kind === "licensing" ? "License this image" : "Partner on a future field project"} →</Link></div>;
  }
  return <section className={`road-prose road-chapter road-${block.type}`} id={block.id}>
    {block.title && <h2>{block.title}</h2>}
    {block.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
    {block.items && <ol className="road-route" aria-label="Recalled route, not turn-by-turn directions">{block.items.map(item=><li key={item}>{item}</li>)}</ol>}
  </section>;
}
