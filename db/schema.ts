import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const createdAt = integer("created_at", { mode: "timestamp_ms" })
  .notNull()
  .$defaultFn(() => new Date());
const updatedAt = integer("updated_at", { mode: "timestamp_ms" })
  .notNull()
  .$defaultFn(() => new Date());
const deletedAt = integer("deleted_at", { mode: "timestamp_ms" });

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    role: text("role", { enum: ["ADMIN", "EDITOR"] })
      .notNull()
      .default("EDITOR"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    createdAt,
  },
  (table) => [
    uniqueIndex("accounts_provider_unique").on(table.provider, table.providerAccountId),
    index("accounts_user_idx").on(table.userId),
  ],
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt,
  },
  (table) => [uniqueIndex("sessions_token_unique").on(table.tokenHash), index("sessions_user_idx").on(table.userId)],
);

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [uniqueIndex("categories_slug_unique").on(table.slug)],
);

export const photographs = sqliteTable(
  "photographs",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description"),
    story: text("story"),
    altText: text("alt_text"),
    location: text("location"),
    capturedAt: integer("captured_at", { mode: "timestamp_ms" }),
    camera: text("camera"),
    lens: text("lens"),
    focalLength: text("focal_length"),
    shutterSpeed: text("shutter_speed"),
    aperture: text("aperture"),
    iso: integer("iso"),
    orientation: text("orientation", { enum: ["LANDSCAPE", "PORTRAIT", "SQUARE", "PANORAMIC"] })
      .notNull()
      .default("LANDSCAPE"),
    aspectRatio: text("aspect_ratio").notNull().default("3:2"),
    dominantColor: text("dominant_color"),
    focalPointX: integer("focal_point_x").notNull().default(50),
    focalPointY: integer("focal_point_y").notNull().default(50),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    portfolioVisible: integer("portfolio_visible", { mode: "boolean" }).notNull().default(false),
    storeAvailable: integer("store_available", { mode: "boolean" }).notNull().default(false),
    seoVisible: integer("seo_visible", { mode: "boolean" }).notNull().default(false),
    showTechnicalMetadata: integer("show_technical_metadata", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status", { enum: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"] })
      .notNull()
      .default("DRAFT"),
    scheduledAt: integer("scheduled_at", { mode: "timestamp_ms" }),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    socialImageKey: text("social_image_key"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("photographs_slug_unique").on(table.slug),
    index("photographs_status_idx").on(table.status, table.publishedAt),
    index("photographs_category_idx").on(table.categoryId),
  ],
);

export const photographAssets = sqliteTable(
  "photograph_assets",
  {
    id: text("id").primaryKey(),
    photographId: text("photograph_id")
      .notNull()
      .references(() => photographs.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["THUMBNAIL", "DISPLAY", "SOCIAL", "PRODUCT"] }).notNull(),
    objectKey: text("object_key").notNull(),
    mimeType: text("mime_type").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    bytes: integer("bytes").notNull(),
    blurDataUrl: text("blur_data_url"),
    checksum: text("checksum").notNull(),
    createdAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("photograph_assets_key_unique").on(table.objectKey),
    index("photograph_assets_photo_idx").on(table.photographId, table.kind),
  ],
);

export const collections = sqliteTable(
  "collections",
  {
    id: text("id").primaryKey(),
    parentId: text("parent_id"),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    coverPhotographId: text("cover_photograph_id").references(() => photographs.id, { onDelete: "set null" }),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] })
      .notNull()
      .default("DRAFT"),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("collections_slug_unique").on(table.slug),
    index("collections_parent_idx").on(table.parentId),
  ],
);

export const collectionPhotographs = sqliteTable(
  "collection_photographs",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    photographId: text("photograph_id")
      .notNull()
      .references(() => photographs.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt,
  },
  (table) => [
    uniqueIndex("collection_photos_unique").on(table.collectionId, table.photographId),
    index("collection_photos_sort_idx").on(table.collectionId, table.sortOrder),
  ],
);

export const materials = sqliteTable(
  "materials",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    care: text("care"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [uniqueIndex("materials_slug_unique").on(table.slug)],
);

export const sizes = sqliteTable(
  "sizes",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    widthInches: integer("width_inches").notNull(),
    heightInches: integer("height_inches").notNull(),
    aspectRatio: text("aspect_ratio").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("sizes_dimensions_unique").on(table.widthInches, table.heightInches)],
);

export const finishes = sqliteTable(
  "finishes",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("finishes_slug_unique").on(table.slug)],
);

export const frames = sqliteTable(
  "frames",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    color: text("color"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("frames_slug_unique").on(table.slug)],
);

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    photographId: text("photograph_id")
      .notNull()
      .references(() => photographs.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    editionType: text("edition_type", { enum: ["OPEN", "LIMITED"] })
      .notNull()
      .default("OPEN"),
    editionSize: integer("edition_size"),
    status: text("status", { enum: ["DRAFT", "ACTIVE", "SOLD_OUT", "ARCHIVED"] })
      .notNull()
      .default("DRAFT"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [uniqueIndex("products_slug_unique").on(table.slug), index("products_photo_idx").on(table.photographId)],
);

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    materialId: text("material_id")
      .notNull()
      .references(() => materials.id, { onDelete: "restrict" }),
    sizeId: text("size_id")
      .notNull()
      .references(() => sizes.id, { onDelete: "restrict" }),
    finishId: text("finish_id").references(() => finishes.id, { onDelete: "set null" }),
    frameId: text("frame_id").references(() => frames.id, { onDelete: "set null" }),
    sku: text("sku").notNull(),
    currency: text("currency").notNull().default("USD"),
    priceCents: integer("price_cents").notNull(),
    salePriceCents: integer("sale_price_cents"),
    costCents: integer("cost_cents"),
    weightOunces: integer("weight_ounces"),
    inventory: integer("inventory"),
    editionStart: integer("edition_start"),
    leadTimeMinDays: integer("lead_time_min_days"),
    leadTimeMaxDays: integer("lead_time_max_days"),
    shippingClass: text("shipping_class"),
    border: text("border"),
    mat: text("mat"),
    active: integer("active", { mode: "boolean" }).notNull().default(false),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("product_variants_sku_unique").on(table.sku),
    index("product_variants_product_idx").on(table.productId, table.active),
  ],
);

export const customers = sqliteTable(
  "customers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    phone: text("phone"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [index("customers_email_idx").on(table.email)],
);

export const addresses = sqliteTable(
  "addresses",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
    kind: text("kind", { enum: ["SHIPPING", "BILLING"] }).notNull(),
    name: text("name").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    region: text("region"),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull(),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [index("addresses_customer_idx").on(table.customerId)],
);

export const carts = sqliteTable(
  "carts",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
    guestTokenHash: text("guest_token_hash"),
    currency: text("currency").notNull().default("USD"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    index("carts_customer_idx").on(table.customerId),
    uniqueIndex("carts_guest_unique").on(table.guestTokenHash),
  ],
);

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    giftNote: text("gift_note"),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("cart_items_variant_unique").on(table.cartId, table.variantId),
    index("cart_items_cart_idx").on(table.cartId),
  ],
);

export const favorites = sqliteTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "cascade" }),
    guestTokenHash: text("guest_token_hash"),
    photographId: text("photograph_id")
      .notNull()
      .references(() => photographs.id, { onDelete: "cascade" }),
    createdAt,
  },
  (table) => [
    index("favorites_customer_idx").on(table.customerId),
    index("favorites_guest_idx").on(table.guestTokenHash),
  ],
);

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
    email: text("email").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: text("status", { enum: ["PENDING", "PAID", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"] })
      .notNull()
      .default("PENDING"),
    fulfillmentStatus: text("fulfillment_status", {
      enum: ["UNFULFILLED", "READY", "SUBMITTED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"],
    })
      .notNull()
      .default("UNFULFILLED"),
    subtotalCents: integer("subtotal_cents").notNull(),
    discountCents: integer("discount_cents").notNull().default(0),
    shippingCents: integer("shipping_cents").notNull().default(0),
    taxCents: integer("tax_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    giftNote: text("gift_note"),
    internalNotes: text("internal_notes"),
    shippingAddressJson: text("shipping_address_json"),
    billingAddressJson: text("billing_address_json"),
    lookupTokenHash: text("lookup_token_hash"),
    lookupExpiresAt: integer("lookup_expires_at", { mode: "timestamp_ms" }),
    paidAt: integer("paid_at", { mode: "timestamp_ms" }),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("orders_number_unique").on(table.number),
    uniqueIndex("orders_lookup_unique").on(table.lookupTokenHash),
    index("orders_status_idx").on(table.status, table.fulfillmentStatus),
  ],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    photographTitle: text("photograph_title").notNull(),
    sku: text("sku").notNull(),
    variantSnapshotJson: text("variant_snapshot_json").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
    subtotalCents: integer("subtotal_cents").notNull(),
    discountCents: integer("discount_cents").notNull().default(0),
    taxCents: integer("tax_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    createdAt,
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerPaymentId: text("provider_payment_id").notNull(),
    status: text("status").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull(),
    refundedCents: integer("refunded_cents").notNull().default(0),
    rawEventId: text("raw_event_id"),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("payments_provider_unique").on(table.provider, table.providerPaymentId),
    uniqueIndex("payments_event_unique").on(table.rawEventId),
    index("payments_order_idx").on(table.orderId),
  ],
);

export const webhookEvents = sqliteTable(
  "webhook_events",
  {
    id: text("id").primaryKey(),
    provider: text("provider").notNull(),
    eventType: text("event_type").notNull(),
    status: text("status", { enum: ["PROCESSING", "PROCESSED", "FAILED"] })
      .notNull()
      .default("PROCESSING"),
    failureReason: text("failure_reason"),
    processedAt: integer("processed_at", { mode: "timestamp_ms" }),
    createdAt,
    updatedAt,
  },
  (table) => [index("webhook_events_status_idx").on(table.status, table.createdAt)],
);

export const fulfillments = sqliteTable(
  "fulfillments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    provider: text("provider", { enum: ["MANUAL", "ORDER_DESK", "BAY_PHOTO"] }).notNull(),
    providerOrderId: text("provider_order_id"),
    status: text("status").notNull(),
    trackingCarrier: text("tracking_carrier"),
    trackingNumber: text("tracking_number"),
    trackingUrl: text("tracking_url"),
    submittedAt: integer("submitted_at", { mode: "timestamp_ms" }),
    shippedAt: integer("shipped_at", { mode: "timestamp_ms" }),
    deliveredAt: integer("delivered_at", { mode: "timestamp_ms" }),
    createdAt,
    updatedAt,
  },
  (table) => [index("fulfillments_order_idx").on(table.orderId)],
);

export const discounts = sqliteTable(
  "discounts",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    type: text("type", { enum: ["PERCENT", "FIXED"] }).notNull(),
    amount: integer("amount").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(false),
    startsAt: integer("starts_at", { mode: "timestamp_ms" }),
    endsAt: integer("ends_at", { mode: "timestamp_ms" }),
    maxUses: integer("max_uses"),
    uses: integer("uses").notNull().default(0),
    minimumSubtotalCents: integer("minimum_subtotal_cents"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [uniqueIndex("discounts_code_unique").on(table.code)],
);

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    serviceType: text("service_type").notNull(),
    company: text("company"),
    companyWebsite: text("company_website"),
    partnershipType: text("partnership_type"),
    projectTiming: text("project_timing"),
    eventDate: text("event_date"),
    location: text("location").notNull(),
    groupSize: text("group_size"),
    budgetRange: text("budget_range"),
    message: text("message").notNull(),
    referralSource: text("referral_source"),
    consentAt: integer("consent_at", { mode: "timestamp_ms" }).notNull(),
    status: text("status", { enum: ["NEW", "CONTACTED", "ARCHIVED"] })
      .notNull()
      .default("NEW"),
    sourceIpHash: text("source_ip_hash"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    index("inquiries_status_idx").on(table.status, table.createdAt),
    index("inquiries_email_idx").on(table.email),
  ],
);

export const journalPosts = sqliteTable(
  "journal_posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    body: text("body"),
    coverAssetKey: text("cover_asset_key"),
    tagsJson: text("tags_json"),
    relatedPhotographIdsJson: text("related_photograph_ids_json"),
    relatedCollectionIdsJson: text("related_collection_ids_json"),
    readingTimeMinutes: integer("reading_time_minutes"),
    status: text("status", { enum: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"] })
      .notNull()
      .default("DRAFT"),
    scheduledAt: integer("scheduled_at", { mode: "timestamp_ms" }),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("journal_posts_slug_unique").on(table.slug),
    index("journal_posts_status_idx").on(table.status, table.publishedAt),
  ],
);

export const newsletterSubscribers = sqliteTable(
  "newsletter_subscribers",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status", { enum: ["PENDING", "ACTIVE", "UNSUBSCRIBED"] })
      .notNull()
      .default("PENDING"),
    confirmationTokenHash: text("confirmation_token_hash"),
    confirmedAt: integer("confirmed_at", { mode: "timestamp_ms" }),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [
    uniqueIndex("newsletter_email_unique").on(table.email),
    uniqueIndex("newsletter_token_unique").on(table.confirmationTokenHash),
  ],
);

export const siteSettings = sqliteTable(
  "site_settings",
  {
    key: text("key").primaryKey(),
    valueJson: text("value_json").notNull(),
    group: text("group").notNull().default("general"),
    isSecret: integer("is_secret", { mode: "boolean" }).notNull().default(false),
    updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt,
  },
  (table) => [index("site_settings_group_idx").on(table.group)],
);

export const redirects = sqliteTable(
  "redirects",
  {
    id: text("id").primaryKey(),
    sourcePath: text("source_path").notNull(),
    destinationPath: text("destination_path").notNull(),
    permanent: integer("permanent", { mode: "boolean" }).notNull().default(true),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("redirects_source_unique").on(table.sourcePath)],
);

export const faqs = sqliteTable(
  "faqs",
  {
    id: text("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    category: text("category").notNull().default("general"),
    published: integer("published", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => [index("faqs_published_idx").on(table.published, table.sortOrder)],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    summary: text("summary").notNull(),
    metadataJson: text("metadata_json"),
    ipHash: text("ip_hash"),
    createdAt,
  },
  (table) => [
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_user_idx").on(table.userId, table.createdAt),
  ],
);
