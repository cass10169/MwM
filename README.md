# Memories with Mike

A Cloudflare-native fine-art photography portfolio, print storefront, journal, inquiry system, and protected studio manager for Michael Kennedy in Lawrence, Kansas.

Start with [CLOUDFLARE-DEPLOYMENT.md](./CLOUDFLARE-DEPLOYMENT.md). It contains the complete Windows-friendly setup, preview, custom-domain, Cloudflare Access, rollback, Stripe, and email instructions.

## Architecture

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, and accessible native primitives
- Vinext and Cloudflare Workers
- Cloudflare D1 with Drizzle ORM and included migrations
- Cloudflare R2 for private display assets
- Cloudflare Images for responsive transformations
- Cloudflare Access JWT verification plus an exact administrator email allowlist
- Stripe Checkout with server-owned prices, signed webhooks, automatic tax support, and idempotent processing
- Resend-compatible transactional email abstraction
- Vitest, Playwright, and axe-core coverage

Checkout and sample products are disabled by default. The current hosted website is unaffected until the Cloudflare Worker custom domain is explicitly attached.

## Local development

```bash
npm ci
npm run typecheck
npm run dev
```

The Cloudflare bindings are defined in `wrangler.json`. The placeholder D1 UUID is sufficient for local emulation; replace it with the real UUID before a remote migration or deployment.

## Verification

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run validate:artifact
```

## Documentation

- `CLOUDFLARE-DEPLOYMENT.md` — start-to-finish deployment and domain guide
- `docs/ARCHITECTURE.md` — boundaries and data flow
- `docs/DEPLOYMENT.md` — launch configuration reference
- `docs/IMAGE-PREPARATION.md` — derivative and master-file handling
- `docs/FULFILLMENT.md` — manual workflow and provider boundaries
- `docs/SECURITY.md` — threat model and hardening checklist
- `docs/BACKUP-RESTORE.md` — D1 and R2 recovery
- `docs/TROUBLESHOOTING.md` — common failures
