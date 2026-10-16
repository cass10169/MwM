import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/cart", "/checkout", "/favorites", "/search", "/order/", "/field-kit", "/gear", "/expeditions/colorado-2026"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
