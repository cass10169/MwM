"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatMoney, type StoreProduct } from "@/lib/content";
import { useCart } from "./cart-provider";
import { trackEvent } from "@/lib/analytics";

export function ProductPurchase({ product }: { product: StoreProduct }) {
  const [material, setMaterial] = useState(product.materials[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const finishes = useMemo(
    () => [
      ...new Set(product.variants.map((variant) => variant.finish).filter((value): value is string => Boolean(value))),
    ],
    [product.variants],
  );
  const frames = useMemo(
    () => [
      ...new Set(product.variants.map((variant) => variant.frame).filter((value): value is string => Boolean(value))),
    ],
    [product.variants],
  );
  const [finish, setFinish] = useState(finishes[0] ?? "");
  const [frame, setFrame] = useState(frames[0] ?? "");
  const [status, setStatus] = useState("");
  const { addItem } = useCart();
  const variant = useMemo(
    () =>
      product.variants.find(
        (item) =>
          item.available &&
          item.material === material &&
          item.size === size &&
          (!finish || item.finish === finish) &&
          (!frame || item.frame === frame),
      ),
    [product.variants, material, size, finish, frame],
  );
  const price = variant ? (variant.salePriceCents ?? variant.priceCents) : product.startingPrice;
  if (!product.enabled)
    return (
      <div className="unavailable-panel">
        <p className="eyebrow ink">Print inquiries</p>
        <h2>Ask about this photograph</h2>
        <p>
          Contact Michael to discuss available sizes, materials, current pricing, or a custom presentation for your
          space.
        </p>
        <Link className="button button-dark" href={`/contact?service=print-consultation&print=${product.slug}`}>
          Request print details
        </Link>
      </div>
    );
  return (
    <div className="purchase-panel">
      <div className="price-line">
        <span>Configured price</span>
        <strong>{formatMoney(price)}</strong>
      </div>
      <fieldset>
        <legend>Material</legend>
        <div className="choice-grid">
          {product.materials.map((option) => (
            <label key={option} className={material === option ? "selected" : ""}>
              <input
                type="radio"
                name="material"
                value={option}
                checked={material === option}
                onChange={() => setMaterial(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Size</legend>
        <div className="choice-grid size-grid">
          {product.sizes.map((option) => (
            <label key={option} className={size === option ? "selected" : ""}>
              <input
                type="radio"
                name="size"
                value={option}
                checked={size === option}
                onChange={() => setSize(option)}
              />
              <span>{option} in</span>
            </label>
          ))}
        </div>
      </fieldset>
      {finishes.length > 0 && (
        <fieldset>
          <legend>Finish</legend>
          <div className="choice-grid">
            {finishes.map((option) => (
              <label key={option} className={finish === option ? "selected" : ""}>
                <input
                  type="radio"
                  name="finish"
                  value={option}
                  checked={finish === option}
                  onChange={() => setFinish(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {frames.length > 0 && (
        <fieldset>
          <legend>Frame</legend>
          <div className="choice-grid">
            {frames.map((option) => (
              <label key={option} className={frame === option ? "selected" : ""}>
                <input
                  type="radio"
                  name="frame"
                  value={option}
                  checked={frame === option}
                  onChange={() => setFrame(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="option-note">
        <strong>Made to order</strong>
        <span>
          {variant?.leadTimeMinDays !== undefined
            ? `Estimated production: ${variant.leadTimeMinDays}–${variant.leadTimeMaxDays ?? variant.leadTimeMinDays} days. Delivery options appear at checkout.`
            : "Production and delivery estimates appear at checkout."}
        </span>
      </div>
      <button
        className="button button-dark add-to-cart"
        type="button"
        disabled={!variant}
        onClick={() => {
          if (!variant) return;
          addItem({
            variantId: variant.id,
            slug: product.slug,
            title: product.title,
            material,
            size,
            finish: finish || undefined,
            frame: frame || undefined,
            price,
          });
          trackEvent("add_to_cart", { slug: product.slug, variantId: variant.id, valueCents: price });
          setStatus(`${product.title}, ${material}, ${size} added to cart.`);
        }}
      >
        {variant ? `Add to cart · ${formatMoney(price)}` : "This combination is unavailable"}
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
      <p className="purchase-footnote">
        Price is validated again on the server before payment. Framing and specialty finishes will become available
        after final lab configuration.
      </p>
    </div>
  );
}
