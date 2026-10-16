import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites-view";
export const metadata: Metadata = { title: "Saved Photographs", robots: { index: false, follow: false } };
export default function FavoritesPage() {
  return (
    <main id="main-content">
      <FavoritesView />
    </main>
  );
}
