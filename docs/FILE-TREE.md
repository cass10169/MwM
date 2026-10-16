# Project file tree

Generated artifacts (`dist`, reports, caches, local bindings, and `node_modules`) are omitted.

```text
memories-with-mike-cloudflare/
├── .openai/drizzle/             # D1 SQL migrations and migration metadata
├── app/                         # Next.js routes, API endpoints, and Cloudflare Access adapter
├── components/                  # Public and administrator UI
├── db/                          # Drizzle schema and standalone seed
├── docs/                        # Architecture, security, operations, and content guides
├── lib/                         # Domain, persistence, commerce, storage, and security services
├── public/                      # Static public assets
├── scripts/
│   ├── bootstrap-admin.mjs
│   ├── build-verified.mjs
│   ├── bundle-report.mjs
│   ├── configure-cloudflare.mjs
│   └── validate-artifact.mjs
├── tests/                       # Unit, render, browser, and accessibility tests
├── worker/index.ts              # Cloudflare Worker entry point
├── CLOUDFLARE-DEPLOYMENT.md     # Start-to-finish deployment guide
├── START-HERE.txt
├── package.json
├── vite.config.ts
└── wrangler.json                # Worker resources, bindings, and public variables
```
