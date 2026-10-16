export function AdminPage({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        {actions && <div className="admin-actions">{actions}</div>}
      </div>
      {children}
    </main>
  );
}
export function StatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
