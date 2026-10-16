export type AnalyticsEvent =
  | "print_view"
  | "favorite"
  | "add_to_cart"
  | "checkout"
  | "purchase"
  | "contact_inquiry"
  | "newsletter_signup";
type EventProperties = Record<string, string | number | boolean>;
export function trackEvent(name: AnalyticsEvent, properties: EventProperties = {}) {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) return;
  window.dispatchEvent(new CustomEvent("mwm:analytics", { detail: { name, properties } }));
}
