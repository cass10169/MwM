import Link from "next/link";
import { AdminPage } from "@/components/admin-page";
import { getCollections } from "@/lib/catalog";
export default async function AdminCollectionsPage() {
  const collections = await getCollections(true);
  return (
    <AdminPage
      eyebrow="Curation"
      title="Collections"
      actions={
        <Link className="admin-primary" href="/admin/collections/new">
          New collection
        </Link>
      }
    >
      <div className="admin-table">
        <div className="admin-row admin-table-head">
          <span>Collection</span>
          <span>Photographs</span>
          <span>Status</span>
          <span>Featured</span>
          <span />
        </div>
        {collections.map((collection) => (
          <div className="admin-row" key={collection.slug}>
            <strong>
              {collection.title}
              <small>{collection.subtitle}</small>
            </strong>
            <span>{collection.photographSlugs.length}</span>
            <span>
              <i className={collection.status === "PUBLISHED" ? "status-published" : "status-draft"} />
              {collection.status ?? "Sample"}
            </span>
            <span>{collection.featured === false ? "No" : "Yes"}</span>
            <Link href={`/admin/collections/${collection.slug}`}>Edit →</Link>
          </div>
        ))}
      </div>
      <section className="admin-panel admin-note">
        <h2>Nested collections and ordering</h2>
        <p>
          The data model supports parent collections, cover photographs, custom ordering, drafts, SEO fields, and
          archival status. Final photography can be reordered without changing source code.
        </p>
      </section>
    </AdminPage>
  );
}
