import { describe, expect, it } from "vitest";
import {
  applyDiscount,
  authorizeAdmin,
  calculateOrderTotal,
  canTransitionFulfillment,
  inventoryAvailable,
  slugify,
  validateImageMetadata,
  webhookDecision,
} from "@/lib/domain";

describe("domain rules", () => {
  it("creates clean human-readable slugs", () =>
    expect(slugify("  Painted Silence — Colorado! ")).toBe("painted-silence-colorado"));
  it("applies percentage and fixed discounts without exceeding subtotal", () => {
    expect(applyDiscount(18500, { type: "PERCENT", amount: 10 })).toBe(1850);
    expect(applyDiscount(18500, { type: "FIXED", amount: 30000 })).toBe(18500);
    expect(applyDiscount(18500, { type: "FIXED", amount: 1000, minimumSubtotalCents: 20000 })).toBe(0);
  });
  it("calculates order totals exclusively in integer minor units", () =>
    expect(
      calculateOrderTotal({ subtotalCents: 50000, discountCents: 5000, shippingCents: 2400, taxCents: 4200 }),
    ).toBe(51600));
  it("enforces inventory and limited-edition ceilings", () => {
    expect(inventoryAvailable({ active: true, inventory: 3, editionSize: 25, sold: 23, requested: 2 })).toBe(true);
    expect(inventoryAvailable({ active: true, inventory: 3, editionSize: 25, sold: 24, requested: 2 })).toBe(false);
    expect(inventoryAvailable({ active: false, inventory: null, editionSize: null, sold: 0, requested: 1 })).toBe(
      false,
    );
  });
  it("validates safe display image metadata", () => {
    expect(
      validateImageMetadata({
        mimeType: "image/webp",
        bytes: 2_000_000,
        width: 1800,
        height: 1200,
        focalPointX: 50,
        focalPointY: 40,
      }),
    ).toBe(true);
    expect(
      validateImageMetadata({
        mimeType: "image/svg+xml",
        bytes: 1000,
        width: 100,
        height: 100,
        focalPointX: 50,
        focalPointY: 50,
      }),
    ).toBe(false);
  });
  it("checks server-side administrator allowlists case-insensitively", () => {
    expect(authorizeAdmin("Michael.Kennedy@KU.edu", "admin@example.com, michael.kennedy@ku.edu")).toBe(true);
    expect(authorizeAdmin("visitor@example.com", "michael.kennedy@ku.edu")).toBe(false);
  });
  it("enforces fulfillment state transitions", () => {
    expect(canTransitionFulfillment("READY", "SUBMITTED")).toBe(true);
    expect(canTransitionFulfillment("READY", "DELIVERED")).toBe(false);
    expect(canTransitionFulfillment("DELIVERED", "SHIPPED")).toBe(false);
  });
  it("treats processed webhook events as duplicates and failed events as retryable", () => {
    expect(webhookDecision("PROCESSED")).toBe("duplicate");
    expect(webhookDecision("PROCESSING")).toBe("in_progress");
    expect(webhookDecision("FAILED")).toBe("process");
    expect(webhookDecision(null)).toBe("process");
  });
});
