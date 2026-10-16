CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_unique` ON `accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE INDEX `accounts_user_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`region` text,
	`postal_code` text NOT NULL,
	`country` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `addresses_customer_idx` ON `addresses` (`customer_id`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`summary` text NOT NULL,
	`metadata_json` text,
	`ip_hash` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_user_idx` ON `audit_logs` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` text PRIMARY KEY NOT NULL,
	`cart_id` text NOT NULL,
	`variant_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`gift_note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cart_items_variant_unique` ON `cart_items` (`cart_id`,`variant_id`);--> statement-breakpoint
CREATE INDEX `cart_items_cart_idx` ON `cart_items` (`cart_id`);--> statement-breakpoint
CREATE TABLE `carts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`guest_token_hash` text,
	`currency` text DEFAULT 'USD' NOT NULL,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `carts_customer_idx` ON `carts` (`customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `carts_guest_unique` ON `carts` (`guest_token_hash`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `collection_photographs` (
	`collection_id` text NOT NULL,
	`photograph_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collection_photos_unique` ON `collection_photographs` (`collection_id`,`photograph_id`);--> statement-breakpoint
CREATE INDEX `collection_photos_sort_idx` ON `collection_photographs` (`collection_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`subtitle` text,
	`description` text,
	`cover_photograph_id` text,
	`featured` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`cover_photograph_id`) REFERENCES `photographs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_slug_unique` ON `collections` (`slug`);--> statement-breakpoint
CREATE INDEX `collections_parent_idx` ON `collections` (`parent_id`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`phone` text,
	`stripe_customer_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `customers_email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `discounts` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`starts_at` integer,
	`ends_at` integer,
	`max_uses` integer,
	`uses` integer DEFAULT 0 NOT NULL,
	`minimum_subtotal_cents` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discounts_code_unique` ON `discounts` (`code`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`guest_token_hash` text,
	`photograph_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `favorites_customer_idx` ON `favorites` (`customer_id`);--> statement-breakpoint
CREATE INDEX `favorites_guest_idx` ON `favorites` (`guest_token_hash`);--> statement-breakpoint
CREATE TABLE `finishes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finishes_slug_unique` ON `finishes` (`slug`);--> statement-breakpoint
CREATE TABLE `frames` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`color` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `frames_slug_unique` ON `frames` (`slug`);--> statement-breakpoint
CREATE TABLE `fulfillments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_order_id` text,
	`status` text NOT NULL,
	`tracking_carrier` text,
	`tracking_number` text,
	`tracking_url` text,
	`submitted_at` integer,
	`shipped_at` integer,
	`delivered_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `fulfillments_order_idx` ON `fulfillments` (`order_id`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`service_type` text NOT NULL,
	`event_date` text,
	`location` text NOT NULL,
	`group_size` text,
	`budget_range` text,
	`message` text NOT NULL,
	`referral_source` text,
	`consent_at` integer NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`source_ip_hash` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `inquiries_status_idx` ON `inquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `inquiries_email_idx` ON `inquiries` (`email`);--> statement-breakpoint
CREATE TABLE `journal_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`body` text,
	`cover_asset_key` text,
	`tags_json` text,
	`related_photograph_ids_json` text,
	`related_collection_ids_json` text,
	`reading_time_minutes` integer,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`scheduled_at` integer,
	`published_at` integer,
	`seo_title` text,
	`seo_description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_posts_slug_unique` ON `journal_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `journal_posts_status_idx` ON `journal_posts` (`status`,`published_at`);--> statement-breakpoint
CREATE TABLE `materials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`care` text,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `materials_slug_unique` ON `materials` (`slug`);--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`confirmation_token_hash` text,
	`confirmed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_token_unique` ON `newsletter_subscribers` (`confirmation_token_hash`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`variant_id` text,
	`product_name` text NOT NULL,
	`photograph_title` text NOT NULL,
	`sku` text NOT NULL,
	`variant_snapshot_json` text NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`quantity` integer NOT NULL,
	`subtotal_cents` integer NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`tax_cents` integer DEFAULT 0 NOT NULL,
	`total_cents` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`customer_id` text,
	`email` text NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`fulfillment_status` text DEFAULT 'UNFULFILLED' NOT NULL,
	`subtotal_cents` integer NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`shipping_cents` integer DEFAULT 0 NOT NULL,
	`tax_cents` integer DEFAULT 0 NOT NULL,
	`total_cents` integer NOT NULL,
	`gift_note` text,
	`internal_notes` text,
	`shipping_address_json` text,
	`billing_address_json` text,
	`lookup_token_hash` text,
	`lookup_expires_at` integer,
	`paid_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_number_unique` ON `orders` (`number`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_lookup_unique` ON `orders` (`lookup_token_hash`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`,`fulfillment_status`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_payment_id` text NOT NULL,
	`status` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency` text NOT NULL,
	`refunded_cents` integer DEFAULT 0 NOT NULL,
	`raw_event_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_provider_unique` ON `payments` (`provider`,`provider_payment_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `payments_event_unique` ON `payments` (`raw_event_id`);--> statement-breakpoint
CREATE INDEX `payments_order_idx` ON `payments` (`order_id`);--> statement-breakpoint
CREATE TABLE `photograph_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`photograph_id` text NOT NULL,
	`kind` text NOT NULL,
	`object_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`bytes` integer NOT NULL,
	`blur_data_url` text,
	`checksum` text NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `photograph_assets_key_unique` ON `photograph_assets` (`object_key`);--> statement-breakpoint
CREATE INDEX `photograph_assets_photo_idx` ON `photograph_assets` (`photograph_id`,`kind`);--> statement-breakpoint
CREATE TABLE `photographs` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`story` text,
	`alt_text` text,
	`location` text,
	`captured_at` integer,
	`camera` text,
	`lens` text,
	`focal_length` text,
	`shutter_speed` text,
	`aperture` text,
	`iso` integer,
	`orientation` text DEFAULT 'LANDSCAPE' NOT NULL,
	`aspect_ratio` text DEFAULT '3:2' NOT NULL,
	`dominant_color` text,
	`focal_point_x` integer DEFAULT 50 NOT NULL,
	`focal_point_y` integer DEFAULT 50 NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`portfolio_visible` integer DEFAULT false NOT NULL,
	`store_available` integer DEFAULT false NOT NULL,
	`seo_visible` integer DEFAULT false NOT NULL,
	`show_technical_metadata` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`scheduled_at` integer,
	`published_at` integer,
	`seo_title` text,
	`seo_description` text,
	`social_image_key` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `photographs_slug_unique` ON `photographs` (`slug`);--> statement-breakpoint
CREATE INDEX `photographs_status_idx` ON `photographs` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `photographs_category_idx` ON `photographs` (`category_id`);--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`material_id` text NOT NULL,
	`size_id` text NOT NULL,
	`finish_id` text,
	`frame_id` text,
	`sku` text NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`price_cents` integer NOT NULL,
	`sale_price_cents` integer,
	`cost_cents` integer,
	`weight_ounces` integer,
	`inventory` integer,
	`edition_start` integer,
	`lead_time_min_days` integer,
	`lead_time_max_days` integer,
	`shipping_class` text,
	`border` text,
	`mat` text,
	`active` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`size_id`) REFERENCES `sizes`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`finish_id`) REFERENCES `finishes`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`frame_id`) REFERENCES `frames`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_variants_sku_unique` ON `product_variants` (`sku`);--> statement-breakpoint
CREATE INDEX `product_variants_product_idx` ON `product_variants` (`product_id`,`active`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`photograph_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`edition_type` text DEFAULT 'OPEN' NOT NULL,
	`edition_size` integer,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_photo_idx` ON `products` (`photograph_id`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`source_path` text NOT NULL,
	`destination_path` text NOT NULL,
	`permanent` integer DEFAULT true NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_source_unique` ON `redirects` (`source_path`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value_json` text NOT NULL,
	`group` text DEFAULT 'general' NOT NULL,
	`is_secret` integer DEFAULT false NOT NULL,
	`updated_by` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `site_settings_group_idx` ON `site_settings` (`group`);--> statement-breakpoint
CREATE TABLE `sizes` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`width_inches` integer NOT NULL,
	`height_inches` integer NOT NULL,
	`aspect_ratio` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sizes_dimensions_unique` ON `sizes` (`width_inches`,`height_inches`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'EDITOR' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`event_type` text NOT NULL,
	`status` text DEFAULT 'PROCESSING' NOT NULL,
	`failure_reason` text,
	`processed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `webhook_events_status_idx` ON `webhook_events` (`status`,`created_at`);