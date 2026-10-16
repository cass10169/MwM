"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="newsletter-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        const form = new FormData(event.currentTarget);
        try {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: form.get("email") }),
          });
          if (!response.ok) throw new Error();
          event.currentTarget.reset();
          trackEvent("newsletter_signup");
          setStatus("Thank you. Please check your inbox to confirm.");
        } catch {
          setStatus("Subscription could not be started. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Joining…" : "Join the list"} <span aria-hidden="true">→</span>
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
