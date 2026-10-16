import { NextResponse } from "next/server";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
import { photographInput } from "../route";
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await params;
  const parsed = photographInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Review the photograph fields." }, { status: 400 });
  try {
    const db = database();
    const value = parsed.data;
    const existing = await db
      .prepare("SELECT id FROM photographs WHERE slug=? AND deleted_at IS NULL")
      .bind(slug)
      .first<{ id: string }>();
    if (!existing)
      return NextResponse.json(
        { error: "Photograph was not found in the production catalog. Import or create it first." },
        { status: 404 },
      );
    const now = Date.now();
    let category = await db
      .prepare("SELECT id FROM categories WHERE slug=?")
      .bind(value.category.toLowerCase())
      .first<{ id: string }>();
    if (!category) {
      category = { id: crypto.randomUUID() };
      await db
        .prepare("INSERT INTO categories (id,name,slug,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?)")
        .bind(category.id, value.category, value.category.toLowerCase(), 999, now, now)
        .run();
    }
    const statements = [
      db
        .prepare(
          "UPDATE photographs SET category_id=?,title=?,slug=?,short_description=?,story=?,alt_text=?,location=?,captured_at=?,camera=?,lens=?,focal_length=?,shutter_speed=?,aperture=?,iso=?,orientation=?,aspect_ratio=?,dominant_color=?,focal_point_x=?,focal_point_y=?,featured=?,portfolio_visible=?,store_available=?,seo_visible=?,show_technical_metadata=?,status=?,scheduled_at=?,published_at=CASE WHEN ?='PUBLISHED' THEN COALESCE(published_at,?) ELSE published_at END,seo_title=?,seo_description=?,updated_at=? WHERE id=?",
        )
        .bind(
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
          value.status,
          now,
          value.seoTitle ?? null,
          value.seoDescription ?? null,
          now,
          existing.id,
        ),
      db
        .prepare(
          "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
        )
        .bind(
          crypto.randomUUID(),
          null,
          "UPDATE",
          "PHOTOGRAPH",
          existing.id,
          `Photograph updated by ${user.email}`,
          JSON.stringify({ oldSlug: slug, newSlug: value.slug }),
          now,
        ),
    ];
    if (slug !== value.slug)
      statements.push(
        db
          .prepare(
            "INSERT INTO redirects (id,source_path,destination_path,permanent,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(source_path) DO UPDATE SET destination_path=excluded.destination_path,active=1,updated_at=excluded.updated_at",
          )
          .bind(crypto.randomUUID(), `/prints/${slug}`, `/prints/${value.slug}`, true, true, now, now),
      );
    await db.batch(statements);
    return NextResponse.json({ id: existing.id, slug: value.slug });
  } catch {
    return NextResponse.json({ error: "The photograph could not be updated." }, { status: 500 });
  }
}
