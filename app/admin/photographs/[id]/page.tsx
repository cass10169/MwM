import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin-page";
import { PhotographEditor } from "@/components/photograph-editor";
import { getPhotograph } from "@/lib/catalog";
export default async function EditPhotographPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await getPhotograph(id, true);
  if (!photo) notFound();
  return (
    <AdminPage eyebrow="Catalog" title={photo.title}>
      <PhotographEditor initial={photo} />
    </AdminPage>
  );
}
