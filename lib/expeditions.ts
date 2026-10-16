export type Expedition = {
 slug: string; title: string; destination: string; status: "DRAFT" | "PUBLISHED";
 dates?: { start: string; end: string; verification: string };
 route?: string[]; mission?: string; photographyGoals?: string[]; conditions?: string[];
 photographSlugs: string[]; journalSlugs?: string[]; behindTheScenes?: string[]; lessons?: string[];
 gear?: Array<{ itemId: string; verification: string }>;
 partners?: Array<{ name: string; verification: string }>;
 deliverables?: Array<{ description: string; agreementReference: string }>;
 resultingMedia?: Array<{ title: string; url: string }>;
};
export const expeditions: Expedition[] = [{
 slug: "colorado-field-archive", title: "Colorado, in light and water.", destination: "Colorado", status: "PUBLISHED",
 mission: "A selected photographic archive from Colorado: alpine lakes, high country, waterfalls, and mountain valleys.",
 photographSlugs: ["painted-silence", "high-country-passage", "canyon-cascade", "crystal-mill", "valley-before-rain", "alpine-afterglow"],
}, {
 slug: "colorado-2026", title: "Chasing Autumn Through Colorado", destination: "Colorado", status: "DRAFT", photographSlugs: [],
 // October 2026 case study awaits image matching and verified trip-specific narrative.
}];
export const publishedExpeditions = expeditions.filter(e=>e.status==="PUBLISHED"&&e.photographSlugs.length>0);
