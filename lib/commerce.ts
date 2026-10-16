import { products, type StoreProduct } from "./content";
import { getStoreProduct } from "./catalog";
import { database } from "./platform";
import { inventoryAvailable } from "./domain";

export type CheckoutLineInput = {
  slug: string;
  variantId?: string;
  material: string;
  size: string;
  finish?: string;
  frame?: string;
  quantity: number;
};

export function resolveCheckoutLines(input: CheckoutLineInput[], catalog: StoreProduct[] = products) {
  if (!input.length) throw new Error("Cart is empty.");
  return input.map((line) => {
    const product = catalog.find((item) => item.slug === line.slug && item.enabled);
    if (!product) throw new Error("A product is unavailable.");
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 5)
      throw new Error("Quantity must be between 1 and 5.");
    const variant = product.variants.find(
      (item) =>
        item.available &&
        item.material === line.material &&
        item.size === line.size &&
        (!line.finish || item.finish === line.finish) &&
        (!line.frame || item.frame === line.frame),
    );
    if (!variant) throw new Error("A product option is invalid.");
    return {
      ...line,
      variantId: variant.id,
      title: product.title,
      unitAmount: variant.salePriceCents ?? variant.priceCents,
      sku: variant.sku,
    };
  });
}

export async function resolveCheckoutLinesForCheckout(input: CheckoutLineInput[]) {
  if (!input.length) throw new Error("Cart is empty.");
  return Promise.all(
    input.map(async (line) => {
      if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 5)
        throw new Error("Quantity must be between 1 and 5.");
      const product = await getStoreProduct(line.slug);
      if (!product?.enabled) throw new Error("A product is unavailable.");
      const variant = product.variants.find(
        (item) =>
          item.available &&
          (!line.variantId || item.id === line.variantId) &&
          item.material === line.material &&
          item.size === line.size &&
          (!line.finish || item.finish === line.finish) &&
          (!line.frame || item.frame === line.frame),
      );
      if (!variant) throw new Error("A product option is invalid.");
      if (variant.inventory !== undefined && variant.inventory < line.quantity)
        throw new Error("The requested quantity is unavailable.");
      try {
        const tracking = await database()
          .prepare(
            "SELECT v.inventory,p.edition_size,(SELECT COALESCE(SUM(oi.quantity),0) FROM order_items oi JOIN orders o ON o.id=oi.order_id JOIN product_variants sold_v ON sold_v.id=oi.variant_id WHERE sold_v.product_id=p.id AND o.status IN ('PAID','PARTIALLY_REFUNDED')) AS sold FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.id=?",
          )
          .bind(variant.id)
          .first<{ inventory: number | null; edition_size: number | null; sold: number }>();
        if (
          tracking &&
          !inventoryAvailable({
            active: variant.available,
            inventory: tracking.inventory,
            editionSize: tracking.edition_size,
            sold: tracking.sold,
            requested: line.quantity,
          })
        )
          throw new Error("The requested edition quantity is unavailable.");
      } catch (error) {
        if (error instanceof Error && error.message.includes("unavailable")) throw error;
      }
      return {
        ...line,
        variantId: variant.id,
        title: product.title,
        unitAmount: variant.salePriceCents ?? variant.priceCents,
        sku: variant.sku,
      };
    }),
  );
}

export function calculateSubtotal(lines: ReturnType<typeof resolveCheckoutLines>) {
  return lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
}
