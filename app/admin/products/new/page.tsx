import { AdminPage } from "@/components/admin-page";
import { ProductEditor } from "@/components/product-editor";
import { getAdminPhotographs } from "@/lib/catalog";
export default async function NewProductPage() {
  const photographs = await getAdminPhotographs();
  return (
    <AdminPage eyebrow="Commerce" title="Add print product">
      <ProductEditor photographs={photographs.map(({ slug, title }) => ({ slug, title }))} />
    </AdminPage>
  );
}
