export type AnalyticsEvent =
  | "partner_cta"
  | "media_kit_view"
  | "print_inquiry_started"
  | "print_inquiry_submitted"
  | "licensing_inquiry_submitted"
  | "photography_inquiry_submitted"
  | "partnership_inquiry_submitted"
  | "expedition_inquiry_submitted"
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
