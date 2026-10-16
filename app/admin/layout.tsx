import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminPage } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Studio Manager", robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage("/admin");
  return <AdminShell user={user}>{children}</AdminShell>;
}
