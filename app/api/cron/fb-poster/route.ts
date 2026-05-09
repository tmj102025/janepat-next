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

/** Strip markdown to plain text for caption use */
function mdToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

/** Build FB caption from article — ~80% of article, bullets + functional emoji, no hype */
function buildCaption(post: PostRecord, isOwn: boolean, creator: string | null): string {
  // Prefer LLM-provided fb_caption when available
  if (post.fb_caption && post.fb_caption.trim().length > 100) {
    return post.fb_caption;
  }

  // Fallback: derive from content_md
  const md = post.content_md ?? "";
  const text = mdToText(md);

  // Split into sections by H2 (## heading)
  const sections = md.split(/\n#{2,3}\s+/).slice(0, 8);
  const intro = sections[0] ? mdToText(sections[0]).trim().slice(0, 280) : post.excerpt;

  // Extract H2 titles + first sentence of each section as bullets
  const bullets: string[] = [];
  for (let i = 1; i < sections.length && bullets.length < 5; i++) {
    const sec = sections[i];
    const heading = sec.split("\n")[0].trim().slice(0, 70);
    if (!heading || /^(สรุป|ขั้นตอนต่อไป|ทำตามนี้|เริ่มต้น)/.test(heading)) continue;
    bullets.push(`✅ ${heading}`);
  }

  const emoji = isOwn ? "🎬" : "🤖";
  const lines: string[] = [`${emoji} ${post.title_th}`, ""];
  if (creator && !isOwn) {
    lines.push(`📌 จากคลิปล่าสุดของ ${creator}`);
    lines.push("");
  }
  lines.push(intro);
  if (bullets.length > 0) {
    lines.push("");
    lines.push(...bullets);
  }
  lines.push("");
  lines.push("📝 อ่านเต็มในบทความ — ลิงก์ใน comment");
  lines.push("");
  lines.push(isOwn ? "#AI #TimJanepat" : "#AI #ClaudeAI #AITips");
  return lines.join("\n");
}

/** Truncate to N chars on word boundary (Thai-aware: don't break in middle of word) */
function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
}

async function renderOgImage(post: PostRecord, isOwn: boolean, creator: string | null): Promise<Buffer | null> {
  // Cap text lengths so they fit in the image without ugly clipping
  const titleForOg = truncate(post.title_th, 50);
  const params = new URLSearchParams({
    title: titleForOg,
    category: post.category,
    cover: post.cover ?? "",
  });

  // Prefer LLM-provided short copy fields if available
  const subtitle = post.fb_subtitle && post.fb_subtitle.length > 0
    ? truncate(post.fb_subtitle, 50)
    : post.excerpt
      ? truncate(post.excerpt, 45)
      : "";
  if (subtitle) params.set("subtitle", subtitle);

  if (creator && !isOwn) params.set("creator", truncate(creator, 25));
  if (isOwn) params.set("own", "1");

  // Hook copy — short eye-catching line for curated layout
  if (!isOwn) {
    let hook = "";
    if (post.fb_hook_line) {
      hook = truncate(post.fb_hook_line, 70);
    } else if (post.excerpt) {
      // Don't split on "." — would break "2.0" / "v3.5" etc. Just truncate.
      hook = truncate(post.excerpt, 70);
    }
    if (hook) params.set("hook", hook);
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
