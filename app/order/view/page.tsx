import type { Metadata } from "next";
import { database, sha256 } from "@/lib/platform";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Details", robots: { index: false, follow: false } };
export default async function OrderViewPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  type OrderView = {
    id: string;
    number: string;
    status: string;
    fulfillment_status: string;
    currency: string;
    total_cents: number;
    created_at: number;
  };
  type ItemView = {
    product_name: string;
    sku: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
    variant_snapshot_json: string;
  };
  const { token } = await searchParams;
  let order: OrderView | null = null;
  let items: ItemView[] = [];
  let fulfillment: {
    tracking_carrier: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
  } | null = null;
  if (token) {
    try {
      order = await database()
        .prepare(
          "SELECT id,number,status,fulfillment_status,currency,total_cents,created_at FROM orders WHERE lookup_token_hash=? AND lookup_expires_at > (unixepoch() * 1000) AND deleted_at IS NULL",
        )
        .bind(await sha256(token))
        .first<OrderView>();
      if (order) {
        items = (
          await database()
            .prepare(
              "SELECT product_name,sku,quantity,unit_price_cents,total_cents,variant_snapshot_json FROM order_items WHERE order_id=? ORDER BY created_at",
            )
            .bind(order.id)
            .all<ItemView>()
        ).results;
        fulfillment = await database()
          .prepare(
            "SELECT tracking_carrier,tracking_number,tracking_url FROM fulfillments WHERE order_id=? ORDER BY created_at DESC LIMIT 1",
          )
          .bind(order.id)
          .first();
      }
    } catch {}
  }
  const money = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: order?.currency ?? "USD" }).format(cents / 100);
  return (
    <main id="main-content" className="section section-ivory">
      <div className="container-narrow">
        {order ? (
          <>
            <p className="eyebrow ink">Secure order view</p>
            <h1 className="display-title">{order.number}</h1>
            <dl className="order-view">
              <div>
                <dt>Ordered</dt>
                <dd>{new Date(order.created_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{order.status}</dd>
              </div>
              <div>
                <dt>Fulfillment</dt>
                <dd>{order.fulfillment_status}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{money(order.total_cents)}</dd>
              </div>
            </dl>
            <section className="secure-order-items">
              <h2>Order items</h2>
              {items.map((item) => {
                let options = "";
                try {
                  const snapshot = JSON.parse(item.variant_snapshot_json) as { description?: string };
                  options = snapshot.description ?? "";
                } catch {}
                return (
                  <article key={item.sku}>
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>{options || item.sku}</span>
                      <small>Quantity {item.quantity}</small>
                    </div>
                    <span>{money(item.total_cents)}</span>
                  </article>
                );
              })}
            </section>
            {fulfillment?.tracking_number && (
              <section className="tracking-panel">
                <h2>Tracking</h2>
                <p>{[fulfillment.tracking_carrier, fulfillment.tracking_number].filter(Boolean).join(" · ")}</p>
                {fulfillment.tracking_url && (
                  <a className="text-link" href={fulfillment.tracking_url} rel="noopener noreferrer" target="_blank">
                    View carrier tracking ↗
                  </a>
                )}
              </section>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h1>This order link is invalid or has expired.</h1>
            <p>Request a new secure link from the order lookup page.</p>
          </div>
        )}
      </div>
    </main>
  );
}
