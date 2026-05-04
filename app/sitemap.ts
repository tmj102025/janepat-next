import type { MetadataRoute } from "next";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { listPublishedPosts } from "@/lib/pocketbase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/ai`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/choopak-janeprakon`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryUrls: MetadataRoute.Sitemap = AI_CATEGORIES.map((c) => ({
    url: `${SITE.url}/ai/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const posts = await listPublishedPosts({ limit: 500 });
  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/ai/${p.category}/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
