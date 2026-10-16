import { AdminPage } from "@/components/admin-page";
import { JournalEditor } from "@/components/journal-editor";
import { getAdminPhotographs, getCollections } from "@/lib/catalog";
export default async function NewJournalPage() {
  const [photographs, collections] = await Promise.all([getAdminPhotographs(), getCollections(true)]);
  return (
    <AdminPage eyebrow="Storytelling" title="Add journal story">
      <JournalEditor photographs={photographs.map(({ slug, title }) => ({ slug, title }))} collections={collections} />
    </AdminPage>
  );
}
