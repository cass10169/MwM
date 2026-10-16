import { notFound, permanentRedirect, redirect } from "next/navigation";
import { database } from "@/lib/platform";

export const dynamic = "force-dynamic";
export default async function ManagedRedirectPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const source = `/${path.join("/")}`;
  let row: { destination_path: string; permanent: number } | null = null;
  try {
    row =
      (await database()
        .prepare("SELECT destination_path,permanent FROM redirects WHERE source_path=? AND active=1")
        .bind(source)
        .first<{ destination_path: string; permanent: number }>()) ?? null;
  } catch {}
  if (row) {
    if (row.permanent) permanentRedirect(row.destination_path);
    redirect(row.destination_path);
  }
  notFound();
}
