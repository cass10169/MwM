import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";

export const photographInput = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().min(1),
  location: z.string().max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  story: z.string().max(10000).optional(),
  altText: z.string().max(1000).optional(),
  capturedAt: z.string().optional(),
  camera: z.string().max(120).optional(),
  lens: z.string().max(160).optional(),
  focalLength: z.string().max(30).optional(),
  shutterSpeed: z.string().max(30).optional(),
  aperture: z.string().max(30).optional(),
  iso: z.coerce.number().int().positive().optional(),
  orientation: z.enum(["landscape", "portrait", "square", "panoramic"]),
  aspectRatio: z.string().max(20),
  dominantColor: z.string().max(40).optional(),
  focalPointX: z.coerce.number().int().min(0).max(100),
  focalPointY: z.coerce.number().int().min(0).max(100),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  featured: z.string().optional(),
  portfolioVisible: z.string().optional(),
  storeAvailable: z.string().optional(),
  seoVisible: z.string().optional(),
  showTechnicalMetadata: z.string().optional(),
});
export async function POST(request: Request) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = photographInput.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Review the photograph fields.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    const db = database();
    const value = parsed.data;
    const now = Date.now();
    const id = crypto.randomUUID();
    let category = await db
      .prepare("SELECT id FROM categories WHERE slug = ?")
      .bind(value.category.toLowerCase())
      .first<{ id: string }>();
    if (!category) {
      category = { id: crypto.randomUUID() };
      await db
        .prepare("INSERT INTO categories (id,name,slug,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?)")
        .bind(category.id, value.category, value.category.toLowerCase(), 0, now, now)
        .run();
    }
    await db.batch([
      db
        .prepare(
          "INSERT INTO photographs (id,category_id,title,slug,short_description,story,alt_text,location,captured_at,camera,lens,focal_length,shutter_speed,aperture,iso,orientation,aspect_ratio,dominant_color,focal_point_x,focal_point_y,featured,portfolio_visible,store_available,seo_visible,show_technical_metadata,status,scheduled_at,seo_title,seo_description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(
          id,
          category.id,
          value.title,
          value.slug,
          value.shortDescription ?? null,
          value.story ?? null,
          value.altText ?? null,
          value.location ?? null,
          value.capturedAt ? Date.parse(value.capturedAt) : null,
          value.camera ?? null,
          value.lens ?? null,
          value.focalLength ?? null,
          value.shutterSpeed ?? null,
          value.aperture ?? null,
          value.iso ?? null,
          value.orientation.toUpperCase(),
          value.aspectRatio,
          value.dominantColor ?? null,
          value.focalPointX,
          value.focalPointY,
          !!value.featured,
          !!value.portfolioVisible,
          !!value.storeAvailable,
          !!value.seoVisible,
          !!value.showTechnicalMetadata,
          value.status,
          value.scheduledAt ? Date.parse(value.scheduledAt) : null,
          value.seoTitle ?? null,
          value.seoDescription ?? null,
          now,
          now,
        ),
      db
        .prepare(
          "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
        )
        .bind(
          crypto.randomUUID(),
          null,
          "CREATE",
          "PHOTOGRAPH",
          id,
          `Photograph created by ${user.email}`,
          JSON.stringify({ slug: value.slug }),
          now,
        ),
    ]);
    return NextResponse.json({ id, slug: value.slug }, { status: 201 });
  } catch (error) {
    console.error("Photograph create failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "The photograph could not be saved." }, { status: 500 });
  }
}
