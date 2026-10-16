import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
import { canTransitionFulfillment } from "@/lib/domain";
import { emailTemplates, sendEmail } from "@/lib/email";
const schema = z.object({
  status: z.enum(["READY", "SUBMITTED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"]),
  providerOrderId: z.string().max(160).optional(),
  carrier: z.string().max(80).optional(),
  trackingNumber: z.string().max(160).optional(),
  trackingUrl: z.url().optional(),
  internalNotes: z.string().max(5000).optional(),
});
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid fulfillment update." }, { status: 400 });
  const { id } = await params;
  const db = database();
  const current = await db
    .prepare("SELECT number,email,fulfillment_status FROM orders WHERE id=?")
    .bind(id)
    .first<{ number: string; email: string; fulfillment_status: string }>();
  if (!current) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (!canTransitionFulfillment(current.fulfillment_status, parsed.data.status))
    return NextResponse.json({ error: "That fulfillment transition is not allowed." }, { status: 409 });
  const now = Date.now();
  await db.batch([
    db
      .prepare(
        "UPDATE orders SET fulfillment_status=?,internal_notes=COALESCE(?,internal_notes),updated_at=? WHERE id=?",
      )
      .bind(parsed.data.status, parsed.data.internalNotes ?? null, now, id),
    db
      .prepare(
        "UPDATE fulfillments SET status=?,provider_order_id=COALESCE(?,provider_order_id),tracking_carrier=COALESCE(?,tracking_carrier),tracking_number=COALESCE(?,tracking_number),tracking_url=COALESCE(?,tracking_url),submitted_at=CASE WHEN ?='SUBMITTED' THEN ? ELSE submitted_at END,shipped_at=CASE WHEN ?='SHIPPED' THEN ? ELSE shipped_at END,delivered_at=CASE WHEN ?='DELIVERED' THEN ? ELSE delivered_at END,updated_at=? WHERE order_id=?",
      )
      .bind(
        parsed.data.status,
        parsed.data.providerOrderId ?? null,
        parsed.data.carrier ?? null,
        parsed.data.trackingNumber ?? null,
        parsed.data.trackingUrl ?? null,
        parsed.data.status,
        now,
        parsed.data.status,
        now,
        parsed.data.status,
        now,
        now,
        id,
      ),
    db
      .prepare(
        "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        null,
        "FULFILLMENT_STATUS",
        "ORDER",
        id,
        `Fulfillment updated by ${user.email}`,
        JSON.stringify({ from: current.fulfillment_status, to: parsed.data.status }),
        now,
      ),
  ]);
  const message =
    parsed.data.status === "SHIPPED"
      ? emailTemplates.shippingConfirmation(current.number, parsed.data.trackingNumber ?? "Tracking will follow")
      : emailTemplates.productionUpdate(current.number, parsed.data.status.toLowerCase().replaceAll("_", " "));
  await sendEmail({ ...message, to: current.email });
  return NextResponse.json({ status: parsed.data.status });
}
