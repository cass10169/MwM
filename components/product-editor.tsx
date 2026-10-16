"use client";

import { useState } from "react";
import type { StoreProduct } from "@/lib/content";

type VariantDraft = {
  id: string;
  material: string;
  size: string;
  finish: string;
  frame: string;
  border: string;
  mat: string;
  sku: string;
  price: string;
  salePrice: string;
  cost: string;
  inventory: string;
  weightOunces: string;
  leadTimeMinDays: string;
  leadTimeMaxDays: string;
  shippingClass: string;
  active: boolean;
};
const blankVariant = (index: number): VariantDraft => ({
  id: crypto.randomUUID(),
  material: "Archival paper",
  size: "12 × 18",
  finish: "",
  frame: "",
  border: "",
  mat: "",
  sku: `MWM-NEW-${index + 1}`,
  price: "185.00",
  salePrice: "",
  cost: "",
  inventory: "",
  weightOunces: "",
  leadTimeMinDays: "7",
  leadTimeMaxDays: "14",
  shippingClass: "standard-print",
  active: false,
});

export function ProductEditor({
  photographs,
  initial,
}: {
  photographs: Array<{ slug: string; title: string }>;
  initial?: StoreProduct;
}) {
  const [variants, setVariants] = useState<VariantDraft[]>(() =>
    initial?.variants.length
      ? initial.variants.map((variant) => ({
          id: variant.id,
          material: variant.material,
          size: variant.size,
          finish: variant.finish ?? "",
          frame: variant.frame ?? "",
          border: variant.border ?? "",
          mat: variant.mat ?? "",
          sku: variant.sku,
          price: (variant.priceCents / 100).toFixed(2),
          salePrice: variant.salePriceCents === undefined ? "" : (variant.salePriceCents / 100).toFixed(2),
          cost: "",
          inventory: "",
          weightOunces: "",
          leadTimeMinDays: "7",
          leadTimeMaxDays: "14",
          shippingClass: "standard-print",
          active: variant.available,
        }))
      : [blankVariant(0)],
  );
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (id: string, field: keyof VariantDraft, value: string | boolean) =>
    setVariants((current) => current.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = {
      photographSlug: form.get("photographSlug"),
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      editionType: form.get("editionType"),
      editionSize: form.get("editionSize"),
      status: form.get("status"),
      featured: form.has("featured"),
      variants: variants.map(({ id, ...variant }) => {
        void id;
        return variant;
      }),
    };
    const response = await fetch(initial ? `/api/admin/products/${initial.slug}` : "/api/admin/products", {
      method: initial ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string; slug?: string };
    setSaving(false);
    if (!response.ok) {
      setStatus(body.error ?? "Product could not be saved.");
      return;
    }
    setStatus("Product and variants saved. Activate checkout only after final review.");
    if (!initial && body.slug) window.history.replaceState(null, "", `/admin/products/${body.slug}`);
  };
  const seedName = initial?.title ? `${initial.title} Fine-Art Print` : "";
  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="editor-main">
        <section className="admin-panel">
          <h2>Product details</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Photograph</span>
              <select name="photographSlug" defaultValue={initial?.photographSlug} required>
                <option value="">Choose a photograph</option>
                {photographs.map((photo) => (
                  <option key={photo.slug} value={photo.slug}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Product name</span>
              <input name="name" defaultValue={seedName} placeholder="Painted Silence Fine-Art Print" required />
            </label>
            <label className="form-field">
              <span>Slug</span>
              <input name="slug" defaultValue={initial?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
            </label>
            <label className="form-field">
              <span>Edition</span>
              <select name="editionType" defaultValue={initial?.editionType ?? "OPEN"}>
                <option value="OPEN">Open edition</option>
                <option value="LIMITED">Limited edition</option>
              </select>
            </label>
            <label className="form-field">
              <span>Edition size (limited only)</span>
              <input name="editionSize" type="number" min="1" defaultValue={initial?.editionSize} />
            </label>
            <label className="form-field field-wide">
              <span>Description</span>
              <textarea name="description" rows={6} defaultValue={initial?.description} />
            </label>
          </div>
        </section>
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>Variants</h2>
              <p>Money is entered in USD and converted to integer cents on the server.</p>
            </div>
            <button type="button" onClick={() => setVariants((current) => [...current, blankVariant(current.length)])}>
              Add variant
            </button>
          </div>
          <div className="variant-editor-list">
            {variants.map((variant, index) => (
              <fieldset className="variant-editor" key={variant.id}>
                <legend>Variant {index + 1}</legend>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Material</span>
                    <select
                      value={variant.material}
                      onChange={(event) => update(variant.id, "material", event.target.value)}
                    >
                      {["Archival paper", "Metal", "Acrylic", "Canvas"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label className="form-field">
                    <span>Size</span>
                    <select value={variant.size} onChange={(event) => update(variant.id, "size", event.target.value)}>
                      {["12 × 18", "16 × 24", "20 × 30", "24 × 36", "24 × 12", "36 × 18", "48 × 24"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label className="form-field">
                    <span>Finish</span>
                    <input
                      value={variant.finish}
                      onChange={(event) => update(variant.id, "finish", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Frame</span>
                    <input
                      value={variant.frame}
                      onChange={(event) => update(variant.id, "frame", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Border</span>
                    <input
                      value={variant.border}
                      onChange={(event) => update(variant.id, "border", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Mat</span>
                    <input value={variant.mat} onChange={(event) => update(variant.id, "mat", event.target.value)} />
                  </label>
                  <label className="form-field">
                    <span>SKU</span>
                    <input
                      value={variant.sku}
                      onChange={(event) => update(variant.id, "sku", event.target.value)}
                      required
                    />
                  </label>
                  <label className="form-field">
                    <span>Price (USD)</span>
                    <input
                      inputMode="decimal"
                      value={variant.price}
                      onChange={(event) => update(variant.id, "price", event.target.value)}
                      required
                    />
                  </label>
                  <label className="form-field">
                    <span>Sale price</span>
                    <input
                      inputMode="decimal"
                      value={variant.salePrice}
                      onChange={(event) => update(variant.id, "salePrice", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Cost</span>
                    <input
                      inputMode="decimal"
                      value={variant.cost}
                      onChange={(event) => update(variant.id, "cost", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Inventory (blank = unlimited)</span>
                    <input
                      type="number"
                      min="0"
                      value={variant.inventory}
                      onChange={(event) => update(variant.id, "inventory", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Weight (oz)</span>
                    <input
                      type="number"
                      min="0"
                      value={variant.weightOunces}
                      onChange={(event) => update(variant.id, "weightOunces", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Lead time, min days</span>
                    <input
                      type="number"
                      min="0"
                      value={variant.leadTimeMinDays}
                      onChange={(event) => update(variant.id, "leadTimeMinDays", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Lead time, max days</span>
                    <input
                      type="number"
                      min="0"
                      value={variant.leadTimeMaxDays}
                      onChange={(event) => update(variant.id, "leadTimeMaxDays", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Shipping class</span>
                    <input
                      value={variant.shippingClass}
                      onChange={(event) => update(variant.id, "shippingClass", event.target.value)}
                    />
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={variant.active}
                      onChange={(event) => update(variant.id, "active", event.target.checked)}
                    />{" "}
                    Active
                  </label>
                </div>
                {variants.length > 1 && (
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => setVariants((current) => current.filter((item) => item.id !== variant.id))}
                  >
                    Remove variant
                  </button>
                )}
              </fieldset>
            ))}
          </div>
        </section>
      </div>
      <aside className="editor-side">
        <section className="admin-panel">
          <h2>Publishing</h2>
          <label className="form-field">
            <span>Status</span>
            <select name="status" defaultValue={initial?.enabled ? "ACTIVE" : "DRAFT"}>
              <option>DRAFT</option>
              <option>ACTIVE</option>
              <option>SOLD_OUT</option>
              <option>ARCHIVED</option>
            </select>
          </label>
          <label className="admin-checkbox">
            <input name="featured" type="checkbox" defaultChecked={initial?.featured} /> Featured product
          </label>
          <button className="admin-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save product"}
          </button>
          <p className="form-status" aria-live="polite">
            {status}
          </p>
        </section>
      </aside>
    </form>
  );
}
