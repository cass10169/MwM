import { AdminPage } from "@/components/admin-page";
import { SettingsEditor } from "@/components/settings-editor";
import { getSiteSetting } from "@/lib/catalog";

export default async function AdminSettingsPage() {
  const [brand, homepage, commerce, navigation, servicePricing] = await Promise.all([
    getSiteSetting("brand", {
      businessName: "Memories with Mike",
      photographer: "Michael Kennedy",
      contactEmail: "michael.kennedy@ku.edu",
      location: "Lawrence, Kansas",
    }),
    getSiteSetting("homepage", {
      heroPhotographSlug: "painted-silence",
      heroTitle: "Where wild places become lasting memories.",
      heroLocation: "Monarch Lake, Colorado",
      heroStatement:
        "Quiet, immersive photographs shaped by light, distance, and the moments that ask us to slow down.",
      signatureStory:
        "Morning light settles across Monarch Lake as the surrounding peaks emerge in reflected color. Painted Silence captures the stillness of Colorado’s high country—the brief interval when light, water, and mountain become nearly indistinguishable.",
      featuredCollectionSlug: "mountain-stillness",
      showServices: true,
      showJournal: true,
      showNewsletter: true,
    }),
    getSiteSetting("commerce", {
      checkoutEnabled: false,
      currency: "USD",
      fulfillmentProvider: "MANUAL",
      maintenanceMode: false,
    }),
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
    getSiteSetting("service-pricing", { weddings: "", graduations: "", families: "", events: "", commissioned: "" }),
  ]);
  return (
    <AdminPage eyebrow="Configuration" title="Site settings">
      <SettingsEditor initial={{ brand, homepage, commerce, navigation, servicePricing }} />
    </AdminPage>
  );
}
