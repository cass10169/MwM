"use client";

import { useState } from "react";
import type { Photograph } from "@/lib/content";

export function PhotographEditor({ initial }: { initial?: Photograph }) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const assets = (["display", "thumbnail", "social", "product"] as const)
      .map((kind) => ({ kind, file: formData.get(`${kind}Asset`) }))
      .filter(
        (item): item is { kind: "display" | "thumbnail" | "social" | "product"; file: File } =>
          item.file instanceof File && item.file.size > 0,
      );
    for (const kind of ["display", "thumbnail", "social", "product"]) formData.delete(`${kind}Asset`);
    const data = Object.fromEntries(formData);
    const response = await fetch(initial ? `/api/admin/photographs/${initial.slug}` : "/api/admin/photographs", {
      method: initial ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    const body = (await response.json()) as { error?: string; id?: string };
    if (!response.ok) {
      setStatus(body.error ?? "The photograph could not be saved.");
      return;
    }
    for (const asset of assets) {
      if (!body.id) break;
      const upload = new FormData();
      upload.set("file", asset.file);
      upload.set("kind", asset.kind);
      const bitmap = await createImageBitmap(asset.file);
      upload.set("width", String(bitmap.width));
      upload.set("height", String(bitmap.height));
      bitmap.close();
      const uploadResponse = await fetch(`/api/admin/photographs/${body.id}/assets`, { method: "POST", body: upload });
      if (!uploadResponse.ok) {
        setStatus(`Metadata saved, but the ${asset.kind} asset could not be uploaded.`);
        return;
      }
    }
    setStatus(initial ? "Photograph updated." : "Draft photograph created. You can now upload display assets.");
  };
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="editor-main">
        <section className="admin-panel">
          <h2>Photograph details</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Title</span>
              <input name="title" defaultValue={initial?.title} required />
            </label>
            <label className="form-field">
              <span>Slug</span>
              <input name="slug" defaultValue={initial?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
            </label>
            <label className="form-field">
              <span>Category</span>
              <select name="category" defaultValue={initial?.category ?? "Landscapes"}>
                <option>Landscapes</option>
                <option>Wildlife</option>
                <option>Events</option>
                <option>Portraits</option>
                <option>Custom</option>
              </select>
            </label>
            <label className="form-field">
              <span>Location</span>
              <input name="location" defaultValue={initial?.location} />
            </label>
            <label className="form-field field-wide">
              <span>Short description</span>
              <textarea name="shortDescription" rows={3} defaultValue={initial?.shortDescription} />
            </label>
            <label className="form-field field-wide">
              <span>Story</span>
              <textarea name="story" rows={8} defaultValue={initial?.story} />
            </label>
            <label className="form-field field-wide">
              <span>Alternative text</span>
              <textarea
                name="altText"
                rows={3}
                defaultValue={initial?.altText}
                placeholder="Describe the actual photograph for someone who cannot see it"
              />
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <h2>Capture metadata</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Capture date</span>
              <input name="capturedAt" type="date" defaultValue={initial?.capturedAt} />
            </label>
            <label className="form-field">
              <span>Camera</span>
              <input name="camera" defaultValue={initial?.camera} />
            </label>
            <label className="form-field">
              <span>Lens</span>
              <input name="lens" defaultValue={initial?.lens} />
            </label>
            <label className="form-field">
              <span>Focal length</span>
              <input name="focalLength" defaultValue={initial?.focalLength} />
            </label>
            <label className="form-field">
              <span>Shutter speed</span>
              <input name="shutterSpeed" defaultValue={initial?.shutterSpeed} />
            </label>
            <label className="form-field">
              <span>Aperture</span>
              <input name="aperture" defaultValue={initial?.aperture} />
            </label>
            <label className="form-field">
              <span>ISO</span>
              <input name="iso" type="number" min="1" defaultValue={initial?.iso} />
            </label>
            <label className="form-field">
              <span>Orientation</span>
              <select name="orientation" defaultValue={initial?.orientation ?? "landscape"}>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="square">Square</option>
                <option value="panoramic">Panoramic</option>
              </select>
            </label>
            <label className="form-field">
              <span>Aspect ratio</span>
              <input name="aspectRatio" defaultValue={initial?.aspectRatio ?? "3:2"} />
            </label>
            <label className="form-field">
              <span>Dominant color</span>
              <input name="dominantColor" defaultValue={initial?.color} />
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <h2>Display assets</h2>
          <p>Upload only display derivatives. Original master files should remain outside the public delivery path.</p>
          <div className="asset-upload-grid">
            {(
              [
                ["displayAsset", "Display", "1800 × 1200 or larger"],
                ["thumbnailAsset", "Thumbnail", "800 × 800 or larger"],
                ["socialAsset", "Social share", "1200 × 630"],
                ["productAsset", "Product display", "2400 px long edge"],
              ] as const
            ).map(([name, label, dimensions]) => (
              <label className="upload-field" key={name}>
                <strong>{label}</strong>
                <input name={name} type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
                <span>{dimensions} · JPEG, PNG, WebP, or AVIF · maximum 20 MB</span>
              </label>
            ))}
          </div>
          <div className="focal-controls">
            <label>
              Horizontal focal point
              <input name="focalPointX" type="range" min="0" max="100" defaultValue={initial?.focalPointX ?? 50} />
            </label>
            <label>
              Vertical focal point
              <input name="focalPointY" type="range" min="0" max="100" defaultValue={initial?.focalPointY ?? 50} />
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <h2>Search and sharing</h2>
          <div className="form-grid">
            <label className="form-field field-wide">
              <span>SEO title</span>
              <input name="seoTitle" />
            </label>
            <label className="form-field field-wide">
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
              <option>SCHEDULED</option>
              <option>PUBLISHED</option>
              <option>ARCHIVED</option>
            </select>
          </label>
          <label className="form-field">
            <span>Schedule date</span>
            <input name="scheduledAt" type="datetime-local" />
          </label>
          <label className="admin-checkbox">
            <input name="featured" type="checkbox" defaultChecked={initial?.featured} /> Featured
          </label>
          <label className="admin-checkbox">
            <input name="portfolioVisible" type="checkbox" defaultChecked={initial?.portfolioVisible} /> Portfolio
            visible
          </label>
          <label className="admin-checkbox">
            <input name="storeAvailable" type="checkbox" defaultChecked={initial?.available} /> Available in store
          </label>
          <label className="admin-checkbox">
            <input name="seoVisible" type="checkbox" defaultChecked={initial?.seoVisible} /> Search-engine visible
          </label>
          <label className="admin-checkbox">
            <input name="showTechnicalMetadata" type="checkbox" defaultChecked={initial?.showTechnicalMetadata} /> Show
            technical metadata
          </label>
          <button className="admin-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save photograph"}
          </button>
          <p className="form-status" aria-live="polite">
            {status}
          </p>
        </section>
      </aside>
    </form>
  );
}
