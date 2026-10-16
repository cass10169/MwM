"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Photograph } from "@/lib/content";
import { PlaceholderFrame } from "./placeholder-frame";
import { FavoriteButton } from "./favorite-button";
import { ShareButton } from "./share-button";

export function PortfolioBrowser({ initialPhotos }: { initialPhotos: Photograph[] }) {
  const [category, setCategory] = useState("All");
  const [orientation, setOrientation] = useState("All");
  const [color, setColor] = useState("All");
  const [location, setLocation] = useState("All");
  const [available, setAvailable] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const filtered = useMemo(
    () =>
      initialPhotos.filter(
        (photo) =>
          (category === "All" || photo.category === category) &&
          (orientation === "All" || photo.orientation === orientation) &&
          (color === "All" || photo.color === color) &&
          (location === "All" || photo.location === location) &&
          (!available || photo.available),
      ),
    [initialPhotos, category, orientation, color, location, available],
  );
  const locations = useMemo(() => [...new Set(initialPhotos.map((photo) => photo.location))].sort(), [initialPhotos]);
  const categories = useMemo(() => [...new Set(initialPhotos.map((photo) => photo.category))].sort(), [initialPhotos]);

  const open = (index: number) => {
    setZoomed(false);
    setActive(index);
    dialogRef.current?.showModal();
  };
  const close = () => {
    dialogRef.current?.close();
    setActive(null);
  };
  const move = (direction: number) => {
    setZoomed(false);
    setActive((current) => (current === null ? 0 : (current + direction + filtered.length) % filtered.length));
  };
  const photo = active === null ? null : filtered[active];

  return (
    <>
      <div className="gallery-toolbar" aria-label="Filter photographs">
        <div className="filter-row">
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All</option>
              {categories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Orientation
            <select value={orientation} onChange={(event) => setOrientation(event.target.value)}>
              <option>All</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="panoramic">Panoramic</option>
            </select>
          </label>
          <label>
            Color
            <select value={color} onChange={(event) => setColor(event.target.value)}>
              <option>All</option>
              <option value="earth">Earth</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </label>
          <label>
            Location
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              <option>All</option>
              {locations.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="check-label">
            <input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} />{" "}
            Available as print
          </label>
        </div>
        <button className="view-toggle" type="button" aria-pressed={immersive} onClick={() => setImmersive(!immersive)}>
          {immersive ? "Grid view" : "Immersive view"}
        </button>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length} photographs
      </p>
      <div className={`portfolio-grid ${immersive ? "immersive-grid" : ""}`}>
        {filtered.map((item, index) => {
          const ratio =
            item.orientation === "portrait"
              ? "4 / 5"
              : item.orientation === "square"
                ? "1 / 1"
                : item.orientation === "panoramic"
                  ? "2 / 1"
                  : "3 / 2";
          return (
            <article className={`portfolio-item item-${item.orientation}`} key={item.slug}>
              <button
                className="portfolio-image-button"
                type="button"
                onClick={() => open(index)}
                aria-label={`Enlarge ${item.title}`}
              >
                <PlaceholderFrame
                  label={item.title}
                  filename={item.filename}
                  ratio={ratio}
                  variant={item.variant}
                  src={item.displayUrl}
                  alt={item.altText}
                  focalPointX={item.focalPointX}
                  focalPointY={item.focalPointY}
                />
              </button>
              <div className="portfolio-item-meta">
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.location}</p>
                </div>
                <FavoriteButton slug={item.slug} compact />
              </div>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <h2>No photographs match those filters.</h2>
          <button
            className="text-link"
            onClick={() => {
              setCategory("All");
              setOrientation("All");
              setColor("All");
              setLocation("All");
              setAvailable(false);
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1);
          touchStart.current = null;
        }}
      >
        {photo && (
          <>
            <button className="lightbox-close" type="button" onClick={close}>
              Close <span aria-hidden="true">×</span>
            </button>
            <button
              className="lightbox-arrow previous"
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous photograph"
            >
              ←
            </button>
            <div className="lightbox-content">
              <PlaceholderFrame
                label={photo.title}
                filename={photo.filename}
                ratio={
                  photo.orientation === "portrait"
                    ? "4 / 5"
                    : photo.orientation === "panoramic"
                      ? "2 / 1"
                      : photo.orientation === "square"
                        ? "1 / 1"
                        : "3 / 2"
                }
                variant={photo.variant}
                src={photo.displayUrl}
                alt={photo.altText}
                focalPointX={photo.focalPointX}
                focalPointY={photo.focalPointY}
                className={zoomed ? "lightbox-zoomed" : ""}
              />
              <div className="lightbox-meta">
                <div>
                  <p className="eyebrow">{photo.location}</p>
                  <h2>{photo.title}</h2>
                  <p>{photo.story}</p>
                </div>
                <div className="lightbox-actions">
                  <FavoriteButton slug={photo.slug} />
                  <ShareButton title={photo.title} path={`/prints/${photo.slug}`} />
                  <button
                    className="favorite-button"
                    type="button"
                    aria-pressed={zoomed}
                    onClick={() => setZoomed((value) => !value)}
                  >
                    {zoomed ? "Reset zoom" : "Zoom display image"}
                  </button>
                  <Link className="button button-light" href={`/prints/${photo.slug}`}>
                    View print options
                  </Link>
                </div>
              </div>
            </div>
            <button className="lightbox-arrow next" type="button" onClick={() => move(1)} aria-label="Next photograph">
              →
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
