export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function applyDiscount(
  subtotalCents: number,
  discount: { type: "PERCENT" | "FIXED"; amount: number; minimumSubtotalCents?: number },
) {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) throw new Error("Invalid subtotal.");
  if (discount.minimumSubtotalCents && subtotalCents < discount.minimumSubtotalCents) return 0;
  const raw =
    discount.type === "PERCENT"
      ? Math.floor((subtotalCents * Math.min(100, Math.max(0, discount.amount))) / 100)
      : Math.max(0, discount.amount);
  return Math.min(subtotalCents, raw);
}
export function calculateOrderTotal(input: {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
}) {
  const values = Object.values(input);
  if (values.some((value) => !Number.isInteger(value) || value < 0))
    throw new Error("Order amounts must be nonnegative integer cents.");
  return Math.max(0, input.subtotalCents - input.discountCents) + input.shippingCents + input.taxCents;
}
export function inventoryAvailable(input: {
  active: boolean;
  inventory: number | null;
  editionSize: number | null;
  sold: number;
  requested: number;
}) {
  if (!input.active || !Number.isInteger(input.requested) || input.requested < 1) return false;
  if (input.inventory !== null && input.inventory < input.requested) return false;
  if (input.editionSize !== null && input.editionSize - input.sold < input.requested) return false;
  return true;
}
export function validateImageMetadata(input: {
  mimeType: string;
  bytes: number;
  width: number;
  height: number;
  focalPointX: number;
  focalPointY: number;
}) {
  const types = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  return (
    types.includes(input.mimeType) &&
    input.bytes > 0 &&
    input.bytes <= 20 * 1024 * 1024 &&
    input.width > 0 &&
    input.height > 0 &&
    input.focalPointX >= 0 &&
    input.focalPointX <= 100 &&
    input.focalPointY >= 0 &&
    input.focalPointY <= 100
  );
}
export const fulfillmentTransitions: Record<string, string[]> = {
  READY: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["IN_PRODUCTION", "CANCELLED"],
  IN_PRODUCTION: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};
export function canTransitionFulfillment(from: string, to: string) {
  return fulfillmentTransitions[from]?.includes(to) ?? false;
}
export function authorizeAdmin(email: string, allowlist: string) {
  return allowlist
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}
export function webhookDecision(status: "PROCESSING" | "PROCESSED" | "FAILED" | null) {
  return status === "PROCESSED" ? "duplicate" : status === "PROCESSING" ? "in_progress" : "process";
}
