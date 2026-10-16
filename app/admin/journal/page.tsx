import Link from "next/link";
import { AdminPage } from "@/components/admin-page";
import { getJournalPosts } from "@/lib/catalog";
export default async function AdminJournalPage() {
  const journalPosts = await getJournalPosts(true);
  return (
    <AdminPage
      eyebrow="Storytelling"
      title="Journal"
      actions={
        <Link className="admin-primary" href="/admin/journal/new">
          New story
        </Link>
      }
    >
      <div className="admin-table">
        <div className="admin-row admin-table-head">
          <span>Story</span>
          <span>Category</span>
          <span>Reading time</span>
          <span>Status</span>
          <span />
        </div>
        {journalPosts.map((post) => (
          <div className="admin-row" key={post.slug}>
            <strong>
              {post.title}
              <small>{post.excerpt}</small>
            </strong>
            <span>{post.category}</span>
            <span>{post.readingTime}</span>
            <span>
              <i className={post.published ? "status-published" : "status-draft"} />
              {post.status ?? "DRAFT"}
            </span>
            <Link href={`/admin/journal/${post.slug}`}>Edit →</Link>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
