import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RoadBlock } from "../../components/road-story";
import { coloradoAutumn2026 as story } from "../../lib/tales/colorado-autumn-2026";
import type { StoryBlock, StoryImage } from "../../lib/tales/types";
const image:StoryImage={id:"fixture",src:"/fixture.webp",width:900,height:1600,alt:"Test-only portrait photograph",role:"documentary",sources:[{src:"/fixture-small.webp",width:640}]};
const render=(block:StoryBlock,printLinks:Record<string,string>={})=>renderToStaticMarkup(<RoadBlock block={block} story={story} printLinks={printLinks}/>);
describe("reusable media blocks",()=>{
  it("retains portrait dimensions, responsive sources and lazy loading",()=>{
    const html=render({id:"photo",type:"image",image});
    expect(html).toContain('width="900"');expect(html).toContain('height="1600"');expect(html).toContain('loading="lazy"');expect(html).toContain('/fixture-small.webp 640w');
    for(const images of [[image,{...image,id:"second"}],[image,{...image,id:"second"},{...image,id:"third"}]] as const){
      const html=render({id:"gallery",type:"gallery",images:[...images]});expect((html.match(/<img /g)||[]).length).toBe(images.length);
    }
  });
  it("does not publish planning slots or unapproved Behind the Shot",()=>{
    expect(render({id:"planned",type:"future",editorialNote:"Private planning"})).toBe("");
    expect(render({id:"shot",type:"behind-shot",image,title:"Not approved",paragraphs:[]})).toBe("");
  });
  it("gates prints and uses real product URLs even when slugs differ",()=>{
    const block:StoryBlock={id:"print",type:"cta",kind:"print",photographSlug:"photo-name"};
    expect(render(block)).toBe("");expect(render(block,{"photo-name":"/prints/product-name"})).toContain('href="/prints/product-name"');
  });
  it("renders controlled muted video without eagerly attaching the movie",()=>{
    const html=render({id:"video",type:"video",src:"/fixture.mp4",poster:"/poster.webp",title:"Test clip",width:900,height:1600,transcript:"A test-only clip description."});
    expect(html).toContain('controls=""');expect(html).toContain('muted=""');expect(html).toContain('preload="none"');expect(html).not.toContain('src="/fixture.mp4"');expect(html).toContain('Video description and transcript');
  });
});
