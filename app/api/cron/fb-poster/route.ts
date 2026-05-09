import { NextRequest } from "next/server";
import { authAsAdmin, pb, PostRecord } from "@/lib/pocketbase";
import { SITE } from "@/lib/site";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

const FB_GRAPH = "https://graph.facebook.com/v20.0";

type Result =
  | { status: "no-pending" }
  | { status: "posted"; postId: string; slug: string; fbPostId: string }
  | { status: "error"; slug?: string; error: string };

function extractCreator(citations: PostRecord["citations"]): string | null {
  if (!citations || citations.length === 0) return null;
  const label = citations[0].label || "";
  // "วิดีโอต้นฉบับ — Tim Janepat" / "Source video — Brock Mesarich"
  const m = label.match(/[—–-]\s*(.+)$/);
  return m ? m[1].trim() : null;
}

function isTimsOwn(citations: PostRecord["citations"]): boolean {
  const url = citations?.[0]?.url || "";
  // Tim's own videos all on @TimJanepat — but URL is /watch?v=ID, not channel-specific
  // Use creator name: "Tim Janepat" / "@TimJanepat"
  const creator = extractCreator(citations) || "";
  return /Tim\s*Janepat|@TimJanepat/i.test(creator);
}

function buildCaption(post: PostRecord, isOwn: boolean, creator: string | null): string {
  if (isOwn) {
    // Tim's own — short hook
    return [
      `🎬 ${post.title_th}`,
      "",
      post.excerpt,
      "",
      "ดูเต็ม + ลิงก์คลิปใน comment 📝",
      "",
      "#AI #TimJanepat",
    ].join("\n");
  }
  // Curated — longer article-preview
  const lines = [
    `🤖 ${post.title_th}`,
    "",
  ];
  if (creator) lines.push(`ฟีเจอร์ใหม่ที่ ${creator} แชร์ในคลิปล่าสุด`);
  lines.push("");
  lines.push(post.excerpt);
  lines.push("");
  lines.push("ผมลองแล้ว — workflow เปลี่ยนจริง 🔥");
  lines.push("");
  lines.push("อยากดูทุก step + setup");
  lines.push("อ่านเต็มในบทความ — ลิงก์ใน comment 📝");
  lines.push("");
  lines.push("#AI #ClaudeAI");
  return lines.join("\n");
}

async function renderOgImage(post: PostRecord, isOwn: boolean, creator: string | null): Promise<Buffer | null> {
  const params = new URLSearchParams({
    title: post.title_th,
    category: post.category,
    cover: post.cover ?? "",
  });
  if (post.excerpt) params.set("subtitle", post.excerpt.slice(0, 80));
  if (creator && !isOwn) params.set("creator", creator);
  if (isOwn) params.set("own", "1");
  // Build hook: short value-driven sentence from excerpt
  if (!isOwn && post.excerpt) {
    const hook = post.excerpt.split(/[—–.]/)[0].slice(0, 100);
    params.set("hook", hook);
  }

  try {
    const url = `${SITE.url}/api/og/post?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function postPhotoToFb(image: Buffer, caption: string, pageId: string, token: string): Promise<{ ok: boolean; postId?: string; error?: string }> {
  try {
    const form = new FormData();
    form.set("caption", caption);
    form.set("access_token", token);
    form.set("source", new Blob([new Uint8Array(image)], { type: "image/png" }), "post.png");
    const res = await fetch(`${FB_GRAPH}/${pageId}/photos`, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: `${res.status}: ${JSON.stringify(data?.error ?? data).slice(0, 300)}` };
    return { ok: true, postId: data.post_id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

async function postFirstComment(postId: string, articleUrl: string, ytUrl: string | null, token: string): Promise<void> {
  const lines = [`📖 อ่านเต็ม → ${articleUrl}`];
  if (ytUrl) lines.push("", `🎬 ดูคลิปเต็ม → ${ytUrl}`);
  const message = lines.join("\n");
  await new Promise((r) => setTimeout(r, 3000));
  await fetch(`${FB_GRAPH}/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ message, access_token: token }),
  });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) {
    return Response.json({ ok: false, error: "FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN not set" }, { status: 500 });
  }

  try {
    await authAsAdmin();
  } catch (err) {
    return Response.json({ ok: false, error: `PB auth: ${(err as Error).message}` }, { status: 500 });
  }

  // How many to post in this run (default 1 — drip-feed)
  const max = Math.min(5, Number(req.nextUrl.searchParams.get("max") ?? 1));
  const results: Result[] = [];

  for (let i = 0; i < max; i++) {
    // Find oldest unposted: published=true && (fb_post_id="" OR fb_post_id=null)
    let post: PostRecord | null = null;
    try {
      const list = await pb().collection("janepat_posts").getList<PostRecord>(1, 50, {
        filter: `published = true && fb_post_id = ""`,
      });
      // JS-side sort by id (PB id is roughly chronological) — pick oldest
      const sorted = list.items.slice().sort((a, b) => a.id.localeCompare(b.id));
      post = sorted[0] ?? null;
    } catch (err) {
      results.push({ status: "error", error: `PB list: ${(err as Error).message}` });
      break;
    }

    if (!post) {
      results.push({ status: "no-pending" });
      break;
    }

    const creator = extractCreator(post.citations);
    const isOwn = isTimsOwn(post.citations);
    const articleUrl = `${SITE.url}/ai/${post.category}/${post.slug}`;
    const ytUrl = post.citations?.[0]?.url ?? null;

    // Render image
    const image = await renderOgImage(post, isOwn, creator);
    if (!image) {
      results.push({ status: "error", slug: post.slug, error: "OG render failed" });
      // Mark to skip next time (so we don't loop)
      try {
        await pb().collection("janepat_posts").update(post.id, { fb_post_id: "RENDER_FAILED" });
      } catch {}
      continue;
    }

    // Post photo
    const fb = await postPhotoToFb(image, buildCaption(post, isOwn, creator), pageId, token);
    if (!fb.ok || !fb.postId) {
      results.push({ status: "error", slug: post.slug, error: fb.error ?? "no postId" });
      continue;
    }

    // First comment
    await postFirstComment(fb.postId, articleUrl, isOwn ? ytUrl : null, token);

    // Save fb_post_id
    try {
      await pb().collection("janepat_posts").update(post.id, { fb_post_id: fb.postId });
    } catch (err) {
      // FB post succeeded — log but don't fail run
      console.warn(`[fb-poster] PB update failed for ${post.slug}: ${(err as Error).message}`);
    }

    results.push({ status: "posted", postId: post.id, slug: post.slug, fbPostId: fb.postId });
  }

  return Response.json({ ok: true, results });
}
