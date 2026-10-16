import { AdminPage } from "@/components/admin-page";
import { database } from "@/lib/platform";
export const dynamic = "force-dynamic";
type InquiryRow = {
  id: string;
  name: string;
  email: string;
  service_type: string;
  location: string;
  company: string | null;
  company_website: string | null;
  partnership_type: string | null;
  project_timing: string | null;
  message: string;
  status: string;
  created_at: number;
};
export default async function AdminInquiriesPage() {
  let rows: InquiryRow[] = [];
  try {
    rows = (
      await database()
        .prepare(
          "SELECT id,name,email,service_type,location,status,created_at,company,company_website,partnership_type,project_timing,message FROM inquiries WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 100",
        )
        .all<InquiryRow>()
    ).results;
  } catch {}
  return (
    <AdminPage eyebrow="Client work" title="Inquiries">
      {rows.length ? (
        <div className="admin-table">
          <div className="admin-row inquiry-admin-row admin-table-head">
            <span>Name</span>
            <span>Service</span>
            <span>Location</span>
            <span>Received</span>
            <span>Status</span>
          </div>
          {rows.map((row) => (
            <div className="admin-row inquiry-admin-row" key={row.id}>
              <strong>
                {row.name}
                <small>{row.email}</small>
              </strong>
              <span>{row.service_type}{row.company && <small>{row.company}</small>}{row.partnership_type && <small>{row.partnership_type}</small>}{row.company_website && /^https?:\/\//i.test(row.company_website) && <small><a href={row.company_website} target="_blank" rel="noopener noreferrer">Company website ↗</a></small>}<details><summary>Read inquiry</summary><p style={{whiteSpace:"pre-wrap"}}>{row.message}</p>{row.project_timing && <p>Timing: {row.project_timing}</p>}</details></span>
              <span>{row.location}</span>
              <span>{new Date(row.created_at).toLocaleDateString()}</span>
              <span>{row.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty admin-panel">
          <h2>No inquiries yet</h2>
          <p>Validated contact inquiries will appear here, with rate limiting and consent timestamps recorded.</p>
        </div>
      )}
    </AdminPage>
  );
}
