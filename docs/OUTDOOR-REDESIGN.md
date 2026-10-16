# Outdoor redesign — 14 October 2026

## Source and publishing

Development branch: `outdoor-redesign-2026-10-14` in `cass10169/MwM`.
The existing `main` branch contains the 2022 React application. This development branch preserves its commit history and retains the previous application and original assets under `legacy-2022/`. The new branch root contains the recovered Cloudflare/Vinext source and its complete photographs. It does not change `main` or enable automatic publishing.

Target production host: `https://memorieswithmike.com`.
Framework: React 19, Next-compatible App Router through Vinext/Vite.
Runtime: existing Cloudflare Worker; D1 catalog/inquiries, R2 media, Cloudflare Images.

The included `wrangler.json` intentionally contains resource placeholders. It is not the live account configuration. Before deploying, retrieve the existing Worker's configuration and preserve the account ID, D1 ID, R2 binding, Access team domain/AUD, environment variables, secrets, analytics, domain routes, and email records. Do not replace the live configuration with these placeholders. Do not create another database or bucket.

1. Record the current Worker deployment/version as the rollback point and export current Worker bindings and configuration through the connected Cloudflare account.
2. Back up D1 using the existing backup process.
3. Apply the additive `0003_outdoor_inquiries.sql` migration to the existing D1 database before publishing the new Worker. Existing rows remain intact; new optional columns are added.
4. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run build`, then `node --test tests/rendered-html.test.mjs tests/outdoor-rendered.test.mjs`.
5. Deploy the existing Worker using its preserved live configuration, domain routes, and secrets.
6. Verify HTTPS, custom-domain routes, images, all inquiry types, admin details, email notifications if configured, sitemap, robots, 404 handling, and desktop/mobile layouts.
7. Rollback: restore the recorded Worker version. The additive inquiry columns may remain; the previous Worker does not require their removal.

## Editorial structure

The homepage leads with outdoor photography and partnership inquiries. Explore provides landscapes, wildlife, waterfalls, night/astro, Colorado, Kansas, and national parks. Partners explains potential future working models, without identifying current sponsors. The web media kit omits unverified reach and metrics. A downloadable PDF can be linked when an approved asset is available.

Expedition records support verified dates, route, mission, photographic goals, conditions, gear references, partners, journal stories, BTS, lessons, contracted deliverables, and resulting media. Optional records must include verification/agreement references. The Colorado field archive is a location-based collection across outings. The October 2026 case study is a draft, not a fabricated single-trip report.

Original URLs and photographs are retained. New portrait/wedding/session links lead to `/photography/[slug]`; existing print detail URLs remain available. Local services and print requests remain separate from the outdoor brand identity. No invented testimonials, audience statistics, sponsorships, pricing, turnaround promises, or equipment lists are introduced.

## Field Kit — unpublished

`lib/field-kit.ts` contains four reusable categories: Photography; Editing & Production; Vehicle & Travel; Camping & Field. The inventory is deliberately empty. Publication is disabled, the route returns 404, and navigation/sitemap omit it.

A future record must have owner-supplied inventory verification before publication. Owned, Rented, Loaned, Field Tested, and Field Partner designations require individual verification. Company relationships also require evidence. Drafts and invalid records are excluded by the reusable template. Supply inventory before enabling the page or including links in navigation and sitemap; update indexing only after approved content exists.

## Photography delivery

`lib/image-manifest.json` describes actual dimensions for every bundled derivative. Filename suffixes are not trusted as width. Responsive `srcset` uses measured width descriptors; hero declares full-width sizing and high priority; below-fold images load lazily. Portraits preserve suitable framing. No upscaled replacement images are created. Several recovered assets have lower source resolution; larger originals are still needed for high-DPI hero and large-format display.

## Verification and remaining gates

Typecheck, lint, 21 unit tests, production artifact validation, five rendered tests, and local D1 migration passed during implementation. Rendered tests cover key pages, public links, image files, one H1 per tested page, unique homepage images, and hidden inventory/draft case study routes.

Published on 15 October 2026 at https://memorieswithmike.com. All 77 production smoke checks passed, including public pages and assets, redirects, protected admin routes, validation, and unpublished draft routes. Mobile and desktop browser checks passed; a narrow-screen photograph overflow was corrected. A clearly marked test inquiry was submitted through the live browser and verified in D1 with all four new partnership fields. Authenticated admin UI inspection and email delivery remain unverified. Email delivery is not configured: RESEND_API_KEY and EMAIL_FROM are absent. Automated WCAG testing has not been completed.

Apex and www Worker routes were added to the existing active Cloudflare zone. Existing DNS records, email records, database, storage, Access policies, and analytics configuration were preserved. The additive 0003 migration was applied to production. The Worker content API retained the actual production resource IDs and settings; no resource placeholders were deployed.

## API content packaging

`node scripts/package-cloudflare-content.mjs` prepares three ESM modules from the validated build. The existing Cloudflare `/content` API preserves live configuration and photograph assets. The wrapper supplies new hashed JS/CSS assets and delegates unchanged photography to the retained ASSETS binding. Standard Wrangler deployments can continue to upload all build assets normally. The API wrapper redirects www and the public workers.dev pages to the canonical apex.

Rollback Worker version: `864b5baa-9a3c-40b4-ba69-8ac98808aa47`. D1 pre-change bookmark: `00000038-00000000-00005105-b569fee738efbbf1a3fb4bf4c7d68264`.

Published Worker version: `4baed58c-0cec-44b7-86e0-e70014c4a445`. Complete pre-migration SQL export SHA-256: `7df0a679a58da890861cf663ed33b8522f4ea7ee0c805614b24fd213b569ebae`.
