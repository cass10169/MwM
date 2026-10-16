import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
import { emailTemplates, sendEmail } from "@/lib/email";
const schema = z.object({
  amountCents: z.number().int().positive(),
  recordOnly: z.boolean(),
  reason: z.string().max(500).optional(),
});
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid refund amount." }, { status: 400 });
  const { id } = await params;
  const db = database();
  const payment = await db
    .prepare(
      "SELECT p.id,p.provider_payment_id,p.amount_cents,p.refunded_cents,o.number,o.email FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.order_id=? ORDER BY p.created_at DESC LIMIT 1",
    )
    .bind(id)
    .first<{
      id: string;
      provider_payment_id: string;
      amount_cents: number;
      refunded_cents: number;
      number: string;
      email: string;
    }>();
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  if (parsed.data.amountCents > payment.amount_cents - payment.refunded_cents)
    return NextResponse.json({ error: "Refund exceeds the remaining paid amount." }, { status: 409 });
  let providerRefundId: string | null = null;
  if (!parsed.data.recordOnly) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret)
      return NextResponse.json(
        { error: "Stripe is not configured; use record-only mode for an external refund." },
        { status: 503 },
      );
    const stripe = new Stripe(secret, { apiVersion: "2025-11-17.clover", httpClient: Stripe.createFetchHttpClient() });
    const refund = await stripe.refunds.create(
      {
        payment_intent: payment.provider_payment_id,
        amount: parsed.data.amountCents,
        metadata: { orderId: id, administrator: user.email },
      },
      { idempotencyKey: `refund-${id}-${payment.refunded_cents}-${parsed.data.amountCents}` },
    );
    providerRefundId = refund.id;
  }
  const refunded = payment.refunded_cents + parsed.data.amountCents;
  const status = refunded === payment.amount_cents ? "REFUNDED" : "PARTIALLY_REFUNDED";
  const now = Date.now();
  await db.batch([
    db
      .prepare("UPDATE payments SET refunded_cents=?,status=?,updated_at=? WHERE id=?")
      .bind(refunded, status, now, payment.id),
    db.prepare("UPDATE orders SET status=?,updated_at=? WHERE id=?").bind(status, now, id),
    db
      .prepare(
        "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        null,
        "REFUND",
        "ORDER",
        id,
        `Refund recorded by ${user.email}`,
        JSON.stringify({
          amountCents: parsed.data.amountCents,
          recordOnly: parsed.data.recordOnly,
          providerRefundId,
          reason: parsed.data.reason,
        }),
        now,
      ),
  ]);
  await sendEmail({ ...emailTemplates.refundConfirmation(payment.number), to: payment.email });
  return NextResponse.json({ status, refundedCents: refunded, providerRefundId });
}
