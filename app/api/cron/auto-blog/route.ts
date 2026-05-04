import { NextRequest } from "next/server";
import { SOURCE_CHANNELS } from "@/lib/channels";
import { fetchLatestLongByChannel, fetchTranscript } from "@/lib/youtube";
import { rewriteToBlog } from "@/lib/llm";
import { authAsAdmin, createPost, findPostByVideoId } from "@/lib/pocketbase";
import { pushDraftNotification } from "@/lib/telegram";

export const maxDuration = 300; // 5 min

type RunResult = {
  channel: string;
  videoId: string;
  status:
    | "skipped:exists"
    | "skipped:no-source"
    | "created:auto"
    | "created:draft"
    | "error";
  source?: "transcript" | "description";
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
    return Response.json(
      { ok: false, error: `PB auth: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  const channelFilter = req.nextUrl.searchParams.get("channel");
  const skipDedup = req.nextUrl.searchParams.get("skipDedup") === "1";
  const channels = channelFilter
    ? SOURCE_CHANNELS.filter((c) => c.handle === channelFilter || c.id === channelFilter || c.name === channelFilter)
    : SOURCE_CHANNELS;

  // Run all channels in parallel — Cloudflare proxy times out at 100s
  const channelTasks = channels.map(async (channel) => {
    const channelResults: RunResult[] = [];
    let videos;
    try {
      videos = await fetchLatestLongByChannel(channel.id, limit);
    } catch (err) {
      channelResults.push({
        channel: channel.name,
        videoId: "",
        status: "error",
        error: (err as Error).message,
      });
      return channelResults;
    }

    // Each video processed sequentially within a channel (limit usually = 1)
    for (const v of videos) {
      try {
        if (!skipDedup) {
          const existing = await findPostByVideoId(v.videoId);
          if (existing) {
            channelResults.push({
              channel: channel.name,
              videoId: v.videoId,
              status: "skipped:exists",
              error: `existing.slug=${existing.slug}`,
            });
            continue;
          }
        }

        let sourceText = "";
        let sourceKind: "transcript" | "description" = "description";
        const transcript = await fetchTranscript(v.videoId);
        if (transcript && transcript.text.length > 200) {
          sourceText = transcript.text;
          sourceKind = "transcript";
        } else if (v.description && v.description.length > 200) {
          sourceText = v.description;
          sourceKind = "description";
        }

        if (!sourceText) {
          channelResults.push({ channel: channel.name, videoId: v.videoId, status: "skipped:no-source" });
          continue;
        }

        const videoUrl = `https://www.youtube.com/watch?v=${v.videoId}`;
        const post = await rewriteToBlog({
          videoTitle: v.title,
          videoUrl,
          channelName: channel.name,
          transcript: sourceText,
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
            ? [{ label: `วิดีโอต้นฉบับ — ${channel.name}`, url: videoUrl }]
            : [
                { label: `Source video — ${channel.name}`, url: videoUrl },
                { label: `Original channel — ${channel.handle}`, url: `https://www.youtube.com/${channel.handle}` },
              ],
        });

        if (!create.ok || !create.id) {
          channelResults.push({ channel: channel.name, videoId: v.videoId, status: "error", error: create.error });
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

        channelResults.push({
          channel: channel.name,
          videoId: v.videoId,
          status: isAuto ? "created:auto" : "created:draft",
          source: sourceKind,
          postId: create.id,
        });
      } catch (err) {
        channelResults.push({
          channel: channel.name,
          videoId: v.videoId,
          status: "error",
          error: (err as Error).message,
        });
      }
    }
    return channelResults;
  });

  const settled = await Promise.allSettled(channelTasks);
  for (const s of settled) {
    if (s.status === "fulfilled") results.push(...s.value);
    else results.push({ channel: "?", videoId: "", status: "error", error: String(s.reason) });
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
