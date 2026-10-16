import Link from "next/link";
import { AdminPage, StatCard } from "@/components/admin-page";
import { getAdminPhotographs, getJournalPosts, getStoreProducts } from "@/lib/catalog";
import { database } from "@/lib/platform";
export default async function AdminDashboardPage() {
  const [photographs, products, journalPosts] = await Promise.all([
    getAdminPhotographs(),
    getStoreProducts(true),
    getJournalPosts(true),
  ]);
  let revenueCents = 0;
  let recentInquiries = 0;
  let activity: Array<{ id: string; summary: string; created_at: number }> = [];
  try {
    const [revenue, inquiries, audit] = await Promise.all([
      database()
        .prepare(
          "SELECT COALESCE(SUM(total_cents),0) AS total FROM orders WHERE status IN ('PAID','PARTIALLY_REFUNDED') AND deleted_at IS NULL",
        )
        .first<{ total: number }>(),
      database()
        .prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status='NEW' AND deleted_at IS NULL")
        .first<{ count: number }>(),
      database()
        .prepare("SELECT id,summary,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 5")
        .all<{ id: string; summary: string; created_at: number }>(),
    ]);
    revenueCents = revenue?.total ?? 0;
    recentInquiries = inquiries?.count ?? 0;
    activity = audit.results;
  } catch {}
  return (
    <AdminPage
      eyebrow="Studio manager"
      title="Overview"
      actions={
        <Link className="admin-primary" href="/admin/photographs/new">
          Add photograph
        </Link>
      }
    >
      <section className="admin-stats">
        <StatCard
          label="Published photographs"
          value={photographs.filter((photo) => photo.status === "PUBLISHED").length}
          detail="Published and managed in the production catalog"
        />
        <StatCard
          label="Active print listings"
          value={products.filter((product) => product.enabled).length}
          detail="Listings with at least one active variant"
        />
        <StatCard
          label="Revenue"
          value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(revenueCents / 100)}
          detail="Paid order totals before external fees and costs"
        />
        <StatCard
          label="New inquiries"
          value={recentInquiries}
          detail={`${journalPosts.filter((post) => !post.published).length} journal drafts awaiting review`}
        />
      </section>
      <div className="admin-two-column">
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Launch readiness</h2>
            <span>Required</span>
          </div>
          <ul className="readiness-list">
            <li>
              <span>Photography assets</span>
              <strong>Awaiting final files</strong>
            </li>
            <li>
              <span>Stripe</span>
              <strong>Credentials required</strong>
            </li>
            <li>
              <span>Print pricing</span>
              <strong>Business decision required</strong>
            </li>
            <li>
              <span>Fulfillment lab</span>
              <strong>Manual mode ready</strong>
            </li>
            <li>
              <span>Legal policies</span>
              <strong>Review required</strong>
            </li>
          </ul>
        </section>
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Recent activity</h2>
            <Link href="/admin/orders">View orders</Link>
          </div>
          {activity.length ? (
            <ul className="activity-list">
              {activity.map((item) => (
                <li key={item.id}>
                  <span>{item.summary}</span>
                  <time>{new Date(item.created_at).toLocaleDateString()}</time>
                </li>
              ))}
            </ul>
          ) : (
            <div className="admin-empty">
              <p>No production activity yet.</p>
              <span>Orders, inquiries, uploads, and publishing changes will appear here with audit history.</span>
            </div>
          )}
        </section>
      </div>
      <section className="admin-panel">
        <div className="panel-heading">
          <h2>Popular photographs</h2>
          <span>Analytics begin after launch</span>
        </div>
        <div className="admin-table">
          <div className="admin-row admin-table-head">
            <span>Photograph</span>
            <span>Views</span>
            <span>Favorites</span>
            <span>Cart adds</span>
          </div>
          {photographs.slice(0, 4).map((photo) => (
            <div className="admin-row" key={photo.slug}>
              <strong>
                {photo.title}
                <small>{photo.location}</small>
              </strong>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
