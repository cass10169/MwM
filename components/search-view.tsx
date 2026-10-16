"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Photograph, StoreProduct } from "@/lib/content";
import type { CatalogCollection, CatalogJournalPost } from "@/lib/catalog";

export function SearchView({
  photographs,
  collections,
  products,
  journalPosts,
}: {
  photographs: Photograph[];
  collections: CatalogCollection[];
  products: StoreProduct[];
  journalPosts: CatalogJournalPost[];
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    return [
      ...photographs.map((item) => ({
        type: "Photograph",
        title: item.title,
        detail: item.location,
        href: `/prints/${item.slug}`,
      })),
      ...collections.map((item) => ({
        type: "Collection",
        title: item.title,
        detail: item.subtitle,
        href: `/collections/${item.slug}`,
      })),
      ...products
        .filter((item) => item.enabled)
        .map((item) => ({
          type: "Print",
          title: `${item.title} fine-art print`,
          detail: "Available in multiple materials",
          href: `/prints/${item.slug}`,
        })),
      ...journalPosts.map((item) => ({
        type: "Journal",
        title: item.title,
        detail: item.excerpt,
        href: `/journal/${item.slug}`,
      })),
    ]
      .filter((item) => `${item.title} ${item.detail} ${item.type}`.toLowerCase().includes(needle))
      .slice(0, 24);
  }, [collections, journalPosts, photographs, products, query]);
  return (
    <div className="search-shell">
      <label htmlFor="site-search">Search the collection</label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoFocus
        placeholder="Try “Colorado,” “wildlife,” or “metal”"
      />
      <p className="result-count" aria-live="polite">
        {query.length < 2 ? "Enter at least two characters" : `${results.length} results`}
      </p>
      <div className="search-results">
        {results.map((result) => (
          <Link href={result.href} key={`${result.type}-${result.href}`}>
            <span className="eyebrow ink">{result.type}</span>
            <h2>{result.title}</h2>
            <p>{result.detail}</p>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
      </div>
    </div>
  );
}
