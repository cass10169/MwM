import { getCloudflareAccessUser, requireCloudflareAccessUser } from "@/app/cloudflare-access";
import { notFound } from "next/navigation";
import { database } from "./platform";
import { authorizeAdmin } from "./domain";
import { isSameOriginMutation } from "./security";

function allowed(email: string) {
  const configured = (
    process.env.ADMIN_EMAIL_ALLOWLIST ??
    process.env.ADMIN_BOOTSTRAP_EMAIL ??
    "michael.kennedy@ku.edu"
  )
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return authorizeAdmin(email, configured.join(","));
}
export async function requireAdminPage(returnTo: string) {
  const user = await requireCloudflareAccessUser(returnTo);
  if (!allowed(user.email)) notFound();
  try {
    const now = Date.now();
    await database()
      .prepare(
        "INSERT INTO users (id,email,name,role,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,active=1,updated_at=excluded.updated_at",
      )
      .bind(crypto.randomUUID(), user.email.toLowerCase(), user.fullName, "ADMIN", true, now, now)
      .run();
  } catch {
    // The first authenticated page can still render while a local database is being initialized.
  }
  return user;
}
export async function getAdminApiUser(request?: Request) {
  if (request && request.method !== "GET" && request.method !== "HEAD" && !isSameOriginMutation(request)) return null;
  const user = await getCloudflareAccessUser();
  return user && allowed(user.email) ? user : null;
}
