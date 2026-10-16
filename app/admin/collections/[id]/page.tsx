import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin-page";
import { CollectionEditor } from "@/components/collection-editor";
import { getAdminPhotographs, getCollection, getCollections } from "@/lib/catalog";
export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [initial, photographs, collections] = await Promise.all([
    getCollection(id, true),
    getAdminPhotographs(),
    getCollections(true),
  ]);
  if (!initial) notFound();
  return (
    <AdminPage eyebrow="Curation" title={initial.title}>
      <CollectionEditor
        initial={initial}
        photographs={photographs.map(({ slug, title }) => ({ slug, title }))}
        collections={collections}
      />
    </AdminPage>
  );
}
