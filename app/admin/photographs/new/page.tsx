import { AdminPage } from "@/components/admin-page";
import { PhotographEditor } from "@/components/photograph-editor";
export default function NewPhotographPage() {
  return (
    <AdminPage eyebrow="Catalog" title="Add photograph">
      <PhotographEditor />
    </AdminPage>
  );
}
