# Deploy Memories with Mike to Cloudflare

This package is a separate Cloudflare-native copy. Deploying it creates a new Worker; it does not alter the existing ChatGPT-hosted site. The storefront is safe for a first preview: checkout is disabled, sample products cannot be purchased, and production-only services are not required.

## What you will create

| Cloudflare resource | Name in this guide         | Purpose                                                       |
| ------------------- | -------------------------- | ------------------------------------------------------------- |
| Worker              | `memories-with-mike`       | Runs the website and API                                      |
| D1 database         | `memories-with-mike`       | Stores photographs, products, settings, orders, and inquiries |
| R2 bucket           | `memories-with-mike-media` | Stores uploaded display images                                |
| Images binding      | `IMAGES`                   | Creates responsive image transformations                      |
| Access application  | `Memories with Mike Admin` | Protects `/admin` and `/api/admin`                            |

## Before you begin

You need:

- a Cloudflare account with `memorieswithmike.com` active in Cloudflare DNS;
- Node.js 22.13 or newer;
- npm, which is installed with Node.js;
- permission to create Workers, D1, R2, Images, and Zero Trust Access resources.

On Windows, install the current Node.js 22 LTS installer, then restart PowerShell. Verify:

```powershell
node --version
npm --version
```

The Node result must be `v22.13.0` or newer. Extract this ZIP to a normal folder such as `Documents\memories-with-mike-cloudflare`. In File Explorer, open that folder, click the address bar, type `powershell`, and press Enter.

## 1. Install and sign in

Run these commands from the extracted project folder:

```powershell
npm ci
npx wrangler login
npm run cloudflare:whoami
```

The login command opens a browser. Approve access to the Cloudflare account that owns `memorieswithmike.com`. The final command should show the expected account.

## 2. Create D1 and R2

Create the database:

```powershell
npx wrangler d1 create memories-with-mike
```

Cloudflare prints a `database_id` UUID. Keep the terminal open; you will paste that value into the configuration helper.

Create the media bucket:

```powershell
npx wrangler r2 bucket create memories-with-mike-media
```

If Cloudflare asks you to activate R2 or Images, open the Cloudflare dashboard and finish that account-level activation. Do not create a public R2 URL; this application serves approved media through the Worker.

## 3. Protect the studio manager with Cloudflare Access

Do this before attaching the public domain.

1. Open the Cloudflare dashboard and select **Zero Trust**.
2. If prompted, choose a Zero Trust team name. Record the resulting team domain, such as `https://your-team.cloudflareaccess.com`.
3. Under **Settings → Authentication**, enable **One-time PIN** unless you already use a supported identity provider.
4. Go to **Access controls → Applications**, choose **Create new application**, then **Self-hosted and private**.
5. Name it `Memories with Mike Admin`.
6. Select **Add public hostname**. Choose `memorieswithmike.com` and enter the path `admin*`. Add a second public hostname in the same application with the same domain and path `api/admin*`.
7. Add an **Allow** policy whose include rule is **Emails** and enter `michael.kennedy@ku.edu`.
8. Save the application.
9. Open the saved application, open **Additional settings**, and copy its **Application Audience (AUD) Tag**.

Both paths must belong to the same Access application so they use the same audience tag. Cloudflare Access performs the sign-in challenge; the Worker then verifies the signed Access token and independently checks `ADMIN_EMAIL_ALLOWLIST`.

## 4. Fill in the Cloudflare IDs

Run:

```powershell
npm run cloudflare:configure
```

Paste, in order:

1. the D1 `database_id` UUID from step 2;
2. the Zero Trust team name or full `https://...cloudflareaccess.com` domain;
3. the Access application AUD tag from step 3.

The helper updates `wrangler.json`. Confirm that none of these placeholders remain:

- `00000000-0000-4000-8000-000000000000`
- `replace-me.cloudflareaccess.com`
- `replace-with-access-audience-tag`

Do not put Stripe, Resend, or other secret keys in `wrangler.json`.

## 5. Create the database tables

Apply the included migrations to the remote D1 database:

```powershell
npm run db:migrate:remote
```

Approve the prompt. Migrations `0000` and `0001` create the schema and safe starter records. Starter photographs and products remain drafts or inactive.

## 6. Verify the package locally

Run:

```powershell
npm run typecheck
npm run test:unit
npm run build
```

All commands must exit successfully. The build ends with:

```text
Validated Cloudflare artifact: Worker default.fetch and all required bindings are present.
```

If the build fails, stop and use the troubleshooting section below. Do not attach the domain to a failed build.

## 7. Deploy a temporary test version

Deploy the Worker:

```powershell
npm run deploy
```

Wrangler prints a URL ending in `.workers.dev`. That preview URL is publicly reachable, so do not enter real customer data or enable checkout. Open it and test the public site. The custom domain still points wherever it pointed before this step.

On the workers.dev address, verify:

- home, portfolio, prints, about, services, FAQ, and contact pages load;
- navigation works on desktop and mobile;
- the cart opens and checkout reports that sales are not yet enabled;
- no real customer information is submitted during this test;
- browser developer tools show no repeating server errors.

The Access application was created for `memorieswithmike.com`, so `/admin` is tested after the custom-domain step.

## 8. Attach the Cloudflare-managed domain

Only do this after the workers.dev checks pass. This is the step that sends real visitors to the new Worker.

1. In Cloudflare, open **Workers & Pages** and select `memories-with-mike`.
2. Open **Settings → Domains & Routes**.
3. Choose **Add → Custom Domain**.
4. Enter `memorieswithmike.com` and confirm.
5. If Cloudflare reports a conflicting DNS record, take a screenshot or copy its current value before replacing it. Remove only the conflicting apex record that currently routes the website; do not remove MX, email, verification, or unrelated records.
6. Wait until the custom domain shows **Active** and its TLS certificate is ready.

For `www.memorieswithmike.com`, choose one of these approaches:

- preferred: create a Cloudflare Redirect Rule that sends `www` to `https://memorieswithmike.com` with status 301;
- alternatively: add `www.memorieswithmike.com` as a second Worker custom domain, and add equivalent `www` paths to the Access application.

Because the domain already uses Cloudflare nameservers, no additional change is normally required in GoDaddy. GoDaddy remains the registrar; Cloudflare is the authoritative DNS and hosting control plane.

## 9. Test the real domain and administrator login

Open a private/incognito browser window and check:

```text
https://memorieswithmike.com
https://memorieswithmike.com/admin
```

For `/admin`, Cloudflare should show an Access sign-in page. Request a one-time PIN for `michael.kennedy@ku.edu`, enter the code, and confirm that the Studio Manager overview opens.

If the public site works but `/admin` displays “Administrator access is required,” check all four items:

1. both `/admin*` and `/api/admin*` are attached to the same Access application;
2. the Access policy allows `michael.kennedy@ku.edu`;
3. `CLOUDFLARE_ACCESS_TEAM_DOMAIN` in `wrangler.json` exactly matches the team domain;
4. `CLOUDFLARE_ACCESS_AUD` exactly matches the application audience tag.

After changing `wrangler.json`, run `npm run deploy` again.

## 10. Add a rate-limit secret

Generate a long random value in PowerShell:

```powershell
$bytes = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

Copy the result, then run:

```powershell
npx wrangler secret put RATE_LIMIT_SALT
```

Paste the value when prompted. Input is hidden. Do not add it to `wrangler.json`, `.env.example`, source control, screenshots, or support messages.

## 11. Keep checkout disabled for the first launch

The package ships with:

```text
ENABLE_SAMPLE_CHECKOUT=false
REQUIRE_PRODUCTION_CONFIGURATION=false
```

Leave those values unchanged during the preview and content-entry phase. In `/admin`:

1. replace all sample photographs and text;
2. upload web-sized display derivatives, not RAW master files;
3. verify product materials, sizes, prices, inventory, shipping classes, and edition rules;
4. review privacy, terms, returns, accessibility, tax, and fulfillment workflows.

Do not enable checkout in Studio Manager until Stripe, email, shipping, tax, and fulfillment testing is complete.

## 12. Configure payments and email later

When ready, add secrets one at a time:

```powershell
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put RESEND_API_KEY
```

Add non-secret values under `vars` in `wrangler.json`:

- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SHIPPING_RATE_IDS`
- `EMAIL_FROM`

Create the Stripe webhook destination:

```text
https://memorieswithmike.com/api/stripe/webhook
```

Subscribe it to `checkout.session.completed`, then use that destination's signing secret as `STRIPE_WEBHOOK_SECRET`. Test the complete purchase, cancellation, webhook, email, inventory, refund, and fulfillment flow in Stripe test mode.

Only after every launch requirement is filled in should you change `REQUIRE_PRODUCTION_CONFIGURATION` to `true`, deploy again, and enable checkout in Studio Manager.

## Updating the site

For future code changes:

```powershell
npm ci
npm run typecheck
npm run test:unit
npm run deploy
```

Database migrations are separate. Run `npm run db:migrate:remote` only when the package includes a new reviewed migration.

## Rollback

If a deployment is unhealthy but the domain still resolves:

1. open the Worker in **Workers & Pages**;
2. open **Deployments**;
3. choose the previous healthy version and roll it back;
4. leave checkout disabled while investigating.

If the domain cutover itself is the problem, restore only the apex website DNS record you copied in step 8. Do not change Cloudflare nameservers at GoDaddy as a quick rollback; that would also affect every other DNS record.

## Troubleshooting

### `npm` or `node` is not recognized

Install Node.js 22 LTS, close every PowerShell window, open a new one, and retry.

### Wrangler is logged into the wrong account

Run `npx wrangler logout`, then `npx wrangler login`, and select the Cloudflare account that owns the domain.

### D1 binding is unavailable

Confirm that the D1 UUID in `wrangler.json` is the UUID returned for `memories-with-mike`, then run:

```powershell
npm run db:migrate:remote
npm run deploy
```

### Image uploads fail

Confirm the R2 bucket is named `memories-with-mike-media`, R2 is active, and the `BUCKET` and `IMAGES` bindings appear in the latest Worker deployment. Upload JPEG, PNG, WebP, or AVIF under 20 MB.

### Access keeps redirecting or the dashboard says access is required

Re-copy the team domain and AUD tag, confirm the paths and email policy, run `npm run cloudflare:configure` again, and redeploy. Never work around this by trusting a client-supplied email header.

### A deployment reports a Worker exception

Open **Workers & Pages → memories-with-mike → Logs**, reproduce the request once, and note the request ID and sanitized error. Do not post secret values or customer data in a support message.

## Official Cloudflare references

- [Workers Vite deployment](https://developers.cloudflare.com/workers/vite-plugin/get-started/)
- [Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Self-hosted Access applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
- [Validate Cloudflare Access JWTs](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
