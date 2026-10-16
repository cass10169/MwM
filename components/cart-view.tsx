"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/content";
import { useCart } from "./cart-provider";

export function CartView() {
  const { items, ready, removeItem, setQuantity } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!ready)
    return (
      <div className="empty-state cart-empty" aria-live="polite">
        <p>Loading your saved cart…</p>
      </div>
    );
  if (items.length === 0)
    return (
      <div className="empty-state cart-empty">
        <p className="eyebrow ink">Your collection</p>
        <h1>Your cart is waiting for a photograph.</h1>
        <p>Explore landscape and wildlife works, then configure a print for your space.</p>
        <Link className="button button-dark" href="/prints">
          Shop fine-art prints
        </Link>
      </div>
    );
  return (
    <div className="cart-layout">
      <section aria-labelledby="cart-heading">
        <h1 id="cart-heading">Your cart</h1>
        <p className="cart-count-line">
          {items.length} configured {items.length === 1 ? "print" : "prints"}
        </p>
        <div className="cart-lines">
          {items.map((item) => (
            <article className="cart-line" key={item.id}>
              <div className="cart-thumbnail" aria-hidden="true" />
              <div>
                <h2>{item.title}</h2>
                <p>{[item.material, `${item.size} in`, item.finish, item.frame].filter(Boolean).join(" · ")}</p>
                <label>
                  Quantity
                  <select value={item.quantity} onChange={(event) => setQuantity(item.id, Number(event.target.value))}>
                    {[1, 2, 3, 4, 5].map((number) => (
                      <option key={number}>{number}</option>
                    ))}
                  </select>
                </label>
                <button className="remove-button" type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
              <strong>{formatMoney(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>
      </section>
      <aside className="order-summary">
        <p className="eyebrow ink">Order summary</p>
        <div>
          <span>Subtotal</span>
          <strong>{formatMoney(subtotal)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div>
          <span>Estimated tax</span>
          <span>Calculated at checkout</span>
        </div>
        <p className="discount-note">Have a promotion code? Enter it in the secure Stripe checkout.</p>
        <div className="summary-total">
          <span>Estimated total</span>
          <strong>{formatMoney(subtotal)}</strong>
        </div>
        <Link className="button button-dark" href="/checkout">
          Continue to checkout
        </Link>
        <p>Secure checkout. Your price is recalculated from the product catalog before payment.</p>
      </aside>
    </div>
  );
}
