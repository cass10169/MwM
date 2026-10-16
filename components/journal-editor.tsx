"use client";

import { useState } from "react";
import type { CatalogCollection, CatalogJournalPost } from "@/lib/catalog";

export function JournalEditor({
  photographs,
  collections,
  initial,
}: {
  photographs: Array<{ slug: string; title: string }>;
  collections: CatalogCollection[];
  initial?: CatalogJournalPost;
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
      excerpt: form.get("excerpt"),
      body: form.get("body"),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      readingTimeMinutes: form.get("readingTimeMinutes"),
      status: form.get("status"),
      scheduledAt: form.get("scheduledAt"),
      seoTitle: form.get("seoTitle"),
      seoDescription: form.get("seoDescription"),
      relatedPhotographSlugs: form.getAll("relatedPhotographSlugs"),
      relatedCollectionSlugs: form.getAll("relatedCollectionSlugs"),
    };
    const response = await fetch(initial ? `/api/admin/journal/${initial.slug}` : "/api/admin/journal", {
      method: initial ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string; slug?: string };
    setSaving(false);
    if (!response.ok) {
      setStatus(body.error ?? "Story could not be saved.");
      return;
    }
    setStatus("Journal story saved.");
    if (!initial && body.slug) window.history.replaceState(null, "", `/admin/journal/${body.slug}`);
  };
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="editor-main">
        <section className="admin-panel">
          <h2>Story</h2>
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
              <span>Excerpt</span>
              <textarea name="excerpt" rows={3} defaultValue={initial?.excerpt} required />
            </label>
            <label className="form-field field-wide">
              <span>Body (Markdown)</span>
              <textarea
                name="body"
                rows={22}
                defaultValue={initial?.body}
                placeholder={"Opening paragraph.\n\n## Section heading\n\nStory text.\n\n> Optional quotation."}
                required
              />
            </label>
            <label className="form-field">
              <span>Tags, comma separated</span>
              <input name="tags" defaultValue={initial?.tags?.join(", ")} />
            </label>
            <label className="form-field">
              <span>Reading time (minutes)</span>
              <input
                name="readingTimeMinutes"
                type="number"
                min="1"
                max="120"
                defaultValue={Number.parseInt(initial?.readingTime ?? "5", 10)}
              />
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <h2>Related content</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Photographs</span>
              <select
                className="admin-multiselect"
                name="relatedPhotographSlugs"
                multiple
                size={7}
                defaultValue={initial?.relatedPhotographSlugs}
              >
                {photographs.map((photo) => (
                  <option key={photo.slug} value={photo.slug}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Collections</span>
              <select
                className="admin-multiselect"
                name="relatedCollectionSlugs"
                multiple
                size={7}
                defaultValue={initial?.relatedCollectionSlugs}
              >
                {collections.map((collection) => (
                  <option key={collection.slug} value={collection.slug}>
                    {collection.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <h2>Search and social</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>SEO title</span>
              <input name="seoTitle" defaultValue={initial?.seoTitle} />
            </label>
            <label className="form-field">
              <span>SEO description</span>
              <textarea name="seoDescription" rows={3} defaultValue={initial?.seoDescription} />
            </label>
          </div>
          <p>Attach a cover image through the protected object-storage workflow after saving the draft.</p>
        </section>
      </div>
      <aside className="editor-side">
        <section className="admin-panel">
          <h2>Publishing</h2>
          <label className="form-field">
            <span>Status</span>
            <select name="status" defaultValue={initial?.status ?? "DRAFT"}>
              <option>DRAFT</option>
              <option>SCHEDULED</option>
              <option>PUBLISHED</option>
              <option>ARCHIVED</option>
            </select>
          </label>
          <label className="form-field">
            <span>Schedule date</span>
            <input name="scheduledAt" type="datetime-local" defaultValue={initial?.scheduledAt} />
          </label>
          <button className="admin-primary" disabled={saving}>
            {saving ? "Saving…" : "Save story"}
          </button>
          <p className="form-status" aria-live="polite">
            {status}
          </p>
        </section>
      </aside>
    </form>
  );
}
