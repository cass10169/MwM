import { NextResponse } from "next/server";
import { z } from "zod";
import { database, sha256 } from "@/lib/platform";
import { emailTemplates, sendEmail } from "@/lib/email";
import { isSameOriginMutation } from "@/lib/security";
const schema = z.object({ email: z.email().max(254) });
export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  try {
    const db = database();
    const email = parsed.data.email.toLowerCase();
    const id = crypto.randomUUID();
    const token = crypto.randomUUID() + crypto.randomUUID();
    const now = Date.now();
    await db
      .prepare(
        "INSERT INTO newsletter_subscribers (id,email,status,confirmation_token_hash,created_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET status='PENDING', confirmation_token_hash=excluded.confirmation_token_hash, updated_at=excluded.updated_at",
      )
      .bind(id, email, "PENDING", await sha256(token), now, now)
      .run();
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const message = emailTemplates.newsletterConfirmation(
      `${base}/newsletter/confirm?token=${encodeURIComponent(token)}`,
    );
    message.to = email;
    await sendEmail(message);
    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch (error) {
    console.error("Newsletter signup failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Subscription could not be started." }, { status: 500 });
  }
}
