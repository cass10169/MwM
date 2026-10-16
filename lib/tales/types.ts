export type StoryImage = {
  id: string;
  src: string;
  sources?: Array<{ src: string; width: number }>;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  role: "documentary" | "portfolio";
  // Portfolio designation and buyer links require Michael's approval of the final edit.
  approvedFinal?: boolean;
  photographSlug?: string;
  credit?: string;
};
export type StoryBlock = { id: string } & (
  | { type: "intro" | "text" | "wildlife" | "campsite" | "route"; title?: string; paragraphs: string[]; items?: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; image: StoryImage; fullWidth?: boolean }
  | { type: "gallery"; images: [StoryImage, StoryImage] | [StoryImage, StoryImage, StoryImage] }
  | { type: "video"; src: string; poster: string; title: string; width: number; height: number; transcript: string; captions?: string; mutedPreview?: boolean }
  | { type: "behind-shot"; title: string; paragraphs: string[]; image: StoryImage }
  | { type: "cta"; kind: "print" | "licensing" | "partnership"; photographSlug?: string }
  | { type: "future"; editorialNote: string; visible?: boolean }
);
export type RoadStory = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  description: string;
  published: boolean;
  version: number;
  publishedAt: string;
  updatedAt: string;
  tripLabel: string;
  growingNote: string;
  mediaNote?: string;
  hero?: StoryImage;
  blocks: StoryBlock[];
};
