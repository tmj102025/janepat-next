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

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
