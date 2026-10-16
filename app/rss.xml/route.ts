import { getJournalPosts } from "@/lib/catalog";
import { publishedRoadStories, storyPath } from "@/lib/tales";
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
  const tales = publishedRoadStories.map(story=>`<item><title><![CDATA[${cdata(story.title)}]]></title><link>${base}${storyPath(story.slug)}</link><guid>${base}${storyPath(story.slug)}</guid><pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate><description><![CDATA[${cdata(story.excerpt)}]]></description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Memories with Mike Journal</title><link>${base}/journal</link><description>Field notes and stories from photographer Michael Kennedy.</description>${tales}${items}</channel></rss>`;
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
