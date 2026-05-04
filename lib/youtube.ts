import { YoutubeTranscript } from "youtube-transcript";

export type FeedVideo = {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
  channelId: string;
  channelName: string;
};

/** ดึงวิดีโอล่าสุดของช่อง ผ่าน YouTube RSS (ฟรี ไม่ใช้ API key) */
export async function fetchChannelFeed(channelId: string): Promise<FeedVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 janepat.com auto-blog" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`YouTube RSS ${res.status} for ${channelId}`);
  const xml = await res.text();

  const channelName = extract(xml, /<title>([^<]+)<\/title>/);
  const entries = xml.split("<entry>").slice(1);

  return entries.map((entry) => {
    const videoId = extract(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/) ?? "";
    const title = extract(entry, /<title>([^<]+)<\/title>/) ?? "";
    const publishedAt = extract(entry, /<published>([^<]+)<\/published>/) ?? "";
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    return {
      videoId,
      title: decodeHtml(title),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt,
      thumbnail,
      channelId,
      channelName: decodeHtml(channelName ?? ""),
    };
  });
}

/** ดึง transcript ของวิดีโอ — ลองภาษา TH ก่อน → fallback EN → fallback auto */
export async function fetchTranscript(videoId: string): Promise<{ text: string; lang: string } | null> {
  for (const lang of ["th", "en"]) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      if (items.length > 0) {
        const text = items.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim();
        return { text, lang };
      }
    } catch {
      // try next lang
    }
  }
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    if (items.length > 0) {
      const text = items.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim();
      return { text, lang: "auto" };
    }
  } catch {
    // no transcript available
  }
  return null;
}

function extract(s: string, re: RegExp): string | null {
  const m = s.match(re);
  return m ? m[1] : null;
}

export type LatestVideo = {
  videoId: string;
  title: string;
  description?: string;
  publishedAt: string;
  thumbnail: string;
  durationSec: number;
  viewCount: number;
};

/** Convert channel ID UCxxx → uploads playlist UUxxx */
export function uploadsPlaylistId(channelId: string): string {
  return channelId.startsWith("UC") ? "UU" + channelId.slice(2) : channelId;
}

/** Fetch latest long-form videos by channel ID (handles UC→UU + duration filter) */
export async function fetchLatestLongByChannel(
  channelId: string,
  count = 1,
  apiKey?: string,
): Promise<LatestVideo[]> {
  return fetchLatestLongVideos(uploadsPlaylistId(channelId), count, apiKey);
}

/**
 * Fetch latest long-form (>60s) videos from a channel uploads playlist.
 * Uses YouTube Data API v3. Returns up to `count` videos sorted newest first.
 */
export async function fetchLatestLongVideos(
  uploadsPlaylistId: string,
  count = 8,
  apiKey?: string,
): Promise<LatestVideo[]> {
  const key = apiKey ?? process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  // Pull more than `count` from playlist — channels with many Shorts need a wider window
  const fetchSize = Math.min(50, Math.max(15, count * 10));
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${fetchSize}&key=${key}`;
  const playlistRes = await fetch(playlistUrl, { next: { revalidate: 1800 } });
  if (!playlistRes.ok) return [];
  const playlistData = await playlistRes.json();
  const ids: string[] = (playlistData.items ?? []).map(
    (it: { contentDetails?: { videoId?: string } }) => it.contentDetails?.videoId ?? "",
  ).filter(Boolean);
  if (ids.length === 0) return [];

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids.join(",")}&key=${key}`;
  const detailsRes = await fetch(detailsUrl, { next: { revalidate: 1800 } });
  if (!detailsRes.ok) return [];
  // YouTube descriptions can include raw control chars — sanitize before JSON parse
  const raw = await detailsRes.text();
  let detailsData;
  try {
    detailsData = JSON.parse(raw);
  } catch {
    detailsData = JSON.parse(raw.replace(/[\x00-\x1f]+/g, " "));
  }

  const items: LatestVideo[] = (detailsData.items ?? []).map(
    (v: {
      id: string;
      snippet: { title: string; description?: string; publishedAt: string };
      contentDetails: { duration: string };
      statistics?: { viewCount?: string };
    }) => ({
      videoId: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      publishedAt: v.snippet.publishedAt,
      thumbnail: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
      durationSec: parseDurationSeconds(v.contentDetails.duration),
      viewCount: Number(v.statistics?.viewCount ?? 0),
    }),
  );

  // Long-form = > 3 minutes (filter out Shorts and brief clips)
  return items.filter((v) => v.durationSec > 180).slice(0, count);
}

function parseDurationSeconds(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const [, h, mm, s] = m;
  return Number(h ?? 0) * 3600 + Number(mm ?? 0) * 60 + Number(s ?? 0);
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
