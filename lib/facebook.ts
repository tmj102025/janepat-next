/**
 * Facebook Page posting via Graph API
 * Reuses Meta App from AllChat (chat.aiceo.im) — Tim's same App ID/Secret/permissions
 *
 * ENV:
 *   FB_PAGE_ID            — Page ID to post to
 *   FB_PAGE_ACCESS_TOKEN  — long-lived Page token (60 days, refresh via Graph API)
 *
 * Required permissions on the App:
 *   - pages_manage_posts  (post to feed — needs App Review for prod)
 *   - pages_show_list
 */

const GRAPH_API = "https://graph.facebook.com/v20.0";

export type FbPostResult = {
  ok: boolean;
  postId?: string;
  error?: string;
};

/** Post a link with caption to a Facebook Page feed */
export async function postLinkToPage(input: {
  message: string;
  link: string;
  pageId?: string;
  pageToken?: string;
}): Promise<FbPostResult> {
  const pageId = input.pageId ?? process.env.FB_PAGE_ID;
  const pageToken = input.pageToken ?? process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !pageToken) {
    return { ok: false, error: "FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN not set" };
  }

  try {
    const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        message: input.message,
        link: input.link,
        access_token: pageToken,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: `${res.status}: ${JSON.stringify(data?.error ?? data).slice(0, 300)}` };
    }
    return { ok: true, postId: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Build a friendly Facebook caption from a post record */
export function buildFbCaption(input: {
  title: string;
  excerpt: string;
  url: string;
  category?: string;
  tags?: string[];
}): string {
  const lines: string[] = [];

  // Eye-catching opener with emoji based on category
  const catEmoji: Record<string, string> = {
    chatgpt: "🤖",
    claude: "🧠",
    marketing: "📢",
    automation: "⚙️",
    tools: "🛠️",
    business: "💼",
    creator: "🎬",
    basics: "📚",
  };
  const emoji = (input.category && catEmoji[input.category]) || "✨";
  lines.push(`${emoji} ${input.title}`);
  lines.push("");
  lines.push(input.excerpt);
  lines.push("");
  lines.push(`อ่านเต็มที่ → ${input.url}`);

  if (input.tags && input.tags.length > 0) {
    const hashtags = input.tags
      .slice(0, 5)
      .map((t) => `#${t.replace(/\s+/g, "").replace(/[^\p{L}\p{N}_]/gu, "")}`)
      .join(" ");
    lines.push("");
    lines.push(hashtags);
  }
  return lines.join("\n");
}

/** Verify Page Access Token is valid + has the required permissions */
export async function verifyPageToken(token: string): Promise<{
  ok: boolean;
  pageId?: string;
  pageName?: string;
  permissions?: string[];
  error?: string;
}> {
  try {
    const res = await fetch(
      `${GRAPH_API}/me?fields=id,name&access_token=${encodeURIComponent(token)}`,
    );
    const data = await res.json();
    if (!res.ok) return { ok: false, error: JSON.stringify(data?.error ?? data) };
    return { ok: true, pageId: data.id, pageName: data.name };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
