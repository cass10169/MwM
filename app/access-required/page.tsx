import Link from "next/link";

export const metadata = {
  title: "Administrator access required",
  robots: { index: false, follow: false },
};

export default function AccessRequiredPage() {
  return (
    <main className="legal-page">
      <p className="eyebrow">Studio manager</p>
      <h1>Administrator access is required.</h1>
      <p>
        The studio manager is protected by Cloudflare Access. If Access is configured, open the dashboard again and
        complete Cloudflare&apos;s sign-in prompt. If you keep returning here, review the Access application, audience
        tag, and team-domain values in the deployment guide.
      </p>
      <p>
        <Link className="button" href="/admin">
          Try the studio manager again
        </Link>
      </p>
    </main>
  );
}
