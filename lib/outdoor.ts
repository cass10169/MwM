import type { Metadata } from "next";
export const outdoorNavigation = [
  { href: "/portfolio", label: "Explore" },
  { href: "/journal", label: "Field Journal" },
  { href: "/partners", label: "Partners" },
  { href: "/expeditions", label: "Expeditions" },
  { href: "/prints", label: "Prints" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path },
    openGraph: { title: `${title} | Memories with Mike`, description, url: path, type: "website", images: ["/photographs/canyon-cascade-2048.webp"] },
    twitter: { card: "summary_large_image", title, description, images: ["/photographs/canyon-cascade-2048.webp"] } };
}
export const imageRoles = {
  hero: "canyon-cascade", landscape: "high-country-passage", wildlife: "monarch-of-the-meadow",
  adventure: "crystal-mill", print: "painted-silence", portrait: "studio-gaze",
} as const;
export const partnershipModels = [
  { title: "Product Partnership", description: "An agreed exchange of equipment support and field content, with the scope, usage rights, and disclosure defined before production." },
  { title: "Expedition Partner", description: "Support a field project through travel, lodging, fuel, equipment, or production funding. The itinerary and deliverables are agreed for each assignment." },
  { title: "Content Partnership", description: "Commission outdoor photographs and storytelling for a specific campaign, destination, or product." },
  { title: "Brand Ambassador", description: "Discuss a continuing relationship with recurring production, licensing, and optional affiliate activity." },
];
