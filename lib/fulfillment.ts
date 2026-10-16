export type FulfillmentOrder = {
  orderId: string;
  orderNumber: string;
  recipient: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postalCode: string;
    country: string;
  };
  items: Array<{ sku: string; title: string; quantity: number; options: Record<string, string> }>;
};
export type FulfillmentSubmission = {
  provider: "MANUAL" | "ORDER_DESK" | "BAY_PHOTO";
  providerOrderId: string | null;
  status: "READY" | "SUBMITTED";
};
export interface FulfillmentProvider {
  name: FulfillmentSubmission["provider"];
  submit(order: FulfillmentOrder): Promise<FulfillmentSubmission>;
}

export class ManualFulfillmentProvider implements FulfillmentProvider {
  name = "MANUAL" as const;
  async submit(order: FulfillmentOrder) {
    void order;
    return { provider: this.name, providerOrderId: null, status: "READY" as const };
  }
}
export class OrderDeskFulfillmentProvider implements FulfillmentProvider {
  name = "ORDER_DESK" as const;
  async submit(order: FulfillmentOrder): Promise<FulfillmentSubmission> {
    if (!process.env.ORDER_DESK_STORE_ID || !process.env.ORDER_DESK_API_KEY)
      throw new Error("Order Desk is not configured.");
    // Intentionally isolated until account-specific, documented endpoint details are supplied.
    console.info("Order Desk submission prepared", { orderNumber: order.orderNumber, itemCount: order.items.length });
    throw new Error("Order Desk adapter requires verified account documentation before production submission.");
  }
}
export class BayPhotoFulfillmentProvider implements FulfillmentProvider {
  name = "BAY_PHOTO" as const;
  async submit(order: FulfillmentOrder): Promise<FulfillmentSubmission> {
    if (!process.env.BAY_PHOTO_ACCOUNT_ID || !process.env.BAY_PHOTO_API_KEY)
      throw new Error("Bay Photo is not configured.");
    // Bay Photo production endpoints are not fabricated. Enable only from verified partner documentation.
    console.info("Bay Photo submission prepared", { orderNumber: order.orderNumber, itemCount: order.items.length });
    throw new Error("Bay Photo adapter requires verified partner documentation before production submission.");
  }
}

export function fulfillmentProvider(name: FulfillmentSubmission["provider"]): FulfillmentProvider {
  if (name === "ORDER_DESK") return new OrderDeskFulfillmentProvider();
  if (name === "BAY_PHOTO") return new BayPhotoFulfillmentProvider();
  return new ManualFulfillmentProvider();
}

export function ordersToCsv(rows: Array<Record<string, string | number | null>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = String(value ?? "");
    const safe = typeof value === "string" && /^[=+\-@]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\n");
}
