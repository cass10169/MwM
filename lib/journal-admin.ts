import { z } from "zod";
import { database } from "./platform";
export const journalInput = z
  .object({
    title: z.string().trim().min(2).max(200),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    excerpt: z.string().trim().min(20).max(500),
    body: z.string().trim().min(40).max(100000),
    tags: z.array(z.string().trim().min(1).max(60)).max(20),
    readingTimeMinutes: z.coerce.number().int().min(1).max(120),
    status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
    scheduledAt: z.string().optional().default(""),
    seoTitle: z.string().max(160).optional().default(""),
    seoDescription: z.string().max(320).optional().default(""),
    relatedPhotographSlugs: z.array(z.string()).max(100),
    relatedCollectionSlugs: z.array(z.string()).max(100),
  })
  .superRefine((value, context) => {
    if (value.status === "SCHEDULED" && !value.scheduledAt)
      context.addIssue({ code: "custom", path: ["scheduledAt"], message: "Scheduled stories require a date." });
  });
export async function saveJournalPost(input: z.infer<typeof journalInput>, email: string, existingSlug?: string) {
  const db = database();
  const now = Date.now();
  const existing = existingSlug
    ? await db
        .prepare("SELECT id FROM journal_posts WHERE slug=? AND deleted_at IS NULL")
        .bind(existingSlug)
        .first<{ id: string }>()
    : null;
  if (existingSlug && !existing) throw new Error("Journal story not found.");
  const id = existing?.id ?? crypto.randomUUID();
  const scheduledAt = input.scheduledAt ? Date.parse(input.scheduledAt) : null;
  const publishedAt = input.status === "PUBLISHED" ? now : null;
  const values = [
    input.title,
    input.slug,
    input.excerpt,
    input.body,
    JSON.stringify(input.tags),
    JSON.stringify(input.relatedPhotographSlugs),
    JSON.stringify(input.relatedCollectionSlugs),
    input.readingTimeMinutes,
    input.status,
    scheduledAt,
    publishedAt,
    input.seoTitle || null,
    input.seoDescription || null,
  ];
  const statements: D1PreparedStatement[] = [];
  if (existing)
    statements.push(
      db
        .prepare(
          "UPDATE journal_posts SET title=?,slug=?,excerpt=?,body=?,tags_json=?,related_photograph_ids_json=?,related_collection_ids_json=?,reading_time_minutes=?,status=?,scheduled_at=?,published_at=COALESCE(?,published_at),seo_title=?,seo_description=?,updated_at=? WHERE id=?",
        )
        .bind(...values, now, id),
    );
  else
    statements.push(
      db
        .prepare(
          "INSERT INTO journal_posts (id,title,slug,excerpt,body,tags_json,related_photograph_ids_json,related_collection_ids_json,reading_time_minutes,status,scheduled_at,published_at,seo_title,seo_description,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(id, ...values, now, now),
    );
  statements.push(
    db
      .prepare(
        "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        null,
        existing ? "UPDATE" : "CREATE",
        "JOURNAL_POST",
        id,
        `Journal story ${existing ? "updated" : "created"} by ${email}`,
        JSON.stringify({ slug: input.slug, status: input.status }),
        now,
      ),
  );
  await db.batch(statements);
  return { id, slug: input.slug };
}
