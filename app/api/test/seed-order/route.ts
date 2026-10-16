import { NextResponse } from "next/server";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_E2E_FIXTURES !== "true")
    return new Response("Not found", { status: 404 });
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const db = database();
  const now = Date.now();
  const id = crypto.randomUUID();
  const number = `MWM-E2E-${id.slice(0, 6).toUpperCase()}`;
  await db.batch([
    db
      .prepare(
        "INSERT INTO orders (id,number,email,currency,status,fulfillment_status,subtotal_cents,discount_cents,shipping_cents,tax_cents,total_cents,paid_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(id, number, "e2e-customer@example.com", "USD", "PAID", "READY", 18500, 0, 0, 0, 18500, now, now, now),
    db
      .prepare(
        "INSERT INTO payments (id,order_id,provider,provider_payment_id,status,amount_cents,currency,refunded_cents,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(crypto.randomUUID(), id, "TEST", `pi_test_${id}`, "PAID", 18500, "USD", 0, now, now),
    db
      .prepare("INSERT INTO fulfillments (id,order_id,provider,status,created_at,updated_at) VALUES (?,?,?,?,?,?)")
      .bind(crypto.randomUUID(), id, "MANUAL", "READY", now, now),
  ]);
  return NextResponse.json({ id, number }, { status: 201 });
}
