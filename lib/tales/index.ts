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
