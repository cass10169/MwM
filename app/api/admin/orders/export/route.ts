import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
import { ordersToCsv } from "@/lib/fulfillment";
export async function GET() {
  const user = await getAdminApiUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const rows = (
    await database()
      .prepare(
        "SELECT o.number,o.email,o.currency,o.status,o.fulfillment_status,o.subtotal_cents AS order_subtotal_cents,o.discount_cents AS order_discount_cents,o.shipping_cents,o.tax_cents AS order_tax_cents,o.total_cents AS order_total_cents,o.shipping_address_json,o.created_at,f.provider,f.provider_order_id,f.tracking_carrier,f.tracking_number,f.tracking_url,oi.product_name,oi.photograph_title,oi.sku,oi.variant_snapshot_json,oi.unit_price_cents,oi.quantity,oi.subtotal_cents AS line_subtotal_cents,oi.discount_cents AS line_discount_cents,oi.tax_cents AS line_tax_cents,oi.total_cents AS line_total_cents FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id LEFT JOIN fulfillments f ON f.order_id=o.id WHERE o.deleted_at IS NULL ORDER BY o.created_at DESC,oi.created_at ASC",
      )
      .all<Record<string, string | number | null>>()
  ).results;
  return new Response(ordersToCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="memories-with-mike-orders.csv"',
      "cache-control": "no-store",
    },
  });
}
