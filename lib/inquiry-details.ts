import type { InquiryData } from "./validation";
import { getRoadStory, storyPath } from "./tales";

// Stored in the existing message column so previous admin versions can read the full brief.
export function inquiryMessage(value: InquiryData, image?: { title: string; slug: string; id?: string }) {
  const story=value.storySlug ? getRoadStory(value.storySlug) : undefined;
  const fields: Array<[string, string | undefined]> = [
    ["Story", story ? `${story.title} (https://memorieswithmike.com${storyPath(story.slug)})` : undefined],
    ["Photograph", image ? `${image.title} (${image.slug}${image.id ? `; ID ${image.id}` : ""})` : value.imageReference],
    ["Service", value.sessionType], ["Product / destination / campaign", value.projectSubject],
    ["Desired deliverables", value.deliverables], ["Intended use", value.intendedUse],
    ["Media", value.media], ["Territory", value.territory], ["Usage duration", value.duration],
    ["Exclusivity", value.exclusivity], ["Preferred dimensions", value.printSize],
    ["Preferred medium", value.printMedium], ["Shipping destination", value.shippingDestination],
    ["Coverage requirements", value.coverage], ["Event date", value.eventDate],
    ["Budget", value.budget], ["Phone", value.phone],
  ];
  return [value.message, ...fields.filter(([, text]) => text).map(([label, text]) => `${label}: ${text}`)].join("\n\n");
}
