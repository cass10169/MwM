import Link from "next/link";

export function Breadcrumbs({
  items,
  currentPath,
}: {
  items: Array<{ label: string; href?: string }>;
  currentPath?: string;
}) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com";
  const structured = currentPath
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: new URL(item.href ?? currentPath, base).toString(),
        })),
      }
    : null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {structured && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      )}
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 && <i aria-hidden="true">/</i>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
