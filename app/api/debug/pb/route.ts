import { listPublishedPosts } from "@/lib/pocketbase";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = SITE.pocketbase.url;
  const probe = `${url}/api/collections/janepat_posts/records?filter=published%20%3D%20true&perPage=3`;

  // Test 1 — raw fetch
  let rawCount = -1;
  let rawError = "";
  let rawSample: unknown[] = [];
  try {
    const r = await fetch(probe, { cache: "no-store" });
    if (!r.ok) {
      rawError = `${r.status} ${await r.text()}`;
    } else {
      const d = await r.json();
      rawCount = d.totalItems ?? d.items?.length ?? 0;
      rawSample = (d.items ?? []).slice(0, 2).map((it: { slug?: string; published?: boolean }) => ({ slug: it.slug, published: it.published }));
    }
  } catch (e) {
    rawError = (e as Error).message;
  }

  // Test 2 — listPublishedPosts (the real function used by /blog)
  const posts = await listPublishedPosts({ limit: 3 });

  return Response.json({
    POCKETBASE_URL_env: process.env.POCKETBASE_URL ?? "(unset)",
    SITE_pocketbase_url: url,
    rawFetch: { count: rawCount, error: rawError, sample: rawSample },
    listPublishedPosts: { count: posts.length, sample: posts.slice(0, 2).map((p) => ({ slug: p.slug, published: p.published })) },
  });
}
