"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { photographs } from "@/lib/content";
import { PhotoCard } from "./photo-card";

function read() {
  try {
    return JSON.parse(localStorage.getItem("mwm-favorites-v1") ?? "[]") as string[];
  } catch {
    return [];
  }
}
export function FavoritesView() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const update = () => setSlugs(read());
    queueMicrotask(update);
    window.addEventListener("mwm:favorites", update);
    return () => window.removeEventListener("mwm:favorites", update);
  }, []);
  const saved = photographs.filter((photo) => slugs.includes(photo.slug));
  if (!saved.length)
    return (
      <div className="empty-state cart-empty">
        <p className="eyebrow ink">Saved photographs</p>
        <h1>Keep the photographs that stay with you.</h1>
        <p>Use the heart beside any photograph to build a personal shortlist.</p>
        <Link className="button button-dark" href="/portfolio">
          Explore the portfolio
        </Link>
      </div>
    );
  return (
    <div className="section section-ivory">
      <div className="container-wide">
        <div className="section-heading">
          <p className="eyebrow ink">Your shortlist</p>
          <h1 className="display-title">Saved photographs</h1>
        </div>
        <div className="standard-photo-grid">
          {saved.map((photo) => (
            <PhotoCard key={photo.slug} photo={photo} />
          ))}
        </div>
      </div>
    </div>
  );
}
