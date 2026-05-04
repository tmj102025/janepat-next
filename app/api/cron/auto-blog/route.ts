import { NextRequest } from "next/server";
import { SOURCE_CHANNELS } from "@/lib/channels";
import { fetchChannelFeed, fetchTranscript } from "@/lib/youtube";
import { rewriteToBlog } from "@/lib/gemini";
import { authAsAdmin, createPost, findPostByVideoId } from "@/lib/pocketbase";
import { pushDraftNotification } from "@/lib/line";

export const maxDuration = 300; // 5 min

type RunResult = {
  channel: string;
  videoId: string;
  status: "skipped:exists" | "skipped:no-transcript" | "created:auto" | "created:draft" | "error";
  error?: string;
  postId?: string;
};

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 1);
  const results: RunResult[] = [];

  try {
    await authAsAdmin();
  } catch (err) {
    return Response.json({ ok: false, error: `PB auth: ${(err as Error).message}` }, { status: 500 });
  }

  for (const channel of SOURCE_CHANNELS) {
    let feed;
    try {
      feed = await fetchChannelFeed(channel.id);
    } catch (err) {
      results.push({ channel: channel.name, videoId: "", status: "error", error: (err as Error).message });
      continue;
    }

    const newest = feed.slice(0, limit);
    for (const v of newest) {
      try {
        const existing = await findPostByVideoId(v.videoId);
        if (existing) {
          results.push({ channel: channel.name, videoId: v.videoId, status: "skipped:exists" });
          continue;
        }

        const transcript = await fetchTranscript(v.videoId);
        if (!transcript) {
          results.push({ channel: channel.name, videoId: v.videoId, status: "skipped:no-transcript" });
          continue;
        }

        const post = await rewriteToBlog({
          videoTitle: v.title,
          videoUrl: v.url,
          channelName: channel.name,
          transcript: transcript.text,
          category: channel.defaultCategory,
          mode: channel.mode,
        });

        const slug = `${post.slug}-${v.videoId.toLowerCase()}`;
        const isAuto = channel.mode === "auto";

        const create = await createPost({
          slug,
          title_th: post.title_th,
          excerpt: post.excerpt,
          content_md: post.content_md,
          cover: v.thumbnail,
          category: channel.defaultCategory,
          tags: post.tags,
          author: "Tim Janepat",
          published: isAuto,
          featured: false,
          reading_minutes: post.reading_minutes,
          seo_title: post.title_th,
          seo_description: post.excerpt,
          faq_jsonld: post.faq_jsonld,
          citations: isAuto
            ? [{ label: `วิดีโอต้นฉบับ — ${channel.name}`, url: v.url }]
            : [
                { label: `Source video — ${channel.name}`, url: v.url },
                { label: `Original channel — ${channel.handle}`, url: `https://www.youtube.com/${channel.handle}` },
              ],
        });

        if (!create.ok || !create.id) {
          results.push({ channel: channel.name, videoId: v.videoId, status: "error", error: create.error });
          continue;
        }

        if (!isAuto) {
          await pushDraftNotification({
            title: post.title_th,
            postId: create.id,
            channelName: channel.name,
            category: channel.defaultCategory,
          });
        }

        results.push({
          channel: channel.name,
          videoId: v.videoId,
          status: isAuto ? "created:auto" : "created:draft",
          postId: create.id,
        });
      } catch (err) {
        results.push({
          channel: channel.name,
          videoId: v.videoId,
          status: "error",
          error: (err as Error).message,
        });
      }
    }
  }

  return Response.json({
    ok: true,
    summary: {
      total: results.length,
      created: results.filter((r) => r.status.startsWith("created")).length,
      skipped: results.filter((r) => r.status.startsWith("skipped")).length,
      errors: results.filter((r) => r.status === "error").length,
    },
    results,
  });
}
