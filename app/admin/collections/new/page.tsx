import { AdminPage } from "@/components/admin-page";
import { CollectionEditor } from "@/components/collection-editor";
import { getAdminPhotographs, getCollections } from "@/lib/catalog";
export default async function NewCollectionPage() {
  const [photographs, collections] = await Promise.all([getAdminPhotographs(), getCollections(true)]);
  return (
    <AdminPage eyebrow="Curation" title="Add collection">
      <CollectionEditor
        photographs={photographs.map(({ slug, title }) => ({ slug, title }))}
        collections={collections}
      />
    </AdminPage>
  );
}
