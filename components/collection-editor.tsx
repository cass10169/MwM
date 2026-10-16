"use client";

import { useState } from "react";
import type { CatalogCollection } from "@/lib/catalog";

export function CollectionEditor({
  photographs,
  collections,
  initial,
}: {
  photographs: Array<{ slug: string; title: string }>;
  collections: CatalogCollection[];
  initial?: CatalogCollection;
}) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      subtitle: form.get("subtitle"),
      description: form.get("description"),
      parentSlug: form.get("parentSlug") || undefined,
      coverPhotographSlug: form.get("coverPhotographSlug") || undefined,
      photographSlugs: form.getAll("photographSlugs"),
      featured: form.has("featured"),
      status: form.get("status"),
      sortOrder: form.get("sortOrder"),
      seoTitle: form.get("seoTitle"),
      seoDescription: form.get("seoDescription"),
    };
    const response = await fetch(initial ? `/api/admin/collections/${initial.slug}` : "/api/admin/collections", {
      method: initial ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string; slug?: string };
    setSaving(false);
    if (!response.ok) {
      setStatus(body.error ?? "Collection could not be saved.");
      return;
    }
    setStatus("Collection saved.");
    if (!initial && body.slug) window.history.replaceState(null, "", `/admin/collections/${body.slug}`);
  };
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="editor-main">
        <section className="admin-panel">
          <h2>Collection details</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Title</span>
              <input name="title" defaultValue={initial?.title} required />
            </label>
            <label className="form-field">
              <span>Slug</span>
              <input name="slug" defaultValue={initial?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
            </label>
            <label className="form-field field-wide">
              <span>Subtitle</span>
              <input name="subtitle" defaultValue={initial?.subtitle} />
            </label>
            <label className="form-field field-wide">
              <span>Description</span>
              <textarea name="description" rows={6} defaultValue={initial?.description} />
            </label>
            <label className="form-field">
              <span>Parent collection</span>
              <select name="parentSlug">
                <option value="">None</option>
                {collections
                  .filter((collection) => collection.slug !== initial?.slug)
                  .map((collection) => (
                    <option key={collection.slug} value={collection.slug}>
                      {collection.title}
                    </option>
                  ))}
              </select>
            </label>
            <label className="form-field">
              <span>Cover photograph</span>
              <select name="coverPhotographSlug">
                <option value="">Automatic</option>
                {photographs.map((photo) => (
                  <option key={photo.slug} value={photo.slug}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Sort order</span>
              <input name="sortOrder" type="number" defaultValue="0" />
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <h2>Photographs</h2>
          <p>Select multiple works in the desired collection. Ordering follows the catalog sort order.</p>
          <select
            className="admin-multiselect"
            name="photographSlugs"
            multiple
            size={Math.min(12, Math.max(5, photographs.length))}
            defaultValue={initial?.photographSlugs}
          >
            {photographs.map((photo) => (
              <option key={photo.slug} value={photo.slug}>
                {photo.title}
              </option>
            ))}
          </select>
        </section>
        <section className="admin-panel">
          <h2>Search</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>SEO title</span>
              <input name="seoTitle" />
            </label>
            <label className="form-field">
              <span>SEO description</span>
              <textarea name="seoDescription" rows={3} />
            </label>
          </div>
        </section>
      </div>
      <aside className="editor-side">
        <section className="admin-panel">
          <h2>Publishing</h2>
          <label className="form-field">
            <span>Status</span>
            <select name="status" defaultValue={initial?.status ?? "DRAFT"}>
              <option>DRAFT</option>
              <option>PUBLISHED</option>
              <option>ARCHIVED</option>
            </select>
          </label>
          <label className="admin-checkbox">
            <input name="featured" type="checkbox" defaultChecked={initial?.featured} /> Featured collection
          </label>
          <button className="admin-primary" disabled={saving}>
            {saving ? "Saving…" : "Save collection"}
          </button>
          <p className="form-status" aria-live="polite">
            {status}
          </p>
        </section>
      </aside>
    </form>
  );
}
