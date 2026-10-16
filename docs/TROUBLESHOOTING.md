# Troubleshooting

## Installation fails

Confirm Node.js:

```bash
node --version
npm --version
```

Node must be 22.13 or newer. Remove no lockfile. Run the bounded installer:

```bash
npm run install:ci
```

If the registry is unavailable, retry only after network access is restored; do not hand-edit package-lock.json.

## The application builds but a preview is blank

Run:

```bash
npm run typecheck
npm run lint
npm run build
npm run validate:artifact
```

The artifact validator confirms `wrangler.json`, the required bindings, emitted client assets, and the server default fetch export. If a remote deployment fails after a verified local build, inspect the Worker deployment and runtime logs before changing application code.

## Database binding is unavailable

Public pages fall back to the safe placeholder catalog, but database mutations require DB.

- Confirm `wrangler.json` contains a D1 entry whose binding is `DB` and whose database ID is not the placeholder UUID.
- Use `npm run dev` for local emulation or the deployed Worker runtime.
- Confirm migrations applied.
- Do not create a project-owned wrangler configuration for the Sites checkout.

## The administrator page returns access-required or 404

- Complete the Cloudflare Access sign-in.
- Confirm the identity email exactly matches ADMIN_EMAIL_ALLOWLIST.
- Run npm run admin:bootstrap with the intended email to print the required setting.
- Confirm both `/admin*` and `/api/admin*` use the same Access application.
- Confirm the team domain and application audience tag in `wrangler.json` exactly match Cloudflare Zero Trust.

## Photograph metadata saves but upload fails

- Upload JPEG, PNG, WebP, or AVIF only.
- Keep the file under 20 MB.
- Confirm the file opens and its signature matches its extension.
- Upload a derivative, not RAW, TIFF, PSD, or SVG.
- Confirm BUCKET and IMAGES bindings exist.
- Confirm the photograph was saved and has a database ID.
- Inspect the generic server error and redacted worker log; do not log file bodies.

## A real photograph still shows a placeholder

- Confirm a DISPLAY asset row exists for the photograph.
- Confirm the R2 object key exists.
- Publish the photograph and enable portfolio visibility.
- Verify /media/photographs/... returns an image and not 404.
- Confirm the focal point and aspect ratio are set.

## Product page says release pending

At least one matching product and active variant must exist. Confirm:

- product status is ACTIVE
- variant active is checked
- inventory is blank or above zero
- limited edition has remaining quantity
- material and size references exist
- photograph store availability is intentional

Checkout is separately controlled in /admin/settings.

## Checkout is not configured

- Keep ENABLE_SAMPLE_CHECKOUT false in production.
- Set Stripe live or test credentials consistently.
- Turn on checkout in /admin/settings only after catalog review.
- Add approved STRIPE_SHIPPING_RATE_IDS.
- Verify REQUIRE_PRODUCTION_CONFIGURATION passes.

Never put a secret key in a NEXT_PUBLIC variable.

## Stripe webhook returns invalid signature

- Copy the signing secret for the exact webhook destination.
- Do not use the API secret.
- Ensure the proxy forwards the raw request body unchanged.
- For local CLI testing, use the temporary secret printed by the active listener.

## Stripe event is marked FAILED

Use the event ID to compare:

- Stripe event type and completion state
- Checkout Session line-item expansion
- D1 migrations
- product variant IDs in Stripe metadata
- unique provider payment and webhook constraints

Fix the cause, then use Stripe’s retry control. The idempotency ledger prevents a successfully processed event from creating another order.

## Email is not delivered

Without RESEND_API_KEY and EMAIL_FROM, local development logs a preview result and does not send.

For production:

- verify the sender domain
- check the provider suppression and bounce lists
- confirm recipient and notification addresses
- confirm CSP is not relevant; email is sent server-side
- inspect provider delivery logs by message subject and time, not by logging content

## Order lookup says accepted but no email arrives

The response is deliberately identical for matching and nonmatching input. Confirm the order number and email in /admin/orders, email provider delivery, lookup rate limit, and NEXT_PUBLIC_SITE_URL.

## Analytics does not load

- none is the default.
- Plausible requires NEXT_PUBLIC_PLAUSIBLE_DOMAIN.
- Google requires NEXT_PUBLIC_GOOGLE_ANALYTICS_ID and visitor consent.
- Analytics never runs under /admin.
- Confirm the configured provider is allowed by the current CSP.

## Docker health check fails

```bash
docker compose logs web
docker compose build --no-cache
```

Confirm port 4173 is free and Docker can download the Node 22 image. Docker local persistence is disposable; use the managed preview for D1/R2 integration behavior.

## Migration generation produces unexpected SQL

Review db/schema.ts and the generated SQL before deployment. Never edit an already-applied migration to change production structure. This repository’s 0001 migration was not applied until the final checkpoint and intentionally includes the safe idempotent seed. Future schema changes need a new migration.

## Emergency safe state

1. Enable maintenance mode.
2. Disable public checkout.
3. Revoke or rotate affected credentials.
4. Export D1 and R2.
5. Reconcile Stripe and lab orders.
6. Preserve redacted logs and audit rows.
7. Restore service only after the root cause and data state are understood.
