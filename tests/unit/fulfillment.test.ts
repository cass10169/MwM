import { describe, expect, it } from "vitest";
import { ManualFulfillmentProvider, ordersToCsv } from "@/lib/fulfillment";
describe("fulfillment adapters", () => {
  it("makes the manual provider immediately usable", async () => {
    const result = await new ManualFulfillmentProvider().submit({
      orderId: "1",
      orderNumber: "MWM-1",
      recipient: { name: "Customer", line1: "1 Main", city: "Lawrence", postalCode: "66044", country: "US" },
      items: [],
    });
    expect(result).toEqual({ provider: "MANUAL", providerOrderId: null, status: "READY" });
  });
  it("exports safe CSV including embedded quotes", () => {
    const csv = ordersToCsv([{ order: "MWM-1", note: 'A "quiet" print', unsafe: '=IMPORTDATA("x")' }]);
    expect(csv).toContain('"A ""quiet"" print"');
    expect(csv).toContain("'=IMPORTDATA");
  });
});
