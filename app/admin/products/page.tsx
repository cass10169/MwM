import Link from "next/link";
import { AdminPage } from "@/components/admin-page";
import { formatMoney } from "@/lib/content";
import { getStoreProducts } from "@/lib/catalog";
export default async function AdminProductsPage() {
  const products = await getStoreProducts(true);
  return (
    <AdminPage
      eyebrow="Commerce"
      title="Print products"
      actions={
        <Link className="admin-primary" href="/admin/products/new">
          New product
        </Link>
      }
    >
      <div className="admin-table">
        <div className="admin-row product-admin-row admin-table-head">
          <span>Product</span>
          <span>Edition</span>
          <span>Starting price</span>
          <span>Variants</span>
          <span>Status</span>
          <span />
        </div>
        {products.map((product) => (
          <div className="admin-row product-admin-row" key={product.slug}>
            <strong>
              {product.title}
              <small>{product.variants[0]?.sku ?? `MWM-${product.slug.toUpperCase()}`}</small>
            </strong>
            <span>
              {product.editionType === "LIMITED"
                ? `Limited${product.editionSize ? ` / ${product.editionSize}` : ""}`
                : "Open"}
            </span>
            <span>{product.startingPrice ? formatMoney(product.startingPrice) : "—"}</span>
            <span>{product.variants.length}</span>
            <span>
              <i className={product.enabled ? "status-published" : "status-draft"} />
              {product.enabled ? "Active" : "Draft"}
            </span>
            <Link href={`/admin/products/${product.slug}`}>Edit →</Link>
          </div>
        ))}
      </div>
      <section className="admin-panel admin-note">
        <h2>Variant controls</h2>
        <p>
          Each product supports material, size, finish, frame, border, mat, SKU, integer-cent price, cost, weight,
          inventory, edition size, lead time, shipping class, and active state. Sample prices must be replaced before
          public sales.
        </p>
      </section>
    </AdminPage>
  );
}
