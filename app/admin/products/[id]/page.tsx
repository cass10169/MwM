import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin-page";
import { ProductEditor } from "@/components/product-editor";
import { getAdminPhotographs, getStoreProduct } from "@/lib/catalog";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, photographs] = await Promise.all([getStoreProduct(id, true), getAdminPhotographs()]);
  if (!product) notFound();
  return (
    <AdminPage eyebrow="Commerce" title={product.title}>
      <ProductEditor initial={product} photographs={photographs.map(({ slug, title }) => ({ slug, title }))} />
    </AdminPage>
  );
}
