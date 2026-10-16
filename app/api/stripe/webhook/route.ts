import { NextResponse } from "next/server";
import Stripe from "stripe";
import { database } from "@/lib/platform";
import { emailTemplates, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const stripe = new Stripe(secret, { apiVersion: "2025-11-17.clover", httpClient: Stripe.createFetchHttpClient() });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
  const db = database();
  const now = Date.now();
  const existing = await db
    .prepare("SELECT status FROM webhook_events WHERE id = ?")
    .bind(event.id)
    .first<{ status: string }>();
  if (existing?.status === "PROCESSED") return NextResponse.json({ received: true, duplicate: true });
  await db
    .prepare(
      "INSERT INTO webhook_events (id,provider,event_type,status,created_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status='PROCESSING',updated_at=excluded.updated_at",
    )
    .bind(event.id, "STRIPE", event.type, "PROCESSING", now, now)
    .run();
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const already = await db
        .prepare("SELECT id FROM payments WHERE provider_payment_id = ?")
        .bind(String(session.payment_intent ?? session.id))
        .first();
      if (!already) {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"],
          limit: 100,
        });
        const orderId = crypto.randomUUID();
        const number = `MWM-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${orderId.slice(0, 6).toUpperCase()}`;
        const subtotal = session.amount_subtotal ?? 0;
        const total = session.amount_total ?? subtotal;
        const tax = session.total_details?.amount_tax ?? 0;
        const discount = session.total_details?.amount_discount ?? 0;
        const shipping = session.total_details?.amount_shipping ?? 0;
        const sessionWithShipping = session as Stripe.Checkout.Session & {
          collected_information?: { shipping_details?: { name?: string | null; address?: Stripe.Address | null } };
        };
        const shippingDetails = sessionWithShipping.collected_information?.shipping_details;
        const shippingAddress = shippingDetails?.address ?? session.customer_details?.address;
        const address = shippingAddress
          ? JSON.stringify({ name: shippingDetails?.name ?? session.customer_details?.name, ...shippingAddress })
          : null;
        const billingAddress = session.customer_details?.address
          ? JSON.stringify({ name: session.customer_details.name, ...session.customer_details.address })
          : null;
        const customerEmail = (session.customer_details?.email ?? session.customer_email ?? "").toLowerCase();
        const existingCustomer = customerEmail
          ? await db
              .prepare(
                "SELECT id FROM customers WHERE lower(email)=? AND deleted_at IS NULL ORDER BY created_at LIMIT 1",
              )
              .bind(customerEmail)
              .first<{ id: string }>()
          : null;
        const customerId = existingCustomer?.id ?? crypto.randomUUID();
        const statements: D1PreparedStatement[] = [];
        if (existingCustomer)
          statements.push(
            db
              .prepare(
                "UPDATE customers SET name=COALESCE(?,name),phone=COALESCE(?,phone),stripe_customer_id=COALESCE(?,stripe_customer_id),updated_at=? WHERE id=?",
              )
              .bind(
                session.customer_details?.name ?? null,
                session.customer_details?.phone ?? null,
                typeof session.customer === "string" ? session.customer : null,
                now,
                customerId,
              ),
          );
        else
          statements.push(
            db
              .prepare(
                "INSERT INTO customers (id,email,name,phone,stripe_customer_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?)",
              )
              .bind(
                customerId,
                customerEmail,
                session.customer_details?.name ?? null,
                session.customer_details?.phone ?? null,
                typeof session.customer === "string" ? session.customer : null,
                now,
                now,
              ),
          );
        if (shippingAddress?.line1 && shippingAddress.city && shippingAddress.postal_code && shippingAddress.country)
          statements.push(
            db
              .prepare(
                "INSERT INTO addresses (id,customer_id,kind,name,line1,line2,city,region,postal_code,country,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
              )
              .bind(
                crypto.randomUUID(),
                customerId,
                "SHIPPING",
                shippingDetails?.name ?? session.customer_details?.name ?? customerEmail,
                shippingAddress.line1,
                shippingAddress.line2 ?? null,
                shippingAddress.city,
                shippingAddress.state ?? null,
                shippingAddress.postal_code,
                shippingAddress.country,
                now,
                now,
              ),
          );
        statements.push(
          db
            .prepare(
              "INSERT INTO orders (id,number,customer_id,email,currency,status,fulfillment_status,subtotal_cents,discount_cents,shipping_cents,tax_cents,total_cents,gift_note,shipping_address_json,billing_address_json,paid_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            )
            .bind(
              orderId,
              number,
              customerId,
              customerEmail,
              session.currency?.toUpperCase() ?? "USD",
              "PAID",
              "READY",
              subtotal,
              discount,
              shipping,
              tax,
              total,
              session.metadata?.giftNote ?? null,
              address,
              billingAddress,
              now,
              now,
              now,
            ),
          db
            .prepare(
              "INSERT INTO payments (id,order_id,provider,provider_payment_id,status,amount_cents,currency,refunded_cents,raw_event_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            )
            .bind(
              crypto.randomUUID(),
              orderId,
              "STRIPE",
              String(session.payment_intent ?? session.id),
              "PAID",
              total,
              session.currency?.toUpperCase() ?? "USD",
              0,
              event.id,
              now,
              now,
            ),
          db
            .prepare(
              "INSERT INTO fulfillments (id,order_id,provider,status,created_at,updated_at) VALUES (?,?,?,?,?,?)",
            )
            .bind(crypto.randomUUID(), orderId, "MANUAL", "READY", now, now),
        );
        for (const line of lines.data) {
          const product = typeof line.price?.product === "object" ? (line.price.product as Stripe.Product) : null;
          const unit =
            line.price?.unit_amount ?? Math.round((line.amount_subtotal ?? 0) / Math.max(1, line.quantity ?? 1));
          const variantId = product?.metadata?.variantId || null;
          statements.push(
            db
              .prepare(
                "INSERT INTO order_items (id,order_id,variant_id,product_name,photograph_title,sku,variant_snapshot_json,unit_price_cents,quantity,subtotal_cents,discount_cents,tax_cents,total_cents,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              )
              .bind(
                crypto.randomUUID(),
                orderId,
                variantId,
                product?.name ?? line.description,
                product?.metadata?.photograph ?? line.description,
                product?.metadata?.sku ?? "UNMAPPED",
                JSON.stringify({ description: line.description, productMetadata: product?.metadata ?? {} }),
                unit,
                line.quantity ?? 1,
                line.amount_subtotal ?? unit,
                line.amount_discount ?? 0,
                line.amount_tax ?? 0,
                line.amount_total ?? unit,
                now,
              ),
          );
          if (variantId)
            statements.push(
              db
                .prepare(
                  "UPDATE product_variants SET inventory=CASE WHEN inventory IS NULL THEN NULL ELSE MAX(0,inventory-?) END,updated_at=? WHERE id=?",
                )
                .bind(line.quantity ?? 1, now, variantId),
            );
        }
        await db.batch(statements);
        if (customerEmail) await sendEmail({ ...emailTemplates.orderConfirmation(number), to: customerEmail });
      }
    }
    await db
      .prepare("UPDATE webhook_events SET status='PROCESSED',processed_at=?,updated_at=? WHERE id=?")
      .bind(now, now, event.id)
      .run();
    return NextResponse.json({ received: true });
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : "unknown";
    await db
      .prepare("UPDATE webhook_events SET status='FAILED',failure_reason=?,updated_at=? WHERE id=?")
      .bind(reason, Date.now(), event.id)
      .run();
    console.error("Stripe webhook processing failed", reason);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
