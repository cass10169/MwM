import Link from "next/link";
import { cloudflareAccessSignOutPath } from "@/app/cloudflare-access";
import type { CloudflareAccessUser } from "@/app/cloudflare-access";

const links = [
  ["/admin", "Overview"],
  ["/admin/photographs", "Photographs"],
  ["/admin/collections", "Collections"],
  ["/admin/products", "Products"],
  ["/admin/orders", "Orders"],
  ["/admin/inquiries", "Inquiries"],
  ["/admin/journal", "Journal"],
  ["/admin/settings", "Settings"],
];
export function AdminShell({ user, children }: { user: CloudflareAccessUser; children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin">
          <span>Memories</span>
          <small>with Mike · Studio</small>
        </Link>
        <nav aria-label="Administration">
          {links.map(([href, label]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-user">
          <strong>{user.displayName}</strong>
          <span>{user.email}</span>
          <Link href={cloudflareAccessSignOutPath()}>Sign out</Link>
        </div>
      </aside>
      <div className="admin-main">
        <header>
          <Link href="/" target="_blank">
            View storefront ↗
          </Link>
          <span>Secure studio manager</span>
        </header>
        {children}
      </div>
    </div>
  );
}
