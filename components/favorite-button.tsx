"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const key = "mwm-favorites-v1";
function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function FavoriteButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setSaved(readFavorites().includes(slug)));
  }, [slug]);
  const toggle = () => {
    const current = readFavorites();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(next.includes(slug));
    trackEvent("favorite", { slug, saved: next.includes(slug) });
    window.dispatchEvent(new Event("mwm:favorites"));
  };
  return (
    <button
      type="button"
      className={`favorite-button ${saved ? "saved" : ""} ${compact ? "compact" : ""}`}
      aria-pressed={saved}
      onClick={toggle}
    >
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
      {compact ? (
        <span className="sr-only">{saved ? "Remove from saved photographs" : "Save photograph"}</span>
      ) : saved ? (
        "Saved"
      ) : (
        "Save photograph"
      )}
    </button>
  );
}
