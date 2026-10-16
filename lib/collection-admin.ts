import { z } from "zod";
import { database } from "./platform";

export const collectionInput = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  subtitle: z.string().max(240).optional().default(""),
  description: z.string().max(10000).optional().default(""),
  parentSlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  coverPhotographSlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  photographSlugs: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(500),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sortOrder: z.coerce.number().int().min(-10000).max(10000),
  seoTitle: z.string().max(160).optional().default(""),
  seoDescription: z.string().max(320).optional().default(""),
});
export async function saveCollection(input: z.infer<typeof collectionInput>, email: string, existingSlug?: string) {
  const db = database();
  const now = Date.now();
  const existing = existingSlug
    ? await db
        .prepare("SELECT id FROM collections WHERE slug=? AND deleted_at IS NULL")
        .bind(existingSlug)
        .first<{ id: string }>()
    : null;
  if (existingSlug && !existing) throw new Error("Collection not found.");
  const id = existing?.id ?? crypto.randomUUID();
  const parent = input.parentSlug
    ? await db
        .prepare("SELECT id FROM collections WHERE slug=? AND deleted_at IS NULL")
        .bind(input.parentSlug)
        .first<{ id: string }>()
    : null;
  const cover = input.coverPhotographSlug
    ? await db
        .prepare("SELECT id FROM photographs WHERE slug=? AND deleted_at IS NULL")
        .bind(input.coverPhotographSlug)
        .first<{ id: string }>()
    : null;
  const statements: D1PreparedStatement[] = [];
  if (existing)
    statements.push(
      db
        .prepare(
          "UPDATE collections SET parent_id=?,title=?,slug=?,subtitle=?,description=?,cover_photograph_id=?,featured=?,status=?,sort_order=?,seo_title=?,seo_description=?,updated_at=? WHERE id=?",
        )
        .bind(
          parent?.id ?? null,
          input.title,
          input.slug,
          input.subtitle || null,
          input.description || null,
          cover?.id ?? null,
          input.featured,
          input.status,
          input.sortOrder,
          input.seoTitle || null,
          input.seoDescription || null,
          now,
          id,
        ),
    );
  else
    statements.push(
      db
        .prepare(
          "INSERT INTO collections (id,parent_id,title,slug,subtitle,description,cover_photograph_id,featured,status,sort_order,seo_title,seo_description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(
          id,
          parent?.id ?? null,
          input.title,
          input.slug,
          input.subtitle || null,
          input.description || null,
          cover?.id ?? null,
          input.featured,
          input.status,
          input.sortOrder,
          input.seoTitle || null,
          input.seoDescription || null,
          now,
          now,
        ),
    );
  statements.push(db.prepare("DELETE FROM collection_photographs WHERE collection_id=?").bind(id));
  let order = 0;
  for (const slug of input.photographSlugs) {
    const photo = await db
      .prepare("SELECT id FROM photographs WHERE slug=? AND deleted_at IS NULL")
      .bind(slug)
      .first<{ id: string }>();
    if (photo)
      statements.push(
        db
          .prepare(
            "INSERT INTO collection_photographs (collection_id,photograph_id,sort_order,created_at) VALUES (?,?,?,?)",
          )
          .bind(id, photo.id, order++, now),
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
        existing ? "UPDATE" : "CREATE",
        "COLLECTION",
        id,
        `Collection ${existing ? "updated" : "created"} by ${email}`,
        JSON.stringify({ slug: input.slug, photographCount: input.photographSlugs.length }),
        now,
      ),
  );
  await db.batch(statements);
  return { id, slug: input.slug };
}
