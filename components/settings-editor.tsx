"use client";

import { useState } from "react";

type Settings = {
  brand: { businessName: string; photographer: string; contactEmail: string; location: string };
  homepage: {
    heroPhotographSlug: string;
    heroTitle: string;
    heroLocation: string;
    heroStatement: string;
    signatureStory: string;
    featuredCollectionSlug: string;
    showServices: boolean;
    showJournal: boolean;
    showNewsletter: boolean;
  };
  commerce: { checkoutEnabled: boolean; currency: string; fulfillmentProvider: string; maintenanceMode: boolean };
  navigation: {
    primary: Array<{ href: string; label: string } | string>;
    socialLinks: Array<{ href: string; label: string }>;
  };
  servicePricing: Record<"weddings" | "graduations" | "families" | "events" | "commissioned", string>;
};

export function SettingsEditor({ initial }: { initial: Settings }) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const links = (name: string) =>
      String(form.get(name) ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, href] = line.split("|").map((value) => value.trim());
          return { label, href };
        });
    const payload = {
      brand: {
        businessName: form.get("businessName"),
        photographer: form.get("photographer"),
        contactEmail: form.get("contactEmail"),
        location: form.get("location"),
      },
      homepage: {
        heroPhotographSlug: form.get("heroPhotographSlug"),
        heroTitle: form.get("heroTitle"),
        heroLocation: form.get("heroLocation"),
        heroStatement: form.get("heroStatement"),
        signatureStory: form.get("signatureStory"),
        featuredCollectionSlug: form.get("featuredCollectionSlug"),
        showServices: form.has("showServices"),
        showJournal: form.has("showJournal"),
        showNewsletter: form.has("showNewsletter"),
      },
      commerce: {
        checkoutEnabled: form.has("checkoutEnabled"),
        maintenanceMode: form.has("maintenanceMode"),
        currency: form.get("currency"),
        fulfillmentProvider: form.get("fulfillmentProvider"),
      },
      navigation: { primary: links("primaryNavigation"), socialLinks: links("socialLinks") },
      servicePricing: {
        weddings: form.get("priceWeddings"),
        graduations: form.get("priceGraduations"),
        families: form.get("priceFamilies"),
        events: form.get("priceEvents"),
        commissioned: form.get("priceCommissioned"),
      },
    };
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string };
    setSaving(false);
    setStatus(response.ok ? "Settings saved." : (body.error ?? "Settings could not be saved."));
  };
  return (
    <form onSubmit={submit}>
      <div className="settings-grid">
        <section className="admin-panel">
          <h2>Brand and contact</h2>
          <label className="form-field">
            <span>Business name</span>
            <input name="businessName" defaultValue={initial.brand.businessName} required />
          </label>
          <label className="form-field">
            <span>Photographer</span>
            <input name="photographer" defaultValue={initial.brand.photographer} required />
          </label>
          <label className="form-field">
            <span>Contact email</span>
            <input name="contactEmail" type="email" defaultValue={initial.brand.contactEmail} required />
          </label>
          <label className="form-field">
            <span>Location</span>
            <input name="location" defaultValue={initial.brand.location} required />
          </label>
        </section>
        <section className="admin-panel">
          <h2>Homepage</h2>
          <label className="form-field">
            <span>Hero photograph slug</span>
            <input name="heroPhotographSlug" defaultValue={initial.homepage.heroPhotographSlug} />
          </label>
          <label className="form-field">
            <span>Hero title</span>
            <input name="heroTitle" defaultValue={initial.homepage.heroTitle} />
          </label>
          <label className="form-field">
            <span>Hero location</span>
            <input name="heroLocation" defaultValue={initial.homepage.heroLocation} />
          </label>
          <label className="form-field">
            <span>Hero statement</span>
            <textarea name="heroStatement" rows={3} defaultValue={initial.homepage.heroStatement} />
          </label>
          <label className="form-field">
            <span>Signature story</span>
            <textarea name="signatureStory" rows={6} defaultValue={initial.homepage.signatureStory} />
          </label>
          <label className="form-field">
            <span>Featured collection slug</span>
            <input name="featuredCollectionSlug" defaultValue={initial.homepage.featuredCollectionSlug} />
          </label>
          <label className="admin-checkbox">
            <input name="showServices" type="checkbox" defaultChecked={initial.homepage.showServices} /> Show services
          </label>
          <label className="admin-checkbox">
            <input name="showJournal" type="checkbox" defaultChecked={initial.homepage.showJournal} /> Show journal
          </label>
          <label className="admin-checkbox">
            <input name="showNewsletter" type="checkbox" defaultChecked={initial.homepage.showNewsletter} /> Show
            newsletter
          </label>
        </section>
        <section className="admin-panel">
          <h2>Operations</h2>
          <label className="admin-checkbox">
            <input name="maintenanceMode" type="checkbox" defaultChecked={initial.commerce.maintenanceMode} />{" "}
            Maintenance mode
          </label>
          <label className="admin-checkbox">
            <input name="checkoutEnabled" type="checkbox" defaultChecked={initial.commerce.checkoutEnabled} /> Enable
            public checkout
          </label>
          <label className="form-field">
            <span>Currency</span>
            <select name="currency" defaultValue={initial.commerce.currency}>
              <option>USD</option>
            </select>
          </label>
          <label className="form-field">
            <span>Fulfillment provider</span>
            <select name="fulfillmentProvider" defaultValue={initial.commerce.fulfillmentProvider}>
              <option value="MANUAL">Manual</option>
              <option value="ORDER_DESK">Order Desk</option>
              <option value="BAY_PHOTO">Bay Photo</option>
            </select>
          </label>
          <p>
            Keep checkout disabled until photography, variants, pricing, policies, Stripe, email, and fulfillment
            settings are approved.
          </p>
        </section>
        <section className="admin-panel">
          <h2>Navigation and social links</h2>
          <label className="form-field">
            <span>Primary navigation — one Label | /path per line</span>
            <textarea
              name="primaryNavigation"
              rows={8}
              defaultValue={initial.navigation.primary
                .filter((item): item is { href: string; label: string } => typeof item === "object")
                .map((item) => `${item.label} | ${item.href}`)
                .join("\n")}
            />
          </label>
          <label className="form-field">
            <span>Social links — one Label | https://url per line</span>
            <textarea
              name="socialLinks"
              rows={6}
              defaultValue={initial.navigation.socialLinks.map((item) => `${item.label} | ${item.href}`).join("\n")}
            />
          </label>
          <p>Leave social links empty until the real profiles are confirmed.</p>
        </section>
        <section className="admin-panel">
          <h2>Optional service starting prices</h2>
          <p>
            Leave any field empty to show no public price. Enter approved display text such as “Starting at $…” only
            after scope and deliverables are defined.
          </p>
          {(
            [
              ["Weddings", "priceWeddings", "weddings"],
              ["Graduations", "priceGraduations", "graduations"],
              ["Families", "priceFamilies", "families"],
              ["Events", "priceEvents", "events"],
              ["Commercial or commissioned", "priceCommissioned", "commissioned"],
            ] as const
          ).map(([label, name, key]) => (
            <label className="form-field" key={key}>
              <span>{label}</span>
              <input name={name} defaultValue={initial.servicePricing[key]} maxLength={80} />
            </label>
          ))}
        </section>
      </div>
      <button className="admin-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
