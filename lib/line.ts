/**
 * LINE Messaging API push — ใช้ส่ง notification ไปยัง Tim
 * ENV: LINE_CHANNEL_ACCESS_TOKEN, LINE_USER_ID (Tim's userId หรือ groupId)
 */

export async function pushDraftNotification(input: {
  title: string;
  postId: string;
  channelName: string;
  category: string;
}): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;
  if (!token || !userId) {
    return { ok: false, error: "LINE env vars not set" };
  }

  const adminUrl = `https://db.aiceo.im/_/#/collections?collection=janepat_posts&recordId=${input.postId}`;

  const message = {
    to: userId,
    messages: [
      {
        type: "flex",
        altText: `📝 บทความใหม่รอ review: ${input.title}`,
        contents: {
          type: "bubble",
          size: "kilo",
          header: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#0a0a0a",
            paddingAll: "md",
            contents: [
              { type: "text", text: "📝 DRAFT รอ review", color: "#5eead4", weight: "bold", size: "xs" },
              { type: "text", text: input.title, color: "#ffffff", weight: "bold", size: "md", wrap: true, margin: "sm" },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              { type: "text", text: `Source: ${input.channelName}`, size: "xs", color: "#888888" },
              { type: "text", text: `หมวด: ${input.category}`, size: "xs", color: "#888888" },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "button",
                style: "primary",
                color: "#2dd4bf",
                action: { type: "uri", label: "เปิดดูใน Pocketbase", uri: adminUrl },
              },
            ],
          },
        },
      },
    ],
  };

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: `LINE ${res.status}: ${err.slice(0, 200)}` };
  }
  return { ok: true };
}
