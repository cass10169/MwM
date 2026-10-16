"use client";
import { useState } from "react";
export function OrderLookupForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="lookup-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const response = await fetch("/api/orders/lookup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(data),
        });
        setLoading(false);
        setStatus(
          response.ok
            ? "If the order and email match, a secure time-limited link is on its way."
            : "The lookup could not be started. Please try again.",
        );
      }}
    >
      <label className="form-field">
        <span>Order number</span>
        <input name="orderNumber" placeholder="MWM-…" required />
      </label>
      <label className="form-field">
        <span>Order email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button className="button button-dark" disabled={loading}>
        {loading ? "Sending…" : "Email secure order link"}
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
