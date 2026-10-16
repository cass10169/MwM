# Fulfillment guide

## Default: manual fulfillment

Manual fulfillment works without a lab API.

1. Stripe confirms payment through the signed webhook.
2. The application creates the order, immutable line snapshots, payment record, and a MANUAL fulfillment in READY status.
3. Open /admin/orders.
4. Review the recipient, product, SKU, selected options, quantity, and internal notes.
5. Export the CSV. The export contains one row per order line plus order totals, address snapshot, provider fields, and tracking fields.
6. Submit the approved print-production file and order details through the lab’s secure process.
7. Change the order from READY to SUBMITTED and save the lab order number.
8. Change it to IN_PRODUCTION when the lab confirms production.
9. Add carrier, tracking number, and an HTTPS tracking URL when changing it to SHIPPED.
10. Mark it DELIVERED after confirmation when appropriate.

Every transition is validated against:

```text
READY -> SUBMITTED or CANCELLED
SUBMITTED -> IN_PRODUCTION or CANCELLED
IN_PRODUCTION -> SHIPPED or CANCELLED
SHIPPED -> DELIVERED
```

Invalid skips are rejected by the server. Production and shipping updates trigger branded customer email. Administrators can resend order, production, and shipping messages.

## Refunds

The order manager supports:

- issuing a Stripe refund against the stored payment intent
- recording a refund that was issued outside the application
- partial and full refund state
- prevention of refunds above the remaining paid amount
- idempotent Stripe refund keys
- customer refund confirmation
- audit history

Test both issue and record-only paths in Stripe test mode. A record-only refund does not move money.

## CSV safety

All cells are quoted, embedded quotations are escaped, and string values beginning with spreadsheet formula characters are prefixed to prevent formula execution. Treat exported files as customer data: store them only in approved locations and remove them according to the final retention policy.

## Provider contract

lib/fulfillment.ts defines:

```ts
interface FulfillmentProvider {
  name: "MANUAL" | "ORDER_DESK" | "BAY_PHOTO";
  submit(order: FulfillmentOrder): Promise<FulfillmentSubmission>;
}
```

FulfillmentOrder contains the internal order ID, public order number, recipient, SKU, title, quantity, and selected options. Provider adapters must return a provider order ID and normalized state.

## Order Desk

The OrderDeskFulfillmentProvider checks configuration, logs only order number and item count, and then stops with an explicit setup error. It does not invent an endpoint.

Before implementation:

1. Obtain current official account-specific API documentation.
2. Verify base URL, authentication headers, order schema, idempotency behavior, retry guidance, and webhook behavior.
3. Map every internal option to a tested Order Desk SKU or variation.
4. Add contract fixtures with personal information removed.
5. Redact authorization headers, addresses, emails, phone numbers, gift notes, and full payloads from logs.
6. Test timeouts, duplicate submission, provider rejection, partial failure, and reconciliation.

Only then set FULFILLMENT_PROVIDER=ORDER_DESK.

## Bay Photo

The BayPhotoFulfillmentProvider follows the same fail-closed approach. No public or undocumented production endpoint is fabricated.

Obtain verified partner documentation and confirm:

- account authorization and production access
- supported product codes, crops, color correction, mounting, framing, and shipping methods
- print-file transfer mechanism
- lab order status and tracking callbacks
- duplicate-order protections
- cancellation and remake procedures

Only then implement and test the isolated adapter before selecting BAY_PHOTO.

## Operational reconciliation

At least daily while orders are active:

- compare paid Stripe sessions with application payments
- compare READY and SUBMITTED orders with lab records
- investigate FAILED webhook events
- verify inventory and limited-edition sold counts
- verify shipped orders have correct tracking
- export a reconciliation CSV before any bulk correction

Never edit an old order-item snapshot to match a newer catalog definition.
