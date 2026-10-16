import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin-page";
import { JournalEditor } from "@/components/journal-editor";
import { getAdminPhotographs, getCollections, getJournalPosts } from "@/lib/catalog";
export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [posts, photographs, collections] = await Promise.all([
    getJournalPosts(true),
    getAdminPhotographs(),
    getCollections(true),
  ]);
  const initial = posts.find((post) => post.slug === id);
  if (!initial) notFound();
  return (
    <AdminPage eyebrow="Storytelling" title={initial.title}>
      <JournalEditor
        initial={initial}
        photographs={photographs.map(({ slug, title }) => ({ slug, title }))}
        collections={collections}
      />
    </AdminPage>
  );
}
