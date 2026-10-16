# Commercial optimization — 15 October 2026

## Canonical source and deployment
The current production source is cass10169/MwM, branch outdoor-redesign-2026-10-14. It was recovered from the supplied checkpoint and SHA-verified at c246252cce24d665fb9ef66aa29a827ad9a209d3 before this release. The older main branch and legacy-2022 archive are retained. This is the Vinext/Cloudflare application, not the obsolete CRA or Angular projects.

Production uses the existing memories-with-mike Worker and apex/www routes. DNS remains authoritative at Cloudflare; GoDaddy requires no change. Preserve the actual live Worker settings: ASSETS, DB, BUCKET, IMAGES, D1/R2 aliases, Access values and plain variables. wrangler.json is a local template; never upload its placeholder IDs to production.

Run npm ci, npm run typecheck, npm run lint, and npm run test. On restricted Windows environments, set TEMP and TMP to a writable workspace temporary directory. npm run test builds and validates the artifact and runs the rendered buyer-flow tests. Generate API modules with node scripts/package-cloudflare-content.mjs. Upload entry.mjs, core.mjs and runtime-assets.mjs to the existing Worker /content endpoint as multipart modules with main_module entry.mjs. That endpoint preserves config and existing photo assets. Verify live settings and production behavior after upload.

Rollback baseline for this release: Worker version 4baed58c-0cec-44b7-86e0-e70014c4a445, prior source c246252cce24d665fb9ef66aa29a827ad9a209d3. Restore that Worker version to revert the application. No schema or DNS changes are required by this release; do not restore an old database and discard newer inquiries.

## Commercial behavior
- Outdoor-only default portfolio; People & Events remains available separately and through Services.
- Homepage field-production section and featured Colorado archive; all homepage images remain distinct.
- Partnership value propositions and illustrative, configurable deliverables.
- Nine-image commercial media kit with application, geographic scope, licensing, and contact information.
- Expanded Colorado archive describes observed images and potential future briefs. It is explicitly a selection across outings, not an invented trip or sponsorship. Colorado 2026 and Field Kit remain unpublished.
- Existing print inquiry links now carry verified photograph context; preferences cover dimensions, medium and destination. Preferences are not confirmed product availability or prices.
- Licensing overview and per-image inquiries capture usage, media, territory, duration, exclusivity and timing.
- Session links carry service type. Forms ask only relevant questions, preserve error associations and announce success.
- Detailed inquiry context is validated and formatted server-side into the existing message column. Existing admin screens and rollback versions can read it. No migration is needed. Canonical photograph names are resolved server-side.
- Sitemap includes licensing, People & Events, Adventure / Field and inquiry-based print detail pages.

## Factual gates and configuration
The production audit found four draft products, no active product variants, empty service pricing, no Stripe or email credentials, analytics provider none, and no MX records proving a branded mailbox. Preserve michael.kennedy@ku.edu. No pricing, payment availability, branded mailbox, audience metrics, sponsors or equipment claims were introduced.

Audience metric configuration in lib/commercial.ts stays empty until values have a dated source and approval. Conversion hooks use the existing analytics provider and consent behavior, carry no form content or personal data, and transmit nothing while provider=none. Events include partner_cta, media_kit_view, print_inquiry_started, print_inquiry_submitted, licensing_inquiry_submitted, photography_inquiry_submitted, partnership_inquiry_submitted and expedition_inquiry_submitted. Existing checkout and purchase hooks remain.

Environment names for future owner configuration: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, EMAIL_FROM, ADMIN_NOTIFICATION_EMAIL, NEXT_PUBLIC_ANALYTICS_PROVIDER, NEXT_PUBLIC_PLAUSIBLE_DOMAIN, NEXT_PUBLIC_GOOGLE_ANALYTICS_ID. Never commit credentials. Configuration alone does not verify delivery or payment behavior: test each integration before advertising it.

## QA scope
26 unit tests and seven rendered/integration tests cover schema constraints, four buyer submissions, persisted inquiry detail, context propagation, portfolio separation, navigation, draft protection, and assets. Browser checks and production request results are recorded separately in the release report after deployment. Local preview was attempted but the in-app browser could not connect to the local server; the deployed build is reviewed on the production domain with rollback available.
