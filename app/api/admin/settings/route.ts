import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";

const schema = z.object({
  brand: z.object({
    businessName: z.string().trim().min(1).max(120),
    photographer: z.string().trim().min(1).max(120),
    contactEmail: z.email(),
    location: z.string().trim().min(1).max(180),
  }),
  homepage: z.object({
    heroPhotographSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    heroTitle: z.string().min(1).max(180),
    heroLocation: z.string().max(180),
    heroStatement: z.string().max(500),
    signatureStory: z.string().max(2000),
    featuredCollectionSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    showServices: z.boolean(),
    showJournal: z.boolean(),
    showNewsletter: z.boolean(),
  }),
  commerce: z.object({
    checkoutEnabled: z.boolean(),
    maintenanceMode: z.boolean(),
    currency: z.literal("USD"),
    fulfillmentProvider: z.enum(["MANUAL", "ORDER_DESK", "BAY_PHOTO"]),
  }),
  navigation: z.object({
    primary: z
      .array(z.object({ label: z.string().trim().min(1).max(40), href: z.string().regex(/^\/[a-z0-9/-]*$/) }))
      .min(1)
      .max(10),
    socialLinks: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(40),
          href: z.url().refine((value) => value.startsWith("https://"), "Social links must use HTTPS."),
        }),
      )
      .max(10),
  }),
  servicePricing: z.object({
    weddings: z.string().max(80),
    graduations: z.string().max(80),
    families: z.string().max(80),
    events: z.string().max(80),
    commissioned: z.string().max(80),
  }),
});

export async function POST(request: Request) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Review the settings fields." }, { status: 400 });
  const db = database();
  const now = Date.now();
  const upsert = (key: string, value: unknown, group: string) =>
    db
      .prepare(
        'INSERT INTO site_settings (key,value_json,"group",is_secret,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,"group"=excluded."group",updated_at=excluded.updated_at',
      )
      .bind(key, JSON.stringify(value), group, false, now);
  await db.batch([
    upsert("brand", parsed.data.brand, "brand"),
    upsert("homepage", parsed.data.homepage, "homepage"),
    upsert("commerce", parsed.data.commerce, "commerce"),
    upsert("navigation", parsed.data.navigation, "navigation"),
    upsert("service-pricing", parsed.data.servicePricing, "services"),
    db
      .prepare(
        "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        null,
        "UPDATE",
        "SITE_SETTINGS",
        null,
        `Site settings updated by ${user.email}`,
        JSON.stringify({ groups: ["brand", "homepage", "commerce", "navigation", "services"] }),
        now,
      ),
  ]);
  return NextResponse.json({ saved: true });
}
