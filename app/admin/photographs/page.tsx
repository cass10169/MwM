import Link from "next/link";
import { AdminPage } from "@/components/admin-page";
import { getAdminPhotographs } from "@/lib/catalog";
import { PhotographAdminTable } from "@/components/photograph-admin-table";
import { PhotographImport } from "@/components/photograph-import";

export default async function AdminPhotographsPage() {
  const photographs = await getAdminPhotographs();
  return (
    <AdminPage
      eyebrow="Catalog"
      title="Photographs"
      actions={
        <>
          <Link className="admin-secondary" href="/api/admin/photographs/export">
            Export CSV
          </Link>
          <Link className="admin-primary" href="/admin/photographs/new">
            Add photograph
          </Link>
        </>
      }
    >
      <PhotographAdminTable photographs={photographs} />
      <PhotographImport />
    </AdminPage>
  );
}
