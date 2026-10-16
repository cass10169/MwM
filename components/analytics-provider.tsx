"use client";

import { useEffect, useSyncExternalStore } from "react";

type AnalyticsDetail = { name: string; properties: Record<string, string | number | boolean> };
type AnalyticsWindow = Window & {
  plausible?: (name: string, options?: { props?: AnalyticsDetail["properties"] }) => void;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

type Consent = "granted" | "denied" | null;
const consentEvent = "mwm:analytics-consent";

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

function readConsent(): Consent {
  const value = localStorage.getItem("mwm-analytics-consent");
  return value === "granted" || value === "denied" ? value : null;
}

export function AnalyticsProvider() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => null);
  useEffect(() => {
    if (
      window.location.pathname.startsWith("/admin") ||
      provider === "none" ||
      (provider === "google" && consent !== "granted")
    )
      return;
    const script = document.createElement("script");
    script.async = true;
    const analyticsWindow = window as AnalyticsWindow;
    if (provider === "plausible") {
      const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
      if (!domain) return;
      script.src = "https://plausible.io/js/script.js";
      script.dataset.domain = domain;
      analyticsWindow.plausible =
        analyticsWindow.plausible ??
        ((name, options) => {
          (analyticsWindow.plausible as unknown as { q?: unknown[] }).q = [
            ...((analyticsWindow.plausible as unknown as { q?: unknown[] }).q ?? []),
            [name, options],
          ];
        });
    } else if (provider === "google") {
      const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
      if (!id) return;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
      analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.dataLayer?.push(args);
      analyticsWindow.gtag("js", new Date());
      analyticsWindow.gtag("config", id, { anonymize_ip: true });
    }
    document.head.appendChild(script);
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<AnalyticsDetail>).detail;
      if (provider === "plausible") analyticsWindow.plausible?.(detail.name, { props: detail.properties });
      else analyticsWindow.gtag?.("event", detail.name, detail.properties);
    };
    window.addEventListener("mwm:analytics", handler);
    const commercialClick = (event: MouseEvent) => {
      const link = (event.target as Element)?.closest?.("a");
      if (link?.getAttribute("href") === "/partners") handler(new CustomEvent("mwm:analytics", {detail:{name:"partner_cta",properties:{}}}));
    };
    document.addEventListener("click", commercialClick);
    if (window.location.pathname === "/media-kit") handler(new CustomEvent("mwm:analytics", {detail:{name:"media_kit_view",properties:{}}}));
    return () => {
      window.removeEventListener("mwm:analytics", handler);
      document.removeEventListener("click", commercialClick);
      script.remove();
    };
  }, [provider, consent]);
  if (
    provider !== "google" ||
    consent !== null ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"))
  )
    return null;
  const decide = (value: "granted" | "denied") => {
    localStorage.setItem("mwm-analytics-consent", value);
    window.dispatchEvent(new Event(consentEvent));
  };
  return (
    <aside className="consent-banner" aria-label="Analytics preferences">
      <p>Optional analytics help Michael understand which work visitors explore. No advertising profiles are used.</p>
      <div>
        <button onClick={() => decide("denied")}>Decline</button>
        <button className="button button-dark" onClick={() => decide("granted")}>
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
