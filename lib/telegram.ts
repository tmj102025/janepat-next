/**
 * Telegram Bot API — push notification ไปยัง Tim
 *
 * Setup:
 *   1. คุยกับ @BotFather → /newbot → ได้ TELEGRAM_BOT_TOKEN
 *   2. คุยกับ bot ตัวเอง 1 ข้อความ
 *   3. เปิด https://api.telegram.org/bot<TOKEN>/getUpdates → ดู chat.id → ใส่ TELEGRAM_CHAT_ID
 */

export async function pushDraftNotification(input: {
  title: string;
  postId: string;
  channelName: string;
  category: string;
}): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: "TELEGRAM env vars not set" };
  }

  const adminUrl = `${process.env.POCKETBASE_URL ?? 'https://db.aiceo.im'}/_/#/collections?collection=janepat_posts&recordId=${input.postId}`;

  const text = [
    "📝 <b>DRAFT รอ review</b>",
    "",
    `<b>${escapeHtml(input.title)}</b>`,
    "",
    `🎬 Source: ${escapeHtml(input.channelName)}`,
    `📂 Category: ${escapeHtml(input.category)}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔍 เปิดดูใน Pocketbase", url: adminUrl }],
        ],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: `Telegram ${res.status}: ${err.slice(0, 200)}` };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
