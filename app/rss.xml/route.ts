import { getJournalPosts } from "@/lib/catalog";
export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorieswithmike.com";
  const journalPosts = await getJournalPosts();
  const cdata = (value: string) => value.replaceAll("]]>", "]]]]><![CDATA[>");
  const items = journalPosts
    .filter((post) => post.published)
    .map(
      (post) =>
        `<item><title><![CDATA[${cdata(post.title)}]]></title><link>${base}/journal/${post.slug}</link><guid>${base}/journal/${post.slug}</guid><description><![CDATA[${cdata(post.excerpt)}]]></description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Memories with Mike Journal</title><link>${base}/journal</link><description>Field notes and stories from photographer Michael Kennedy.</description>${items}</channel></rss>`;
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
