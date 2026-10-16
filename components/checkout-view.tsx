"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/content";
import { useCart } from "./cart-provider";
import { trackEvent } from "@/lib/analytics";

export function CheckoutView() {
  const { items, ready } = useCart();
  const [giftNote, setGiftNote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!ready)
    return (
      <div className="empty-state cart-empty" aria-live="polite">
        <p>Loading your saved cart…</p>
      </div>
    );
  if (!items.length)
    return (
      <div className="empty-state cart-empty">
        <h1>Your cart is empty.</h1>
        <p>Add a configured print before continuing to checkout.</p>
        <Link className="button button-dark" href="/prints">
          Browse prints
        </Link>
      </div>
    );
  const begin = async () => {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ variantId, slug, material, size, finish, frame, quantity }) => ({
            variantId,
            slug,
            material,
            size,
            finish,
            frame,
            quantity,
          })),
          giftNote,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Checkout could not be started.");
      trackEvent("checkout", { itemCount: items.length, valueCents: subtotal });
      window.location.assign(data.url);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Checkout could not be started.");
      setLoading(false);
    }
  };
  return (
    <div className="checkout-layout">
      <section>
        <p className="eyebrow ink">Secure checkout</p>
        <h1>Complete your print order</h1>
        <p>
          You will continue to Stripe to enter shipping and payment information. The site sends only product identifiers
          and selections; the server recalculates every price.
        </p>
        <label className="form-field">
          <span>Gift note (optional)</span>
          <textarea
            value={giftNote}
            maxLength={300}
            rows={5}
            onChange={(event) => setGiftNote(event.target.value)}
            placeholder="A short note to include with the order"
          />
        </label>
        <button className="button button-dark" type="button" disabled={loading} onClick={begin}>
          {loading ? "Opening secure checkout…" : "Continue to secure payment"}
        </button>
        <p className="form-status" aria-live="polite">
          {status}
        </p>
      </section>
      <aside className="order-summary">
        <p className="eyebrow ink">Order summary</p>
        {items.map((item) => (
          <div key={item.id}>
            <span>
              {item.title}
              <small>
                {[item.material, `${item.size} in`, item.finish, item.frame, `Qty ${item.quantity}`]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            </span>
            <strong>{formatMoney(item.price * item.quantity)}</strong>
          </div>
        ))}
        <div className="summary-total">
          <span>Subtotal</span>
          <strong>{formatMoney(subtotal)}</strong>
        </div>
        <p>Shipping and tax are calculated securely during checkout.</p>
      </aside>
    </div>
  );
}
