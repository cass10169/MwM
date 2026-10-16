import type { Photograph } from "./content";

export const isOutdoor = (photo: Pick<Photograph, "category">) =>
  ["Landscapes", "Wildlife", "Nature & Macro"].includes(photo.category);

export function inquiryLink(type: string, image?: string, session?: string) {
  const query = new URLSearchParams({ service: type });
  if (image) query.set("image", image);
  if (session) query.set("session", session);
  return `/contact?${query}`;
}

export const commercialCapabilities = [
  ["Photographer-led production", "One creative point of contact for the brief, photographic approach, selection, and finished image set."],
  ["Real outdoor environments", "Landscape, wildlife, water, and mountain work demonstrate a visual approach grounded in actual places."],
  ["Designed for the intended use", "Plan horizontal web compositions, vertical social assets, and detail photographs around the campaign. Resolution and crops are confirmed for each use."],
  ["Clear usage rights", "Define media, territory, duration, and exclusivity before production or licensing. Commission a focused set or a broader image library."],
] as const;

export const sampleDeliverables = [
  { title: "Field content", description: "A product or campaign photographed in an outdoor setting.", items: ["Hero and environmental product photographs", "Details, vertical social and horizontal web assets", "Written field observations and an agreed licensed image set"] },
  { title: "Destination story", description: "A visual introduction to a place and its character.", items: ["Landscape imagery and location details", "Trail or environment storytelling", "Editorial field notes and tourism-oriented social assets"] },
  { title: "Expedition partnership", description: "A defined photographic mission with a production plan.", items: ["Trip storytelling and planned product-in-use imagery", "Landscape assets and field observations", "Social assets with agreed licensing and disclosures"] },
];

// Publish audience metrics only with a dated, verifiable source and owner approval.
export const verifiedAudienceMetrics: Array<{ label: string; value: string; source: string; asOf: string }> = [];
