import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { checkoutEnabled, getSiteSetting } from "@/lib/catalog";
import { outdoorNavigation } from "@/lib/outdoor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com"),
  title: { default: "Memories with Mike | Outdoor Photography & Field Content", template: "%s | Memories with Mike" },
  description:
    "Outdoor photography, field storytelling, commercial content, and fine-art prints by Michael Kennedy in Lawrence, Kansas.",
  applicationName: "Memories with Mike",
  authors: [{ name: "Michael Kennedy", url: "https://memorieswithmike.com/about" }],
  creator: "Michael Kennedy",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Memories with Mike",
    title: "Memories with Mike | Outdoor Photography & Field Content",
    description: "Photography. Exploration. Stories from the Wild.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Memories with Mike fine-art photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memories with Mike | Outdoor Photography & Field Content",
    description: "Photography. Exploration. Stories from the Wild.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#171813" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [navigation, commerceEnabled] = await Promise.all([
    getSiteSetting("navigation", {
      primary: [
        { href: "/portfolio", label: "Portfolio" },
        { href: "/prints", label: "Fine-art prints" },
        { href: "/services", label: "Services" },
        { href: "/journal", label: "Journal" },
        { href: "/about", label: "About" },
      ],
      socialLinks: [] as Array<{ href: string; label: string }>,
    }),
    checkoutEnabled(),
  ]);
  const primaryNavigation = outdoorNavigation;
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Memories with Mike",
              url: "https://memorieswithmike.com",
              email: "michael.kennedy@ku.edu",
              founder: { "@type": "Person", name: "Michael Kennedy" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lawrence",
                addressRegion: "KS",
                addressCountry: "US",
              },
              description: "Fine-art landscape and wildlife photography, plus commissioned photography services.",
            }),
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <CartProvider>
          <AnalyticsProvider />
          <SiteHeader navigation={primaryNavigation.length ? primaryNavigation : undefined} commerceEnabled={commerceEnabled} />
          {children}
          <SiteFooter socialLinks={navigation.socialLinks} />
        </CartProvider>
      </body>
    </html>
  );
}
