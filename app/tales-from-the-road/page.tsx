import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { StoryPreview } from "@/components/road-story";
import { publishedRoadStories } from "@/lib/tales";
import { pageMetadata } from "@/lib/outdoor";

export const metadata = { ...pageMetadata("Tales from the Road", "Travel stories and evolving field notes from outdoor photographer Michael Kennedy: the roads, wildlife, campsites and moments behind the image.", "/tales-from-the-road"), openGraph: { title: "Tales from the Road | Memories with Mike", description: "Stories and field notes from the places behind the finished image.", url: "/tales-from-the-road", type: "website" as const, images:["/og.png"] }, twitter: { card:"summary_large_image" as const, images:["/og.png"] } };
export default function TalesArchive() {
  return <main id="main-content"><PageHero eyebrow="The living field journal" title="Tales from the Road" intro="Stories, field notes, photographs, and moments from the places behind the finished image."/>
    <nav className="container-wide road-breadcrumb" aria-label="Breadcrumb"><Link href="/journal">Field Journal</Link><span aria-hidden="true"> / </span><span>Tales from the Road</span></nav>
    {publishedRoadStories.map(story=><StoryPreview key={story.slug} story={story}/>)}
    <section className="section section-ivory"><div className="road-prose"><h2>Every trip leaves a story.</h2><p>The stops that become traditions. The weather that changes the plan. The photographs that begin with a glance through the windshield. These entries grow as the field notes and files come together.</p><Link className="text-link" href="/journal">Explore the rest of the Field Journal →</Link></div></section>
  </main>;
}
