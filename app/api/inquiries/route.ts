import { NextResponse } from "next/server";
import { clientAddress, database, sha256 } from "@/lib/platform";
import { emailTemplates, sendEmail } from "@/lib/email";
import { inquirySchema } from "@/lib/validation";
import { isSameOriginMutation } from "@/lib/security";
import { getPhotograph } from "@/lib/catalog";
import { inquiryMessage } from "@/lib/inquiry-details";
import { getRoadStory } from "@/lib/tales";

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const parsed = inquirySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please review the inquiry fields." }, { status: 400 });
    if (parsed.data.storySlug && !getRoadStory(parsed.data.storySlug)) return NextResponse.json({ error: "That story is unavailable. Please select a published story." }, { status: 400 });
    const db = database();
    const ipHash = await sha256(`${process.env.RATE_LIMIT_SALT ?? "local"}:${clientAddress(request)}`);
    const windowStart = Date.now() - 10 * 60 * 1000;
    const recent = await db
      .prepare("SELECT COUNT(*) AS count FROM inquiries WHERE source_ip_hash = ? AND created_at > ?")
      .bind(ipHash, windowStart)
      .first<{ count: number }>();
    if ((recent?.count ?? 0) >= 5)
      return NextResponse.json({ error: "Please wait before sending another inquiry." }, { status: 429 });
    const value = parsed.data;
    const image = value.imageSlug ? await getPhotograph(value.imageSlug) : undefined;
    if (value.imageSlug && !image) return NextResponse.json({ error: "That photograph is unavailable. Please choose another image." }, { status: 400 });
    const id = crypto.randomUUID();
    const now = Date.now();
    await db
      .prepare(
        "INSERT INTO inquiries (id,name,email,phone,service_type,event_date,location,group_size,budget_range,message,referral_source,consent_at,status,source_ip_hash,created_at,updated_at,company,company_website,partnership_type,project_timing) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(
        id,
        value.name,
        value.email.toLowerCase(),
        value.phone ?? null,
        value.serviceType,
        value.eventDate ?? null,
        value.location,
        value.groupSize ?? null,
        value.budget ?? null,
        inquiryMessage(value, image),
        value.referral ?? null,
        now,
        "NEW",
        ipHash,
        now,
        now,
        value.company ?? null,
        value.companyWebsite ?? null,
        value.partnershipType ?? null,
        value.projectTiming ?? null,
      )
      .run();
    const confirmation = emailTemplates.inquiryConfirmation(value.name);
    confirmation.to = value.email;
    const notification = emailTemplates.inquiryNotification(value.name, value.serviceType);
    notification.to = process.env.ADMIN_NOTIFICATION_EMAIL ?? "michael.kennedy@ku.edu";
    await Promise.allSettled([sendEmail(confirmation), sendEmail(notification)]);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Inquiry submission failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "The inquiry could not be sent." }, { status: 500 });
  }
}
