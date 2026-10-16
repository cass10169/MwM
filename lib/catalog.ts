import {
  collections as fallbackCollections,
  journalPosts as fallbackJournalPosts,
  photographs as fallbackPhotographs,
  products as fallbackProducts,
  type Photograph,
  type StoreProduct,
} from "./content";
import { database } from "./platform";

type PhotographRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  story: string | null;
  alt_text: string | null;
  location: string | null;
  captured_at: number | null;
  camera: string | null;
  lens: string | null;
  focal_length: string | null;
  shutter_speed: string | null;
  aperture: string | null;
  iso: number | null;
  orientation: string;
  aspect_ratio: string;
  dominant_color: string | null;
  focal_point_x: number;
  focal_point_y: number;
  featured: number;
  portfolio_visible: number;
  store_available: number;
  seo_visible: number;
  show_technical_metadata: number;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  category_name: string | null;
  object_key: string | null;
};

type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  featured: number;
  status: string;
};

type JournalRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  tags_json: string | null;
  related_photograph_ids_json: string | null;
  related_collection_ids_json: string | null;
  reading_time_minutes: number | null;
  status: string;
  scheduled_at: number | null;
  seo_title: string | null;
  seo_description: string | null;
};

function mediaUrl(key: string | null) {
  if (!key) return undefined;
  return `/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

function photographVariant(row: PhotographRow): Photograph["variant"] {
  const text = `${row.category_name ?? ""} ${row.location ?? ""} ${row.dominant_color ?? ""}`.toLowerCase();
  if (text.includes("wildlife")) return "wildlife";
  if (text.includes("lake") || text.includes("blue")) return "lake";
  if (text.includes("kansas") || text.includes("prairie")) return "prairie";
  if (text.includes("event") || text.includes("portrait")) return "detail";
  return "mountain";
}

function mapPhotograph(row: PhotographRow): Photograph {
  const orientation = row.orientation.toLowerCase();
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description ?? undefined,
    location: row.location ?? "Location not published",
    category: row.category_name ?? "Custom",
    orientation: (["landscape", "portrait", "square", "panoramic"].includes(orientation)
      ? orientation
      : "landscape") as Photograph["orientation"],
    color: row.dominant_color ?? "earth",
    featured: Boolean(row.featured),
    available: Boolean(row.store_available),
    story: row.story ?? row.short_description ?? "Story forthcoming.",
    filename: row.object_key?.split("/").at(-1) ?? `${row.slug}-display-1800x1200.webp`,
    displayUrl: mediaUrl(row.object_key),
    altText: row.alt_text ?? row.title,
    focalPointX: row.focal_point_x,
    focalPointY: row.focal_point_y,
    status: row.status,
    portfolioVisible: Boolean(row.portfolio_visible),
    seoVisible: Boolean(row.seo_visible),
    capturedAt: row.captured_at ? new Date(row.captured_at).toISOString().slice(0, 10) : undefined,
    camera: row.camera ?? undefined,
    lens: row.lens ?? undefined,
    focalLength: row.focal_length ?? undefined,
    shutterSpeed: row.shutter_speed ?? undefined,
    aperture: row.aperture ?? undefined,
    iso: row.iso ?? undefined,
    aspectRatio: row.aspect_ratio,
    showTechnicalMetadata: Boolean(row.show_technical_metadata),
    variant: photographVariant(row),
  };
}

const photoSelect = `
  SELECT p.*, c.name AS category_name,
    (SELECT pa.object_key FROM photograph_assets pa
      WHERE pa.photograph_id=p.id AND pa.kind='DISPLAY' AND pa.deleted_at IS NULL
      ORDER BY pa.created_at DESC LIMIT 1) AS object_key
  FROM photographs p
  LEFT JOIN categories c ON c.id=p.category_id
`;

export async function getPublicPhotographs(): Promise<Photograph[]> {
  try {
    const now = Date.now();
    const result = await database()
      .prepare(
        `${photoSelect}
      WHERE p.deleted_at IS NULL AND p.status='PUBLISHED' AND p.portfolio_visible=1
        AND (p.scheduled_at IS NULL OR p.scheduled_at <= ?)
      ORDER BY p.sort_order ASC, p.published_at DESC, p.created_at DESC`,
      )
      .bind(now)
      .all<PhotographRow>();
    if (result.results.length) {
      const retiredSampleSlugs = new Set([
        "ridge-before-rain",
        "prairie-afterglow",
        "among-the-reeds",
        "quiet-passage",
        "first-light-flight",
        "vows-in-motion",
      ]);
      const databasePhotographs = result.results
        .map(mapPhotograph)
        .filter((photo) => photo.displayUrl || !retiredSampleSlugs.has(photo.slug));
      const databaseBySlug = new Map(databasePhotographs.map((photo) => [photo.slug, photo]));
      const bundled = fallbackPhotographs.map((photo) => {
        const saved = databaseBySlug.get(photo.slug);
        if (!saved) return photo;
        databaseBySlug.delete(photo.slug);
        return {
          ...photo,
          ...saved,
          displayUrl: saved.displayUrl ?? photo.displayUrl,
          altText: saved.altText ?? photo.altText,
          filename: saved.displayUrl ? saved.filename : photo.filename,
        };
      });
      return [...bundled, ...databaseBySlug.values()];
    }
  } catch {}
  const sampleCommerce = process.env.NODE_ENV !== "production" || process.env.ENABLE_SAMPLE_CHECKOUT === "true";
  return fallbackPhotographs.map((photo) => ({ ...photo, available: sampleCommerce && photo.available }));
}

export async function getAdminPhotographs(): Promise<Photograph[]> {
  try {
    const result = await database()
      .prepare(`${photoSelect} WHERE p.deleted_at IS NULL ORDER BY p.sort_order ASC, p.created_at DESC`)
      .all<PhotographRow>();
    if (result.results.length) return result.results.map(mapPhotograph);
  } catch {}
  return fallbackPhotographs;
}

export async function getPhotograph(slug: string, includeDrafts = false): Promise<Photograph | undefined> {
  try {
    const visibility = includeDrafts ? "" : "AND p.status='PUBLISHED' AND p.portfolio_visible=1";
    const row = await database()
      .prepare(`${photoSelect} WHERE p.deleted_at IS NULL AND p.slug=? ${visibility} LIMIT 1`)
      .bind(slug)
      .first<PhotographRow>();
    if (row) return mapPhotograph(row);
  } catch {}
  return fallbackPhotographs.find((item) => item.slug === slug);
}

export type CatalogCollection = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  photographSlugs: string[];
  featured?: boolean;
  status?: string;
};

export async function getCollections(includeDrafts = false): Promise<CatalogCollection[]> {
  try {
    const where = includeDrafts ? "" : "AND c.status='PUBLISHED'";
    const rows = (
      await database()
        .prepare(
          `SELECT c.id,c.slug,c.title,c.subtitle,c.description,c.featured,c.status FROM collections c WHERE c.deleted_at IS NULL ${where} ORDER BY c.sort_order,c.created_at`,
        )
        .all<CollectionRow>()
    ).results;
    if (rows.length) {
      const output: CatalogCollection[] = [];
      for (const row of rows) {
        const photos = (
          await database()
            .prepare(
              "SELECT p.slug FROM collection_photographs cp JOIN photographs p ON p.id=cp.photograph_id WHERE cp.collection_id=? AND p.deleted_at IS NULL ORDER BY cp.sort_order",
            )
            .bind(row.id)
            .all<{ slug: string }>()
        ).results;
        output.push({
          id: row.id,
          slug: row.slug,
          title: row.title,
          subtitle: row.subtitle ?? "",
          description: row.description ?? "",
          photographSlugs: photos.map((photo) => photo.slug),
          featured: Boolean(row.featured),
          status: row.status,
        });
      }
      const savedBySlug = new Map(output.map((collection) => [collection.slug, collection]));
      const bundled = fallbackCollections.map((collection) => {
        const saved = savedBySlug.get(collection.slug);
        if (!saved) return collection;
        savedBySlug.delete(collection.slug);
        return {
          ...saved,
          ...collection,
          id: saved.id,
          photographSlugs: [...new Set([...collection.photographSlugs, ...saved.photographSlugs])],
        };
      });
      return [...bundled, ...savedBySlug.values()];
    }
  } catch {}
  return fallbackCollections;
}

export async function getCollection(slug: string, includeDrafts = false) {
  return (await getCollections(includeDrafts)).find((collection) => collection.slug === slug);
}

type ProductRow = {
  id: string;
  slug: string;
  photograph_slug: string;
  name: string;
  description: string | null;
  edition_type: "OPEN" | "LIMITED";
  edition_size: number | null;
  status: string;
  featured: number;
};

type VariantRow = {
  id: string;
  sku: string;
  material: string;
  size: string;
  finish: string | null;
  frame: string | null;
  border: string | null;
  mat: string | null;
  price_cents: number;
  sale_price_cents: number | null;
  inventory: number | null;
  lead_time_min_days: number | null;
  lead_time_max_days: number | null;
  active: number;
};

export async function getStoreProducts(includeDrafts = false): Promise<StoreProduct[]> {
  try {
    const where = includeDrafts ? "" : "AND pr.status='ACTIVE'";
    const rows = (
      await database()
        .prepare(
          `SELECT pr.id,pr.slug,p.slug AS photograph_slug,pr.name,pr.description,pr.edition_type,pr.edition_size,pr.status,pr.featured FROM products pr JOIN photographs p ON p.id=pr.photograph_id WHERE pr.deleted_at IS NULL ${where} ORDER BY pr.featured DESC,pr.created_at`,
        )
        .all<ProductRow>()
    ).results;
    if (rows.length) {
      const output: StoreProduct[] = [];
      for (const row of rows) {
        const variants = (
          await database()
            .prepare(
              `SELECT v.id,v.sku,m.name AS material,s.label AS size,f.name AS finish,fr.name AS frame,v.border,v.mat,v.price_cents,v.sale_price_cents,v.inventory,v.lead_time_min_days,v.lead_time_max_days,v.active
          FROM product_variants v JOIN materials m ON m.id=v.material_id JOIN sizes s ON s.id=v.size_id
          LEFT JOIN finishes f ON f.id=v.finish_id LEFT JOIN frames fr ON fr.id=v.frame_id
          WHERE v.product_id=? AND v.deleted_at IS NULL ${includeDrafts ? "" : "AND v.active=1"} ORDER BY m.sort_order,s.sort_order`,
            )
            .bind(row.id)
            .all<VariantRow>()
        ).results;
        const mapped = variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          material: variant.material,
          size: variant.size,
          finish: variant.finish ?? undefined,
          frame: variant.frame ?? undefined,
          border: variant.border ?? undefined,
          mat: variant.mat ?? undefined,
          priceCents: variant.price_cents,
          salePriceCents: variant.sale_price_cents ?? undefined,
          inventory: variant.inventory ?? undefined,
          leadTimeMinDays: variant.lead_time_min_days ?? undefined,
          leadTimeMaxDays: variant.lead_time_max_days ?? undefined,
          available: Boolean(variant.active) && (variant.inventory === null || variant.inventory > 0),
        }));
        output.push({
          slug: row.slug,
          photographSlug: row.photograph_slug,
          title: row.name.replace(/ Fine-Art Print$/i, ""),
          enabled: row.status === "ACTIVE" && mapped.some((variant) => variant.available),
          featured: Boolean(row.featured),
          startingPrice: mapped.length
            ? Math.min(
                ...mapped
                  .filter((variant) => variant.available)
                  .map((variant) => variant.salePriceCents ?? variant.priceCents),
              )
            : 0,
          materials: [...new Set(mapped.map((variant) => variant.material))],
          sizes: [...new Set(mapped.map((variant) => variant.size))],
          editionType: row.edition_type,
          editionSize: row.edition_size ?? undefined,
          description: row.description ?? undefined,
          variants: mapped,
        });
      }
      const savedBySlug = new Map(output.map((product) => [product.slug, product]));
      const bundled = fallbackProducts.map((product) => {
        const saved = savedBySlug.get(product.slug);
        if (!saved) return product;
        savedBySlug.delete(product.slug);
        return { ...product, ...saved };
      });
      return [...bundled, ...savedBySlug.values()];
    }
  } catch {}
  const sampleCommerce = process.env.NODE_ENV !== "production" || process.env.ENABLE_SAMPLE_CHECKOUT === "true";
  return fallbackProducts.map((product) => ({
    ...product,
    enabled: sampleCommerce && product.enabled,
    variants: product.variants.map((variant) => ({ ...variant, available: sampleCommerce && variant.available })),
  }));
}

export async function getStoreProduct(slug: string, includeDrafts = false) {
  return (await getStoreProducts(includeDrafts)).find((product) => product.slug === slug);
}

export type CatalogJournalPost = (typeof fallbackJournalPosts)[number] & {
  status?: string;
  tags?: string[];
  body?: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedPhotographSlugs?: string[];
  relatedCollectionSlugs?: string[];
};

export async function getJournalPosts(includeDrafts = false): Promise<CatalogJournalPost[]> {
  try {
    const where = includeDrafts ? "" : "AND status='PUBLISHED' AND (scheduled_at IS NULL OR scheduled_at<=?)";
    const statement = database().prepare(
      `SELECT slug,title,excerpt,body,tags_json,related_photograph_ids_json,related_collection_ids_json,reading_time_minutes,status,scheduled_at,seo_title,seo_description FROM journal_posts WHERE deleted_at IS NULL ${where} ORDER BY COALESCE(published_at,created_at) DESC`,
    );
    const rows = (
      includeDrafts ? await statement.all<JournalRow>() : await statement.bind(Date.now()).all<JournalRow>()
    ).results;
    if (rows.length)
      return rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        category: "Field notes",
        readingTime: `${row.reading_time_minutes ?? 5} min`,
        excerpt: row.excerpt ?? "Story forthcoming.",
        body: row.body ?? row.excerpt ?? "Story forthcoming.",
        published: row.status === "PUBLISHED",
        status: row.status,
        tags: row.tags_json ? (JSON.parse(row.tags_json) as string[]) : [],
        relatedPhotographSlugs: row.related_photograph_ids_json
          ? (JSON.parse(row.related_photograph_ids_json) as string[])
          : [],
        relatedCollectionSlugs: row.related_collection_ids_json
          ? (JSON.parse(row.related_collection_ids_json) as string[])
          : [],
        scheduledAt: row.scheduled_at ? new Date(row.scheduled_at).toISOString().slice(0, 16) : undefined,
        seoTitle: row.seo_title ?? undefined,
        seoDescription: row.seo_description ?? undefined,
      }));
  } catch {}
  return fallbackJournalPosts;
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await database()
      .prepare("SELECT value_json FROM site_settings WHERE key=?")
      .bind(key)
      .first<{ value_json: string }>();
    if (row) return { ...fallback, ...JSON.parse(row.value_json) } as T;
  } catch {}
  return fallback;
}

export async function checkoutEnabled() {
  const value = await getSiteSetting("commerce", { checkoutEnabled: false });
  return (
    value.checkoutEnabled || process.env.NODE_ENV !== "production" || process.env.ENABLE_SAMPLE_CHECKOUT === "true"
  );
}
