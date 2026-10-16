import { z } from "zod";
import { database } from "./platform";
import { slugify } from "./domain";

const money = z
  .string()
  .trim()
  .regex(/^\d{1,7}(?:\.\d{1,2})?$/);
const optionalMoney = z
  .union([money, z.literal("")])
  .optional()
  .default("");
const optionalInteger = z
  .union([z.string().regex(/^\d+$/), z.literal("")])
  .optional()
  .default("");
export const productInput = z
  .object({
    photographSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(2).max(180),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().max(10000).optional().default(""),
    editionType: z.enum(["OPEN", "LIMITED"]),
    editionSize: optionalInteger,
    status: z.enum(["DRAFT", "ACTIVE", "SOLD_OUT", "ARCHIVED"]),
    featured: z.boolean(),
    variants: z
      .array(
        z.object({
          material: z.string().trim().min(1).max(100),
          size: z.string().trim().min(1).max(40),
          finish: z.string().trim().max(100),
          frame: z.string().trim().max(100),
          border: z.string().trim().max(100),
          mat: z.string().trim().max(100),
          sku: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .regex(/^[A-Za-z0-9._-]+$/),
          price: money,
          salePrice: optionalMoney,
          cost: optionalMoney,
          inventory: optionalInteger,
          weightOunces: optionalInteger,
          leadTimeMinDays: optionalInteger,
          leadTimeMaxDays: optionalInteger,
          shippingClass: z.string().trim().max(100),
          active: z.boolean(),
        }),
      )
      .min(1)
      .max(200),
  })
  .superRefine((value, context) => {
    if (value.editionType === "LIMITED" && !value.editionSize)
      context.addIssue({ code: "custom", path: ["editionSize"], message: "Limited editions require an edition size." });
    if (new Set(value.variants.map((variant) => variant.sku.toLowerCase())).size !== value.variants.length)
      context.addIssue({ code: "custom", path: ["variants"], message: "Variant SKUs must be unique." });
  });

function cents(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
function integer(value: string) {
  return value ? Number(value) : null;
}
function ratio(width: number, height: number) {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

async function referenceId(kind: "material" | "size" | "finish" | "frame", name: string, now: number) {
  const db = database();
  if (kind === "material") {
    const row = await db
      .prepare("SELECT id FROM materials WHERE lower(name)=lower(?) AND deleted_at IS NULL")
      .bind(name)
      .first<{ id: string }>();
    if (row) return row.id;
    const id = crypto.randomUUID();
    await db
      .prepare("INSERT INTO materials (id,name,slug,active,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?,?)")
      .bind(id, name, slugify(name), true, 999, now, now)
      .run();
    return id;
  }
  if (kind === "size") {
    const row = await db.prepare("SELECT id FROM sizes WHERE label=?").bind(name).first<{ id: string }>();
    if (row) return row.id;
    const match = name.match(/^(\d+)\s*[×x]\s*(\d+)$/);
    if (!match) throw new Error(`Invalid size: ${name}`);
    const width = Math.max(Number(match[1]), Number(match[2]));
    const height = Math.min(Number(match[1]), Number(match[2]));
    const id = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO sizes (id,label,width_inches,height_inches,aspect_ratio,active,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
      )
      .bind(id, name, width, height, ratio(width, height), true, 999, now, now)
      .run();
    return id;
  }
  const table = kind === "finish" ? "finishes" : "frames";
  const row = await db.prepare(`SELECT id FROM ${table} WHERE lower(name)=lower(?)`).bind(name).first<{ id: string }>();
  if (row) return row.id;
  const id = crypto.randomUUID();
  await db
    .prepare(`INSERT INTO ${table} (id,name,slug,active,created_at,updated_at) VALUES (?,?,?,?,?,?)`)
    .bind(id, name, slugify(name), true, now, now)
    .run();
  return id;
}

export async function saveProduct(
  input: z.infer<typeof productInput>,
  administratorEmail: string,
  existingSlug?: string,
) {
  const db = database();
  const now = Date.now();
  const photo = await db
    .prepare("SELECT id FROM photographs WHERE slug=? AND deleted_at IS NULL")
    .bind(input.photographSlug)
    .first<{ id: string }>();
  if (!photo) throw new Error("Choose a photograph that exists in the production catalog.");
  const existing = existingSlug
    ? await db
        .prepare("SELECT id FROM products WHERE slug=? AND deleted_at IS NULL")
        .bind(existingSlug)
        .first<{ id: string }>()
    : null;
  if (existingSlug && !existing) throw new Error("Product not found.");
  const productId = existing?.id ?? crypto.randomUUID();
  const statements: D1PreparedStatement[] = [];
  if (existing)
    statements.push(
      db
        .prepare(
          "UPDATE products SET photograph_id=?,name=?,slug=?,description=?,edition_type=?,edition_size=?,status=?,featured=?,updated_at=? WHERE id=?",
        )
        .bind(
          photo.id,
          input.name,
          input.slug,
          input.description || null,
          input.editionType,
          integer(input.editionSize),
          input.status,
          input.featured,
          now,
          productId,
        ),
    );
  else
    statements.push(
      db
        .prepare(
          "INSERT INTO products (id,photograph_id,name,slug,description,edition_type,edition_size,status,featured,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(
          productId,
          photo.id,
          input.name,
          input.slug,
          input.description || null,
          input.editionType,
          integer(input.editionSize),
          input.status,
          input.featured,
          now,
          now,
        ),
    );
  if (existing)
    statements.push(
      db.prepare("UPDATE product_variants SET active=0,updated_at=? WHERE product_id=?").bind(now, productId),
    );
  for (const variant of input.variants) {
    const skuOwner = await db
      .prepare("SELECT product_id FROM product_variants WHERE lower(sku)=lower(?) AND deleted_at IS NULL")
      .bind(variant.sku)
      .first<{ product_id: string }>();
    if (skuOwner && skuOwner.product_id !== productId)
      throw new Error(`SKU ${variant.sku} belongs to another product.`);
    const materialId = await referenceId("material", variant.material, now);
    const sizeId = await referenceId("size", variant.size, now);
    const finishId = variant.finish ? await referenceId("finish", variant.finish, now) : null;
    const frameId = variant.frame ? await referenceId("frame", variant.frame, now) : null;
    statements.push(
      db
        .prepare(
          `INSERT INTO product_variants (id,product_id,material_id,size_id,finish_id,frame_id,sku,currency,price_cents,sale_price_cents,cost_cents,weight_ounces,inventory,lead_time_min_days,lead_time_max_days,shipping_class,border,mat,active,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(sku) DO UPDATE SET material_id=excluded.material_id,size_id=excluded.size_id,finish_id=excluded.finish_id,frame_id=excluded.frame_id,price_cents=excluded.price_cents,sale_price_cents=excluded.sale_price_cents,cost_cents=excluded.cost_cents,weight_ounces=excluded.weight_ounces,inventory=excluded.inventory,lead_time_min_days=excluded.lead_time_min_days,lead_time_max_days=excluded.lead_time_max_days,shipping_class=excluded.shipping_class,border=excluded.border,mat=excluded.mat,active=excluded.active,updated_at=excluded.updated_at`,
        )
        .bind(
          crypto.randomUUID(),
          productId,
          materialId,
          sizeId,
          finishId,
          frameId,
          variant.sku,
          "USD",
          cents(variant.price),
          variant.salePrice ? cents(variant.salePrice) : null,
          variant.cost ? cents(variant.cost) : null,
          integer(variant.weightOunces),
          integer(variant.inventory),
          integer(variant.leadTimeMinDays),
          integer(variant.leadTimeMaxDays),
          variant.shippingClass || null,
          variant.border || null,
          variant.mat || null,
          variant.active,
          now,
          now,
        ),
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
        "PRODUCT",
        productId,
        `Product ${existing ? "updated" : "created"} by ${administratorEmail}`,
        JSON.stringify({ slug: input.slug, variantCount: input.variants.length }),
        now,
      ),
  );
  await db.batch(statements);
  return { id: productId, slug: input.slug };
}
