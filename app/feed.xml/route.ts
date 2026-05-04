import { SITE } from "@/lib/site";
import { listPublishedPosts } from "@/lib/pocketbase";
import { MOCK_POSTS } from "@/lib/mockPosts";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const real = await listPublishedPosts({ limit: 30 });
  const posts = real.length > 0 ? real : MOCK_POSTS;
  const sorted = posts
    .slice()
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 30);

  const items = sorted
    .map((p) => {
      const url = `${SITE.url}/ai/${p.category}/${p.slug}`;
      return `    <item>
      <title>${escapeXml(p.title_th)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.created).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      <category>${escapeXml(p.category)}</category>
      <author>noreply@janepat.com (${escapeXml(p.author ?? "Tim Janepat")})</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.brand)} — บทความ AI ภาษาไทย</title>
    <link>${SITE.url}</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
