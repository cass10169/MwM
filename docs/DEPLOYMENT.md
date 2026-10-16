# Deployment and launch reference

Use the root-level `CLOUDFLARE-DEPLOYMENT.md` for the ordered, copy-and-paste deployment procedure. This file is the configuration and launch reference.

## Cloudflare bindings

| Binding  | Resource                             | Required |
| -------- | ------------------------------------ | -------- |
| `DB`     | D1 database `memories-with-mike`     | Yes      |
| `BUCKET` | R2 bucket `memories-with-mike-media` | Yes      |
| `IMAGES` | Cloudflare Images transformations    | Yes      |
| `ASSETS` | Worker static assets                 | Yes      |

Bindings and public variables are declared in `wrangler.json`. Secret values must be added with `npx wrangler secret put NAME`.

## Environment variables

| Variable                           | Required for launch        | Purpose                                        |
| ---------------------------------- | -------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`             | Yes                        | Canonical HTTPS origin                         |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`   | No                         | `none`, `plausible`, or `google`               |
| `CLOUDFLARE_ACCESS_TEAM_DOMAIN`    | Yes                        | Zero Trust team issuer URL                     |
| `CLOUDFLARE_ACCESS_AUD`            | Yes                        | Access application audience tag                |
| `ADMIN_EMAIL_ALLOWLIST`            | Yes                        | Exact, comma-separated administrator emails    |
| `ADMIN_NOTIFICATION_EMAIL`         | Yes                        | Inquiry alert destination                      |
| `ENABLE_SAMPLE_CHECKOUT`           | Always false in production | Local testing safeguard                        |
| `REQUIRE_PRODUCTION_CONFIGURATION` | Yes at commerce launch     | Rejects incomplete payment/email configuration |
| `STRIPE_PUBLISHABLE_KEY`           | At commerce launch         | Public Stripe identifier                       |
| `STRIPE_SECRET_KEY`                | At commerce launch         | Secret Stripe API credential                   |
| `STRIPE_WEBHOOK_SECRET`            | At commerce launch         | Verifies raw webhook signatures                |
| `STRIPE_SHIPPING_RATE_IDS`         | For shipped orders         | Approved Stripe shipping rates                 |
| `RESEND_API_KEY`                   | At email launch            | Transactional email credential                 |
| `EMAIL_FROM`                       | At email launch            | Verified sender                                |
| `RATE_LIMIT_SALT`                  | Yes                        | At least 32 random characters                  |
| `STORAGE_DRIVER`                   | Yes                        | `cloudflare-r2`                                |
| `FULFILLMENT_PROVIDER`             | Yes                        | `MANUAL`, `ORDER_DESK`, or `BAY_PHOTO`         |

## Deployment gates

Before attaching the custom domain:

- typecheck, unit tests, and build pass;
- D1 migrations apply successfully;
- public pages pass on the workers.dev URL;
- checkout remains disabled;
- a previous DNS value is recorded for rollback.

Before enabling checkout:

- all sample content is removed or remains unpublished;
- real products, variants, prices, inventory, editions, and shipping classes are approved;
- Stripe test-mode purchase, cancellation, webhook, refund, and inventory workflows pass;
- email sender domain and templates are verified;
- tax, shipping, returns, privacy, terms, accessibility, and fulfillment are reviewed;
- D1 and R2 backups exist;
- `REQUIRE_PRODUCTION_CONFIGURATION=true` passes during build and runtime.

## Stripe webhook

Use:

```text
https://memorieswithmike.com/api/stripe/webhook
```

Subscribe to `checkout.session.completed`. Store the destination signing secret with `wrangler secret put STRIPE_WEBHOOK_SECRET`; never use the Stripe API secret as a webhook secret.
