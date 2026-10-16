import Link from "next/link";
export function PolicyPage({
  eyebrow,
  title,
  updated = "September 23, 2026",
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="section section-ivory">
      <article className="container-narrow policy-page">
        <p className="eyebrow ink">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="policy-updated">Last updated {updated}</p>
        {children}
        <p className="policy-contact">
          Questions can be sent through the <Link href="/contact">contact page</Link> or to{" "}
          <a href="mailto:michael.kennedy@ku.edu">michael.kennedy@ku.edu</a>.
        </p>
      </article>
    </main>
  );
}
