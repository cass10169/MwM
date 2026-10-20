import { coloradoAutumn2026 } from "./colorado-autumn-2026";
export const roadStories = [coloradoAutumn2026];
export const publishedRoadStories = roadStories.filter(story => story.published).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
export const getRoadStory = (slug: string) => publishedRoadStories.find(story=>story.slug===slug);
export const storyPath = (slug: string) => `/tales-from-the-road/${slug}`;
export function storyInquiry(slug: string, kind: "licensing" | "partnership", image?: string) {
  const query = new URLSearchParams({service: kind === "licensing" ? "Licensing" : "Expedition Partnership", story: slug});
  if(image) query.set("image",image);
  return `/contact?${query.toString()}`;
}

export function storyImages(slug: string) {
  const story=getRoadStory(slug);
  if(!story) return [];
  return [...(story.hero ? [story.hero] : []), ...story.blocks.flatMap(b=>"image" in b ? [b.image] : b.type==="gallery" ? b.images : [])];
}
export const getStoryImage = (slug: string, id: string) => storyImages(slug).find(image=>image.id===id && image.licensable);
export function storyImageInquiry(slug: string, id: string) {
  return `/contact?${new URLSearchParams({service:"Licensing",story:slug,storyImage:id})}`;
}
