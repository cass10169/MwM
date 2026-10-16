import { NextResponse } from "next/server";
import { z } from "zod";
import { clientAddress, database, sha256 } from "@/lib/platform";
import { emailTemplates, sendEmail } from "@/lib/email";
import { isSameOriginMutation } from "@/lib/security";
const schema = z.object({ orderNumber: z.string().trim().min(6).max(40), email: z.email().max(254) });
export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ accepted: true }, { status: 202 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ accepted: true }, { status: 202 });
  try {
    const db = database();
    const now = Date.now();
    const ipHash = await sha256(`${process.env.RATE_LIMIT_SALT ?? "local"}:${clientAddress(request)}`);
    const attempts = await db
      .prepare("SELECT COUNT(*) AS count FROM audit_logs WHERE action='ORDER_LOOKUP' AND ip_hash=? AND created_at>?")
      .bind(ipHash, now - 15 * 60 * 1000)
      .first<{ count: number }>();
    if ((attempts?.count ?? 0) >= 5) return NextResponse.json({ accepted: true }, { status: 202 });
    await db
      .prepare(
        "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,ip_hash,created_at) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(crypto.randomUUID(), null, "ORDER_LOOKUP", "ORDER", null, "Secure order lookup requested", ipHash, now)
      .run();
    const order = await db
      .prepare("SELECT id,number,email FROM orders WHERE number=? AND lower(email)=? AND deleted_at IS NULL")
      .bind(parsed.data.orderNumber, parsed.data.email.toLowerCase())
      .first<{ id: string; number: string; email: string }>();
    if (order) {
      const token = crypto.randomUUID() + crypto.randomUUID();
      const expires = now + 30 * 60 * 1000;
      await db
        .prepare("UPDATE orders SET lookup_token_hash=?,lookup_expires_at=?,updated_at=? WHERE id=?")
        .bind(await sha256(token), expires, now, order.id)
        .run();
      const message = emailTemplates.secureOrderLookup(order.number);
      message.to = order.email;
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
      message.html = message.html.replace(
        "</p>",
        `</p><p><a href="${base}/order/view?token=${encodeURIComponent(token)}">View order securely</a></p>`,
      );
      message.text += ` ${base}/order/view?token=${token}`;
      await sendEmail(message);
    }
    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch {
    return NextResponse.json({ accepted: true }, { status: 202 });
  }
}
