"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Photograph } from "@/lib/content";
export function PhotographAdminTable({ photographs }: { photographs: Photograph[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const visible = useMemo(
    () =>
      photographs.filter(
        (photo) =>
          (!query || `${photo.title} ${photo.location} ${photo.slug}`.toLowerCase().includes(query.toLowerCase())) &&
          (!status || (photo.status ?? "PUBLISHED") === status),
      ),
    [photographs, query, status],
  );
  const bulk = async (action: "STATUS" | "CATEGORY" | "ARCHIVE", value?: string) => {
    const response = await fetch("/api/admin/photographs/bulk", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slugs: selected, action, value }),
    });
    const body = (await response.json()) as { error?: string };
    setMessage(response.ok ? "Bulk update saved." : (body.error ?? "Bulk update failed."));
    if (response.ok) window.location.reload();
  };
  return (
    <>
      <div className="admin-filterbar">
        <label>
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, location, or slug"
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option>DRAFT</option>
            <option>SCHEDULED</option>
            <option>PUBLISHED</option>
            <option>ARCHIVED</option>
          </select>
        </label>
      </div>
      <div className="admin-table">
        <div className="admin-row photo-admin-row admin-table-head">
          <span>Select</span>
          <span>Photograph</span>
          <span>Category</span>
          <span>Status</span>
          <span>Store</span>
          <span>Order</span>
          <span />
        </div>
        {visible.map((photo, index) => (
          <div className="admin-row photo-admin-row" key={photo.slug}>
            <span>
              <input
                type="checkbox"
                aria-label={`Select ${photo.title}`}
                checked={selected.includes(photo.slug)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked ? [...current, photo.slug] : current.filter((slug) => slug !== photo.slug),
                  )
                }
              />
            </span>
            <strong>
              {photo.title}
              <small>{photo.location}</small>
            </strong>
            <span>{photo.category}</span>
            <span>
              <i className={photo.status === "PUBLISHED" ? "status-published" : "status-draft"} />
              {photo.status ?? "PUBLISHED"}
            </span>
            <span>{photo.available ? "Available" : "Unavailable"}</span>
            <span>{index + 1}</span>
            <Link href={`/admin/photographs/${photo.slug}`}>Edit →</Link>
          </div>
        ))}
      </div>
      <div className="bulk-bar">
        <span>{selected.length} selected</span>
        <button disabled={!selected.length} onClick={() => void bulk("STATUS", "PUBLISHED")}>
          Publish
        </button>
        <button disabled={!selected.length} onClick={() => void bulk("STATUS", "DRAFT")}>
          Move to draft
        </button>
        <button disabled={!selected.length} onClick={() => void bulk("CATEGORY", "Landscapes")}>
          Set landscapes
        </button>
        <button disabled={!selected.length} onClick={() => void bulk("ARCHIVE")}>
          Archive
        </button>
      </div>
      <p className="form-status" aria-live="polite">
        {message}
      </p>
    </>
  );
}
