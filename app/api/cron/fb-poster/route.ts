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

/** Strip markdown to plain text but preserve line breaks + bullet markers */
function mdToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "✅ ")
    .replace(/^\s*\d+\.\s+/gm, "✅ ");
}

/** Convert content_md → mobile-readable FB caption with sections + functional emoji */
function captionFromContent(post: PostRecord, isOwn: boolean, creator: string | null): string {
  const md = post.content_md ?? "";
  const sections = md.split(/(?=\n#{2,3}\s+)/);

  const lines: string[] = [];
  const emoji = isOwn ? "🎬" : "🤖";
  lines.push(`${emoji} ${post.title_th}`);
  lines.push("");
  if (creator && !isOwn) {
    lines.push(`📌 จากคลิปล่าสุดของ ${creator}`);
    lines.push("");
  }

  for (const sec of sections) {
    const trimmed = sec.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) {
      // H2/H3 section
      const lineEnd = trimmed.indexOf("\n");
      const heading = trimmed.slice(0, lineEnd === -1 ? undefined : lineEnd).replace(/^#{2,3}\s+/, "").trim();
      const body = lineEnd === -1 ? "" : trimmed.slice(lineEnd + 1).trim();
      // Skip generic "สรุป" headings → just inline content
      const isClosing = /^(สรุป|ขั้นตอนต่อไป|ทำตามนี้|เริ่มต้น)/.test(heading);
      if (heading && !isClosing) {
        lines.push(`📌 ${heading}`);
      }
      if (body) {
        lines.push(mdToText(body));
      }
    } else {
      // Lead paragraph (no heading)
      lines.push(mdToText(trimmed));
    }
    lines.push("");
  }

  // Hashtags — derive from tags or default
  const tags = (post.tags ?? []).slice(0, 5).map((t) => `#${t.replace(/\s+/g, "")}`);
  if (tags.length === 0) tags.push("#AI", isOwn ? "#TimJanepat" : "#ClaudeAI", "#AITips");
  lines.push(tags.join(" "));

  // Collapse 3+ newlines, trim
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Pick best caption — prefer LLM-generated fb_caption, else build from content_md */
function buildCaption(post: PostRecord, isOwn: boolean, creator: string | null): string {
  if (post.fb_caption && post.fb_caption.trim().length > 500) {
    return post.fb_caption;
  }
  return captionFromContent(post, isOwn, creator);
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

async function postComment(postId: string, message: string, token: string): Promise<void> {
  await fetch(`${FB_GRAPH}/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ message, access_token: token }),
  });
}

/** Comment 1 = website article, Comment 2 = original YouTube source */
async function postSourceComments(postId: string, articleUrl: string, ytUrl: string | null, token: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 3000));
  await postComment(postId, `🔗 บทความฉบับเต็ม → ${articleUrl}`, token);
  if (ytUrl) {
    await new Promise((r) => setTimeout(r, 2000));
    await postComment(postId, `🎬 วิดีโอต้นฉบับที่อ้างอิง → ${ytUrl}`, token);
  }
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
  // urgent=1 → pick NEWEST unposted (live events, just-published articles)
  const urgent = req.nextUrl.searchParams.get("urgent") === "1";
  const results: Result[] = [];

  for (let i = 0; i < max; i++) {
    // Find unposted: published=true && fb_post_id=""
    let post: PostRecord | null = null;
    try {
      const list = await pb().collection("janepat_posts").getList<PostRecord>(1, 50, {
        filter: `published = true && fb_post_id = ""`,
      });
      // PB id is roughly chronological — oldest by default, newest when urgent
      const sorted = list.items
        .slice()
        .sort((a, b) => (urgent ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)));
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

    // Source comments — 1) article URL  2) YouTube source video
    await postSourceComments(fb.postId, articleUrl, ytUrl, token);

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
