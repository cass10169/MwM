import type { MetadataRoute } from "next";
import { publishedExpeditions } from "@/lib/expeditions";
import { getCollections, getJournalPosts, getStoreProducts } from "@/lib/catalog";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products, journalPosts] = await Promise.all([
    getCollections(),
    getStoreProducts(),
    getJournalPosts(),
  ]);
  const staticRoutes = [
    "",
    "/portfolio",
    "/portfolio/landscapes",
    "/portfolio/wildlife",
    "/portfolio/events",
    ...["waterfalls","night","colorado","kansas","national-parks"].map(s=>`/portfolio/${s}`),
    "/collections",
    "/prints",
    "/services",
    "/about",
    "/journal",
    "/contact",
    "/partners",
    "/media-kit",
    "/expeditions",
    ...publishedExpeditions.map(e => `/expeditions/${e.slug}`),
    "/faq",
    "/shipping-returns",
    "/privacy",
    "/terms",
    "/accessibility",
  ];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...collections.map((collection) => ({
      url: `${base}/collections/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...products
      .filter((product) => product.enabled)
      .map((product) => ({
        url: `${base}/prints/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...journalPosts
      .filter((post) => post.published)
      .map((post) => ({
        url: `${base}/journal/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
  ];
}
