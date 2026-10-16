import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { resolveCheckoutLinesForCheckout } from "@/lib/commerce";
import { checkoutEnabled } from "@/lib/catalog";
import { isSameOriginMutation } from "@/lib/security";

const schema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().max(160).optional(),
        slug: z.string().min(1),
        material: z.string().min(1),
        size: z.string().min(1),
        finish: z.string().max(120).optional(),
        frame: z.string().max(120).optional(),
        quantity: z.number().int().min(1).max(5),
      }),
    )
    .min(1)
    .max(20),
  giftNote: z.string().max(300).optional().default(""),
});

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "The cart contains invalid information." }, { status: 400 });
    if (!(await checkoutEnabled())) return NextResponse.json({ error: "Checkout is not open yet." }, { status: 503 });
    const lines = await resolveCheckoutLinesForCheckout(parsed.data.items);
    const origin = new URL(request.url).origin;
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      if (process.env.NODE_ENV === "production")
        return NextResponse.json({ error: "Checkout is not configured yet." }, { status: 503 });
      return NextResponse.json({ url: `${origin}/order/success?session_id=local_test` });
    }
    const stripe = new Stripe(secret, { apiVersion: "2025-11-17.clover", httpClient: Stripe.createFetchHttpClient() });
    const shippingRateIds = (process.env.STRIPE_SHIPPING_RATE_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: "usd",
            unit_amount: line.unitAmount,
            product_data: {
              name: `${line.title} — ${[line.material, `${line.size} in`, line.finish, line.frame].filter(Boolean).join(", ")}`,
              metadata: { sku: line.sku, variantId: line.variantId, photograph: line.slug },
            },
          },
        })),
        success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/order/cancelled`,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "IT", "ES"] },
        ...(shippingRateIds.length
          ? { shipping_options: shippingRateIds.map((shippingRate) => ({ shipping_rate: shippingRate })) }
          : {}),
        allow_promotion_codes: true,
        metadata: { giftNote: parsed.data.giftNote, source: "memories-with-mike" },
      },
      { idempotencyKey: request.headers.get("idempotency-key") ?? crypto.randomUUID() },
    );
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Checkout could not be started." }, { status: 500 });
  }
}
