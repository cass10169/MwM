# Security and threat model

This document describes application controls, not a certification. Reassess the model whenever authentication, payment, storage, analytics, email, fulfillment, or hosting changes.

## Protected assets

- administrator access and publishing authority
- display derivatives and object keys
- customer contact and shipping information
- product prices, inventory, edition counts, and discount configuration
- Stripe credentials, payments, refunds, and webhook state
- email credentials and recipient lists
- fulfillment credentials and lab orders
- audit records and secure order-lookup tokens

## Trust boundaries

The browser is untrusted. It may alter prices, quantities, product options, paths, file metadata, form fields, or request timing. Stripe, the identity host, email provider, and future fulfillment providers are external systems. D1 and R2 are authoritative managed storage.

## Checkout

Threats:

- forged client prices
- unavailable or mismatched variants
- excessive quantities
- repeated Checkout Session creation
- inventory or limited-edition oversell
- open redirects

Controls:

- client price is display-only
- server resolves active product and exact variant
- all money uses integer minor units
- quantity is restricted to 1 through 5
- live inventory and edition availability are checked before Checkout
- Stripe Checkout uses server-created price_data
- success and cancel paths are same-origin constants
- idempotency key is supplied to Stripe
- checkout is closed by default and controlled by an administrator setting

Residual risk:

Checkout sessions do not reserve inventory. Concurrent buyers could complete payment near the final item. Monitor low inventory and add transactional reservations before selling scarce editions at high volume.

## Administrative access

Threats:

- unauthenticated access
- authenticated but unauthorized workspace users
- cross-site mutation requests
- privilege retained after removal
- leaked administrative data in public indexes

Controls:

- Cloudflare Access establishes identity and the Worker verifies its signed JWT
- exact ADMIN_EMAIL_ALLOWLIST authorization occurs on every protected page and API call
- same-origin and Sec-Fetch-Site checks guard mutations
- no administrator password is created or committed
- admin routes are noindex
- public header and analytics are suppressed in the admin surface
- important changes create audit rows
- removing an email from the allowlist takes effect on the next request

Residual risk:

Authentication login rate limiting and session-cookie attributes are owned by Cloudflare Access. Review its current controls before launch. Add application-managed Auth.js sessions only if moving to a host without equivalent identity.

## Uploads and media

Threats:

- MIME spoofing
- script or SVG upload
- path traversal
- object overwrite
- original-resolution exposure
- decompression or resource exhaustion

Controls:

- administrator authorization
- same-origin mutation check
- JPEG, PNG, WebP, and AVIF allowlist
- signature verification
- 20 MB maximum
- decoded dimensions required
- randomized UUID path segments
- extension chosen from MIME, never filename
- strict media-path regular expression
- SHA-256 checksum and audit entry
- only purpose-made derivative asset kinds are accepted
- output width allowlist and scale-down transforms
- nosniff and restrictive media CSP

Residual risk:

The browser supplies dimensions after decoding. A future high-risk deployment should independently decode and inspect dimensions in an isolated media service and add malware scanning.

## Customer data and order lookup

Threats:

- order-number enumeration
- email-link theft
- indefinite access
- sensitive exports
- verbose errors

Controls:

- lookup always returns the same accepted response
- IP attempts are rate limited with salted one-way hashes
- random 256-bit-equivalent token material is stored only as SHA-256
- links expire after 30 minutes
- view contains order state, line details, and tracking but not full payment data
- CSV export requires administrator authorization
- formula-like CSV values are neutralized
- API failures return generic messages

Set and document retention periods before launch. Remove no-longer-needed inquiries, subscriber records, addresses, lookup hashes, exports, and audit metadata according to the approved policy and legal obligations.

## Webhooks

Threats:

- forged events
- replay
- duplicate order creation
- partial processing
- secret leakage

Controls:

- Stripe signature verification against the raw body
- event ID ledger with PROCESSING, PROCESSED, and FAILED states
- duplicate processed events return without a new order
- provider payment ID is unique
- order, payment, fulfillment, line snapshots, and inventory updates are batched
- logs contain bounded error messages

Operational requirement:

Alert on FAILED or unusually old PROCESSING events and reconcile with Stripe before retrying.

## Discounts and promotion codes

Threats:

- negative totals
- percentages above 100
- expired or exhausted discounts
- client-created codes

Controls:

- domain functions cap discount value and use integer cents
- the active Checkout path delegates customer promotion-code validation to Stripe
- the local discounts table is not trusted by the browser
- total calculations reject negative or noninteger amounts

Do not activate a custom database discount workflow without enforcing dates, usage limits, minimum subtotal, concurrency, and audit behavior in the checkout transaction.

## Fulfillment integrations

Threats:

- duplicate lab orders
- address or gift-note leakage
- forged tracking links
- secret logging
- undocumented API drift

Controls:

- manual fulfillment is the only immediately operational provider
- typed adapters isolate provider logic
- Order Desk and Bay Photo stop until verified documentation is supplied
- status transitions are allowlisted
- tracking URL must be valid
- provider logs contain only order number and item count
- CSV export requires administrator authorization

## HTTP and browser controls

The application sets:

- Content Security Policy
- HSTS in production responses
- frame-ancestors none and X-Frame-Options DENY
- strict-origin-when-cross-origin referrer policy
- X-Content-Type-Options nosniff
- restricted camera, microphone, geolocation, and payment permissions
- HTTPS upgrade directive
- secure host-owned authentication cookies

The current compatibility CSP allows inline scripts and styles because of framework and JSON-LD output. Replacing this with request nonces is a recommended hardening step after confirming Vinext nonce support.

## Secrets and logs

- Keep secrets only in hosted environment configuration or .env.local.
- Never put credentials in site settings, D1, Git, screenshots, exports, or support tickets.
- Use live and test Stripe credentials in separate environments.
- Rotate secrets after any suspected exposure.
- Log event IDs and normalized states, not full webhook, customer, or fulfillment payloads.
- Run npm run audit in CI and before launch.

## Pre-launch checklist

- REQUIRE_PRODUCTION_CONFIGURATION=true
- long random RATE_LIMIT_SALT
- live Stripe webhook signature tested
- administrator allowlist minimized
- no E2E fixture flag in production
- sample checkout flag false
- storage path and signature tests pass
- upload and order APIs reject cross-site requests
- backup and restore drill completed
- dependency audit reviewed
- privacy and retention decisions documented
- CSP sources match only configured providers
- error monitoring configured without customer payloads
