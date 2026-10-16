import { describe, expect, it } from "vitest";
import { calculateSubtotal, resolveCheckoutLines } from "@/lib/commerce";
import { formatMoney } from "@/lib/content";

const catalog = [
  {
    slug: "gallery-test",
    photographSlug: "gallery-test",
    title: "Gallery Test",
    enabled: true,
    featured: false,
    startingPrice: 49500,
    materials: ["Metal"],
    sizes: ["20 × 30"],
    variants: [
      {
        id: "gallery-test-metal-20x30",
        sku: "GALLERY_TEST-MET-20X30",
        material: "Metal",
        size: "20 × 30",
        priceCents: 49500,
        available: true,
      },
    ],
  },
];

describe("commerce validation", () => {
  it("resolves a product variant from server-owned catalog pricing", () => {
    const [line] = resolveCheckoutLines(
      [{ slug: "gallery-test", material: "Metal", size: "20 × 30", quantity: 2 }],
      catalog,
    );
    expect(line.title).toBe("Gallery Test");
    expect(line.unitAmount).toBe(49500);
    expect(line.sku).toContain("GALLERY_TEST");
    expect(calculateSubtotal([line])).toBe(99000);
  });
  it("rejects forged product selections and unavailable products", () => {
    expect(() =>
      resolveCheckoutLines([{ slug: "gallery-test", material: "Diamond", size: "20 × 30", quantity: 1 }], catalog),
    ).toThrow("option");
    expect(() =>
      resolveCheckoutLines([{ slug: "painted-silence", material: "Metal", size: "20 × 30", quantity: 1 }], catalog),
    ).toThrow("unavailable");
  });
  it("rejects unsafe quantities and empty carts", () => {
    expect(() => resolveCheckoutLines([])).toThrow("empty");
    expect(() =>
      resolveCheckoutLines([{ slug: "gallery-test", material: "Metal", size: "20 × 30", quantity: 99 }], catalog),
    ).toThrow("Quantity");
  });
  it("formats USD from integer cents", () => expect(formatMoney(18500)).toBe("$185"));
});
