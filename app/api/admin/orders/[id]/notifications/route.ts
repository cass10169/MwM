import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
import { emailTemplates, sendEmail } from "@/lib/email";
const schema = z.object({ template: z.enum(["ORDER_CONFIRMATION", "PRODUCTION_UPDATE", "SHIPPING_CONFIRMATION"]) });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid notification." }, { status: 400 });
  const { id } = await params;
  const row = await database()
    .prepare(
      "SELECT o.number,o.email,o.fulfillment_status,f.tracking_number FROM orders o LEFT JOIN fulfillments f ON f.order_id=o.id WHERE o.id=?",
    )
    .bind(id)
    .first<{ number: string; email: string; fulfillment_status: string; tracking_number: string | null }>();
  if (!row) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const template =
    parsed.data.template === "ORDER_CONFIRMATION"
      ? emailTemplates.orderConfirmation(row.number)
      : parsed.data.template === "SHIPPING_CONFIRMATION"
        ? emailTemplates.shippingConfirmation(row.number, row.tracking_number ?? "Tracking will follow")
        : emailTemplates.productionUpdate(row.number, row.fulfillment_status.toLowerCase().replaceAll("_", " "));
  await sendEmail({ ...template, to: row.email });
  return NextResponse.json({ sent: true });
}
