CREATE TABLE `faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `faqs_published_idx` ON `faqs` (`published`,`sort_order`);

-- Safe, idempotent launch seed. All photographs, products, variants, and stories remain draft or inactive.
-- Safe demonstration content. Prices and listings remain draft/sample data.
-- Idempotent: every row uses INSERT OR IGNORE or UPSERT.
INSERT OR IGNORE INTO categories (id,name,slug,description,sort_order,created_at,updated_at) VALUES
('cat_landscapes','Landscapes','landscapes','Fine-art landscapes shaped by light and place.',1,1787169600000,1787169600000),
('cat_wildlife','Wildlife','wildlife','Quiet encounters with wildlife.',2,1787169600000,1787169600000),
('cat_events','Events','events','Selected documentary event photography.',3,1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO materials (id,name,slug,description,care,active,sort_order,created_at,updated_at) VALUES
('mat_paper','Archival paper','archival-paper','Nuanced tone and exceptional detail.','Frame behind UV-filtering glazing; keep away from moisture.',1,1,1787169600000,1787169600000),
('mat_metal','Metal','metal','Luminous color with a modern presence.','Use a clean microfiber cloth; avoid abrasives.',1,2,1787169600000,1787169600000),
('mat_acrylic','Acrylic','acrylic','Depth, clarity, and gallery impact.','Dust gently; use acrylic-safe cleaner only.',1,3,1787169600000,1787169600000),
('mat_canvas','Canvas','canvas','Soft texture and an understated finish.','Dust lightly; do not use liquid cleaner.',1,4,1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO sizes (id,label,width_inches,height_inches,aspect_ratio,active,sort_order,created_at,updated_at) VALUES
('size_12x18','12 × 18',18,12,'3:2',1,1,1787169600000,1787169600000),
('size_16x24','16 × 24',24,16,'3:2',1,2,1787169600000,1787169600000),
('size_20x30','20 × 30',30,20,'3:2',1,3,1787169600000,1787169600000),
('size_24x36','24 × 36',36,24,'3:2',1,4,1787169600000,1787169600000),
('size_24x12','24 × 12',24,12,'2:1',1,5,1787169600000,1787169600000),
('size_36x18','36 × 18',36,18,'2:1',1,6,1787169600000,1787169600000),
('size_48x24','48 × 24',48,24,'2:1',1,7,1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO photographs (id,category_id,title,slug,short_description,story,alt_text,location,orientation,aspect_ratio,dominant_color,focal_point_x,focal_point_y,featured,portfolio_visible,store_available,seo_visible,show_technical_metadata,sort_order,status,created_at,updated_at)
VALUES ('photo_painted_silence','cat_landscapes','Painted Silence','painted-silence','Signature work from Monarch Lake, Colorado.','Morning light settles across Monarch Lake as the surrounding peaks emerge in reflected color. Painted Silence captures the stillness of Colorado’s high country—the brief interval when light, water, and mountain become nearly indistinguishable.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Monarch Lake, Colorado','LANDSCAPE','3:2','blue',50,50,1,1,0,0,0,1,'DRAFT',1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO products (id,photograph_id,name,slug,description,edition_type,status,featured,created_at,updated_at)
VALUES ('product_painted_silence','photo_painted_silence','Painted Silence Fine-Art Print','painted-silence','Disabled sample listing. Replace photography, variants, prices, and fulfillment specifications before activation.','OPEN','DRAFT',1,1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO collections (id,title,slug,subtitle,description,cover_photograph_id,featured,status,sort_order,created_at,updated_at)
VALUES ('collection_mountain','Mountain Stillness','mountain-stillness','Light, reflection, and the high country','A study of the calm between weather, water, and stone.','photo_painted_silence',1,'DRAFT',1,1787169600000,1787169600000);
--> statement-breakpoint
INSERT OR IGNORE INTO collection_photographs (collection_id,photograph_id,sort_order,created_at)
VALUES ('collection_mountain','photo_painted_silence',1,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO journal_posts (id,title,slug,excerpt,body,tags_json,reading_time_minutes,status,created_at,updated_at)
VALUES ('journal_waiting','Waiting for the lake to go still','waiting-for-the-lake-to-go-still','Draft example behind Painted Silence.','REPLACE WITH MICHAEL’S FIRSTHAND STORY BEFORE PUBLISHING.','["behind-the-image","colorado"]',5,'DRAFT',1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO site_settings (key,value_json,"group",is_secret,updated_at) VALUES
('brand','{"businessName":"Memories with Mike","photographer":"Michael Kennedy","location":"Lawrence, Kansas","contactEmail":"michael.kennedy@ku.edu"}','brand',0,1787169600000),
('homepage','{"heroPhotographSlug":"painted-silence","heroTitle":"Where wild places become lasting memories.","heroLocation":"Monarch Lake, Colorado","heroStatement":"Quiet, immersive photographs shaped by light, distance, and the moments that ask us to slow down.","signatureStory":"Morning light settles across Monarch Lake as the surrounding peaks emerge in reflected color. Painted Silence captures the stillness of Colorado’s high country—the brief interval when light, water, and mountain become nearly indistinguishable.","featuredCollectionSlug":"mountain-stillness","showServices":true,"showJournal":true,"showNewsletter":true}','homepage',0,1787169600000),
('commerce','{"checkoutEnabled":false,"currency":"USD","fulfillmentProvider":"MANUAL","maintenanceMode":false}','commerce',0,1787169600000),
('shipping-care','{"shippingNotice":"PLACEHOLDER — add approved domestic and international delivery estimates before launch.","returnsNotice":"PLACEHOLDER — obtain legal and business review before launch.","careNotice":"PLACEHOLDER — replace with lab-approved care instructions by material."}','content',0,1787169600000),
('navigation','{"primary":[{"href":"/portfolio","label":"Portfolio"},{"href":"/prints","label":"Fine-art prints"},{"href":"/services","label":"Services"},{"href":"/journal","label":"Journal"},{"href":"/about","label":"About"}],"socialLinks":[]}','navigation',0,1787169600000),
('service-pricing','{"weddings":"","graduations":"","families":"","events":"","commissioned":""}','services',0,1787169600000);
--> statement-breakpoint

-- Additional visual placeholders. These are drafts, unavailable for sale, and excluded from indexing.
INSERT OR IGNORE INTO photographs (id,category_id,title,slug,short_description,story,alt_text,location,orientation,aspect_ratio,dominant_color,focal_point_x,focal_point_y,featured,portfolio_visible,store_available,seo_visible,show_technical_metadata,sort_order,status,created_at,updated_at) VALUES
('photo_ridge_before_rain','cat_landscapes','Ridge Before Rain','ridge-before-rain','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','PORTRAIT','4:5','earth',50,50,1,0,0,0,0,2,'DRAFT',1787169600000,1787169600000),
('photo_still_waters','cat_landscapes','Still Waters','still-waters','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','LANDSCAPE','3:2','green',50,50,1,0,0,0,0,3,'DRAFT',1787169600000,1787169600000),
('photo_observer','cat_wildlife','The Observer','the-observer','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','PORTRAIT','4:5','earth',50,50,1,0,0,0,0,4,'DRAFT',1787169600000,1787169600000),
('photo_prairie_afterglow','cat_landscapes','Prairie Afterglow','prairie-afterglow','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','PANORAMIC','2:1','earth',50,50,1,0,0,0,0,5,'DRAFT',1787169600000,1787169600000),
('photo_among_reeds','cat_wildlife','Among the Reeds','among-the-reeds','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','LANDSCAPE','3:2','green',50,50,1,0,0,0,0,6,'DRAFT',1787169600000,1787169600000),
('photo_quiet_passage','cat_landscapes','Quiet Passage','quiet-passage','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','SQUARE','1:1','monochrome',50,50,1,0,0,0,0,7,'DRAFT',1787169600000,1787169600000),
('photo_first_light_flight','cat_wildlife','First Light, First Flight','first-light-flight','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','LANDSCAPE','3:2','blue',50,50,1,0,0,0,0,8,'DRAFT',1787169600000,1787169600000),
('photo_vows_motion','cat_events','Vows in Motion','vows-in-motion','SAMPLE PLACEHOLDER — replace title, location, story, and image.','Sample storytelling copy reserved for replacement before publication.','REPLACE WITH ACCURATE ALT TEXT AFTER ADDING THE FINAL PHOTOGRAPH.','Sample location','PORTRAIT','4:5','monochrome',50,50,0,0,0,0,0,9,'DRAFT',1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO products (id,photograph_id,name,slug,description,edition_type,status,featured,created_at,updated_at) VALUES
('product_ridge','photo_ridge_before_rain','Ridge Before Rain Fine-Art Print','ridge-before-rain','SAMPLE — replace product data before activation.','OPEN','DRAFT',0,1787169600000,1787169600000),
('product_still','photo_still_waters','Still Waters Fine-Art Print','still-waters','SAMPLE — replace product data before activation.','OPEN','DRAFT',0,1787169600000,1787169600000),
('product_observer','photo_observer','The Observer Fine-Art Print','the-observer','SAMPLE — replace product data before activation.','OPEN','DRAFT',0,1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO product_variants (id,product_id,material_id,size_id,sku,currency,price_cents,cost_cents,inventory,lead_time_min_days,lead_time_max_days,shipping_class,active,created_at,updated_at) VALUES
('variant_painted_sample','product_painted_silence','mat_paper','size_12x18','SAMPLE-PAINTED-PAPER-12X18','USD',18500,NULL,0,7,14,'standard-print',0,1787169600000,1787169600000),
('variant_ridge_sample','product_ridge','mat_metal','size_20x30','SAMPLE-RIDGE-METAL-20X30','USD',49500,NULL,0,7,14,'standard-print',0,1787169600000,1787169600000),
('variant_still_sample','product_still','mat_canvas','size_16x24','SAMPLE-STILL-CANVAS-16X24','USD',37000,NULL,0,7,14,'standard-print',0,1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO collections (id,title,slug,subtitle,description,cover_photograph_id,featured,status,sort_order,created_at,updated_at) VALUES
('collection_wild','Wild Encounters','wild-encounters','Brief meetings in untamed places','SAMPLE COLLECTION — replace membership and copy before publication.','photo_observer',1,'DRAFT',2,1787169600000,1787169600000),
('collection_heartland','Heartland Light','heartland-light','Open horizons close to home','SAMPLE COLLECTION — replace membership and copy before publication.','photo_prairie_afterglow',1,'DRAFT',3,1787169600000,1787169600000);
--> statement-breakpoint
INSERT OR IGNORE INTO collection_photographs (collection_id,photograph_id,sort_order,created_at) VALUES
('collection_mountain','photo_ridge_before_rain',2,1787169600000),
('collection_mountain','photo_still_waters',3,1787169600000),
('collection_mountain','photo_quiet_passage',4,1787169600000),
('collection_wild','photo_observer',1,1787169600000),
('collection_wild','photo_among_reeds',2,1787169600000),
('collection_wild','photo_first_light_flight',3,1787169600000),
('collection_heartland','photo_prairie_afterglow',1,1787169600000),
('collection_heartland','photo_among_reeds',2,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO journal_posts (id,title,slug,excerpt,body,tags_json,reading_time_minutes,status,created_at,updated_at) VALUES
('journal_wildlife','Photographing wildlife with presence','photographing-wildlife-with-presence','DRAFT SAMPLE — replace with Michael’s firsthand field notes before publication.','REPLACE WITH MICHAEL’S FIRSTHAND STORY BEFORE PUBLISHING.','["field-notes","wildlife"]',4,'DRAFT',1787169600000,1787169600000),
('journal_print_guide','Choosing a fine-art print for your space','choosing-a-fine-art-print','DRAFT SAMPLE — replace materials and recommendations with approved information.','REPLACE WITH APPROVED PRINT GUIDANCE BEFORE PUBLISHING.','["print-guide"]',6,'DRAFT',1787169600000,1787169600000);
--> statement-breakpoint

INSERT OR IGNORE INTO faqs (id,question,answer,category,published,sort_order,created_at,updated_at) VALUES
('faq_prints','What print materials will be available?','PLACEHOLDER — replace with the final approved material lineup and lab specifications.','prints',0,1,1787169600000,1787169600000),
('faq_shipping','How long will delivery take?','PLACEHOLDER — add approved production and delivery estimates by destination before launch.','shipping',0,2,1787169600000,1787169600000),
('faq_services','How do I request a photography session?','Use the inquiry form to share the service, date, location, and goals. Michael will respond with availability and next steps.','services',0,3,1787169600000,1787169600000);
