import Link from "next/link";
import { AdminPage } from "@/components/admin-page";
import { OrderManager } from "@/components/order-manager";
import { database } from "@/lib/platform";
export const dynamic = "force-dynamic";
type OrderRow = {
  id: string;
  number: string;
  email: string;
  total_cents: number;
  status: string;
  fulfillment_status: string;
  created_at: number;
};
export default async function AdminOrdersPage() {
  let orders: OrderRow[] = [];
  try {
    orders = (
      await database()
        .prepare(
          "SELECT id,number,email,total_cents,status,fulfillment_status,created_at FROM orders WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 100",
        )
        .all<OrderRow>()
    ).results;
  } catch {}
  return (
    <AdminPage
      eyebrow="Commerce"
      title="Orders"
      actions={
        <Link className="admin-secondary" href="/api/admin/orders/export" prefetch={false}>
          Export CSV
        </Link>
      }
    >
      {orders.length ? (
        <div className="admin-order-list">
          <div className="admin-table">
            <div className="admin-row order-admin-row admin-table-head">
              <span>Order</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Payment</span>
              <span>Fulfillment</span>
            </div>
            {orders.map((order) => (
              <section className="admin-order" key={order.id}>
                <div className="admin-row order-admin-row">
                  <strong>
                    {order.number}
                    <small>{new Date(order.created_at).toLocaleDateString()}</small>
                  </strong>
                  <span>{order.email}</span>
                  <span>
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                      order.total_cents / 100,
                    )}
                  </span>
                  <span>{order.status}</span>
                  <span>{order.fulfillment_status}</span>
                </div>
                <OrderManager id={order.id} currentStatus={order.fulfillment_status} totalCents={order.total_cents} />
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="admin-empty admin-panel">
          <h2>No orders yet</h2>
          <p>Paid Stripe orders will appear here after signature-verified webhook processing.</p>
        </div>
      )}
      <section className="admin-panel admin-note">
        <h2>Manual fulfillment is ready</h2>
        <p>
          Order records support lab submission, provider order numbers, production status, tracking, refunds, internal
          notes, email updates, and CSV export. Order Desk and Bay Photo remain isolated until verified account
          documentation and credentials are provided.
        </p>
      </section>
    </AdminPage>
  );
}
