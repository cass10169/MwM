import type { Metadata } from "next";
import { SearchView } from "@/components/search-view";
import { getCollections, getJournalPosts, getPublicPhotographs, getStoreProducts } from "@/lib/catalog";
export const metadata: Metadata = { title: "Search", robots: { index: false, follow: false } };
export default async function SearchPage() {
  const [photographs, collections, products, journalPosts] = await Promise.all([
    getPublicPhotographs(),
    getCollections(),
    getStoreProducts(),
    getJournalPosts(),
  ]);
  return (
    <main id="main-content" className="section section-ivory">
      <div className="container-narrow">
        <p className="eyebrow ink">Find a photograph, place, or story</p>
        <h1 className="display-title">Search Memories with Mike</h1>
        <SearchView
          photographs={photographs}
          collections={collections}
          products={products}
          journalPosts={journalPosts}
        />
      </div>
    </main>
  );
}
