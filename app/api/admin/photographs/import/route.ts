import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { parseCsv } from "@/lib/csv";
import { database } from "@/lib/platform";
const rowSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(1).max(80),
  location: z.string().max(200).default(""),
  shortDescription: z.string().max(500).default(""),
  story: z.string().max(10000).default(""),
  altText: z.string().max(1000).default(""),
  orientation: z.enum(["landscape", "portrait", "square", "panoramic"]).default("landscape"),
  aspectRatio: z.string().max(20).default("3:2"),
  dominantColor: z.string().max(40).default("earth"),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.string().default("false"),
  portfolioVisible: z.string().default("false"),
  storeAvailable: z.string().default("false"),
  seoVisible: z.string().default("false"),
  sortOrder: z.coerce.number().int().default(0),
});
const truthy = (value: string) => ["1", "true", "yes", "y"].includes(value.trim().toLowerCase());
export async function POST(request: Request) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size < 1 || file.size > 2_000_000)
    return NextResponse.json({ error: "Choose a CSV file smaller than 2 MB." }, { status: 400 });
  const records = parseCsv(await file.text());
  if (!records.length || records.length > 500)
    return NextResponse.json({ error: "CSV must contain between 1 and 500 data rows." }, { status: 400 });
  const parsed = z.array(rowSchema).safeParse(records);
  if (!parsed.success)
    return NextResponse.json(
      {
        error: `CSV row ${String(parsed.error.issues[0]?.path[0] ?? "?")}: ${parsed.error.issues[0]?.message ?? "invalid data"}`,
      },
      { status: 400 },
    );
  const db = database();
  const now = Date.now();
  let imported = 0;
  for (const value of parsed.data) {
    let category = await db
      .prepare("SELECT id FROM categories WHERE lower(name)=lower(?) AND deleted_at IS NULL")
      .bind(value.category)
      .first<{ id: string }>();
    if (!category) {
      category = { id: crypto.randomUUID() };
      await db
        .prepare("INSERT INTO categories (id,name,slug,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?)")
        .bind(category.id, value.category, value.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"), 999, now, now)
        .run();
    }
    await db
      .prepare(
        `INSERT INTO photographs (id,category_id,title,slug,short_description,story,alt_text,location,orientation,aspect_ratio,dominant_color,focal_point_x,focal_point_y,featured,portfolio_visible,store_available,seo_visible,show_technical_metadata,sort_order,status,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET category_id=excluded.category_id,title=excluded.title,short_description=excluded.short_description,story=excluded.story,alt_text=excluded.alt_text,location=excluded.location,orientation=excluded.orientation,aspect_ratio=excluded.aspect_ratio,dominant_color=excluded.dominant_color,featured=excluded.featured,portfolio_visible=excluded.portfolio_visible,store_available=excluded.store_available,seo_visible=excluded.seo_visible,sort_order=excluded.sort_order,status=excluded.status,published_at=CASE WHEN excluded.status='PUBLISHED' THEN COALESCE(photographs.published_at,excluded.published_at) ELSE photographs.published_at END,updated_at=excluded.updated_at`,
      )
      .bind(
        crypto.randomUUID(),
        category.id,
        value.title,
        value.slug,
        value.shortDescription || null,
        value.story || null,
        value.altText || null,
        value.location || null,
        value.orientation.toUpperCase(),
        value.aspectRatio,
        value.dominantColor,
        50,
        50,
        truthy(value.featured),
        truthy(value.portfolioVisible),
        truthy(value.storeAvailable),
        truthy(value.seoVisible),
        false,
        value.sortOrder,
        value.status,
        value.status === "PUBLISHED" ? now : null,
        now,
        now,
      )
      .run();
    imported++;
  }
  await db
    .prepare(
      "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
    )
    .bind(
      crypto.randomUUID(),
      null,
      "IMPORT",
      "PHOTOGRAPH",
      null,
      `CSV imported by ${user.email}`,
      JSON.stringify({ imported }),
      now,
    )
    .run();
  return NextResponse.json({ imported });
}
