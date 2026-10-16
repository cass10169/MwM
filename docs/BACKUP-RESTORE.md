# Backup and restoration

Back up the database, object storage, environment inventory, and source revision together. A database export without its referenced R2 objects is incomplete.

## Database backup

For the Cloudflare D1 database:

```bash
npx wrangler d1 export memories-with-mike --remote --output backups/memories-with-mike.sql
```

Record:

- UTC timestamp
- hosted project and environment
- source revision or checkpoint
- migration journal state
- row counts for orders, order items, payments, fulfillments, photographs, assets, products, variants, inquiries, and subscribers
- export checksum

Store exports encrypted in an access-controlled backup location. Do not commit them.

## Object-storage backup

Use an S3-compatible copy tool configured for the R2 bucket to copy every photographs prefix to a versioned backup bucket or encrypted local archive. Credentials must be provided through the tool’s private configuration, never command history.

Verify that:

- object count matches the source
- total bytes are plausible
- several JPEG, WebP, AVIF, and PNG samples decode
- object metadata and content type are present
- photograph_assets object keys exist in the backup

Master print files are outside this application and need their own independent 3-2-1 backup strategy.

## Environment inventory

Record variable names and provider account references, not secret values, in the operational runbook:

- Cloudflare account and Worker
- custom domain and DNS provider
- Stripe account, webhook destination, and shipping-rate IDs
- email provider domain and sender
- analytics property
- R2 bucket and D1 database
- fulfillment provider account
- administrator allowlist owner

Secret recovery should come from the provider’s protected credential store or a password manager.

## Restore to a clean environment

1. Create a new isolated environment.
2. Deploy the exact source revision associated with the backup.
3. Let schema migrations create an empty database.
4. Disable public checkout and enable maintenance mode.
5. Import the SQL export using the host’s D1 restore workflow or:

```bash
npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file backups/memories-with-mike.sql
```

6. Restore R2 objects with their original keys and metadata.
7. Configure non-production Stripe and email credentials first.
8. Compare row counts and asset-reference coverage.
9. Test public gallery, media transforms, admin authorization, cart, mocked checkout, order lookup, and CSV export.
10. Reconcile payment and fulfillment state with Stripe and the lab.
11. Switch live credentials only after approval.
12. Disable maintenance mode and re-enable checkout last.

## Point-in-time recovery cautions

- Restoring the database without R2 may create broken media references.
- Restoring R2 without the matching database may leave unreferenced objects.
- Replaying a webhook after restoring an earlier database can recreate state only if its event ledger was also rolled back; reconcile before retry.
- Never decrement a limited edition twice while repairing an order.
- Do not overwrite a newer production database during a drill.

## Schedule

Recommended starting policy, subject to final retention and business review:

- database export daily while orders are active
- object-storage incremental backup daily after uploads
- pre-deployment backup before schema or checkout changes
- monthly restore drill to an isolated environment
- annual review of retention, encryption, access, and provider recovery procedures
