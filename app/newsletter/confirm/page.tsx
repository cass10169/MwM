import type { Metadata } from "next";
import Link from "next/link";
import { database, sha256 } from "@/lib/platform";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  alternates: { canonical: "/newsletter/confirm" }, title: "Confirm Newsletter", robots: { index: false, follow: false } };
export default async function ConfirmNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let confirmed = false;
  if (token && token.length <= 200) {
    try {
      const result = await database()
        .prepare(
          "UPDATE newsletter_subscribers SET status='ACTIVE',confirmed_at=CAST(unixepoch('subsec') * 1000 AS INTEGER),confirmation_token_hash=NULL,updated_at=CAST(unixepoch('subsec') * 1000 AS INTEGER) WHERE confirmation_token_hash=? AND deleted_at IS NULL",
        )
        .bind(await sha256(token))
        .run();
      confirmed = result.meta.changes > 0;
    } catch {}
  }
  return (
    <main id="main-content" className="section section-ivory">
      <div className="container-narrow empty-state">
        {confirmed ? (
          <>
            <p className="eyebrow ink">Subscription confirmed</p>
            <h1>You’ll hear when there is work worth sharing.</h1>
            <p>Thank you for following Memories with Mike.</p>
          </>
        ) : (
          <>
            <p className="eyebrow ink">Confirmation unavailable</p>
            <h1>This confirmation link is invalid or has already been used.</h1>
            <p>Return to the site and submit your email again if needed.</p>
          </>
        )}
        <Link className="button button-dark" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
