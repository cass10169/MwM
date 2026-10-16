import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
const schema = z.object({
  slugs: z
    .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
    .min(1)
    .max(500),
  action: z.enum(["STATUS", "CATEGORY", "ARCHIVE"]),
  value: z.string().max(80).optional(),
});
export async function POST(request: Request) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid bulk update." }, { status: 400 });
  const db = database();
  const now = Date.now();
  const statements: D1PreparedStatement[] = [];
  if (parsed.data.action === "STATUS") {
    const status = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).safeParse(parsed.data.value);
    if (!status.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    for (const slug of parsed.data.slugs)
      statements.push(
        db
          .prepare(
            "UPDATE photographs SET status=?,published_at=CASE WHEN ?='PUBLISHED' THEN COALESCE(published_at,?) ELSE published_at END,updated_at=? WHERE slug=? AND deleted_at IS NULL",
          )
          .bind(status.data, status.data, now, now, slug),
      );
  } else if (parsed.data.action === "ARCHIVE") {
    for (const slug of parsed.data.slugs)
      statements.push(
        db
          .prepare(
            "UPDATE photographs SET status='ARCHIVED',portfolio_visible=0,store_available=0,seo_visible=0,updated_at=? WHERE slug=? AND deleted_at IS NULL",
          )
          .bind(now, slug),
      );
  } else {
    const name = parsed.data.value?.trim();
    if (!name) return NextResponse.json({ error: "Choose a category." }, { status: 400 });
    let category = await db
      .prepare("SELECT id FROM categories WHERE lower(name)=lower(?) AND deleted_at IS NULL")
      .bind(name)
      .first<{ id: string }>();
    if (!category) {
      category = { id: crypto.randomUUID() };
      statements.push(
        db
          .prepare("INSERT INTO categories (id,name,slug,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?)")
          .bind(category.id, name, name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), 999, now, now),
      );
    }
    for (const slug of parsed.data.slugs)
      statements.push(
        db
          .prepare("UPDATE photographs SET category_id=?,updated_at=? WHERE slug=? AND deleted_at IS NULL")
          .bind(category.id, now, slug),
      );
  }
  statements.push(
    db
      .prepare(
        "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        null,
        "BULK_UPDATE",
        "PHOTOGRAPH",
        null,
        `Bulk update by ${user.email}`,
        JSON.stringify(parsed.data),
        now,
      ),
  );
  await db.batch(statements);
  return NextResponse.json({ updated: parsed.data.slugs.length });
}
