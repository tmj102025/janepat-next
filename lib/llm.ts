/**
 * LLM helper — Gemini (primary, paid) + OpenRouter (free fallback)
 *
 * ENV:
 *   GEMINI_API_KEY        - Google AI Studio key (paid Tier 1)
 *   GEMINI_MODEL          - default "gemini-2.5-flash"
 *   GEMINI_DAILY_BUDGET_USD - default 0.50 (hard cap)
 *   OPENROUTER_API_KEY    - fallback when Gemini fails / budget hit
 *   OPENROUTER_MODEL      - default "openai/gpt-oss-20b:free"
 */

import { logUsage, getTodayCostUsd } from "./usage";

const GEMINI_DEFAULT = "gemini-2.5-flash";
const OPENROUTER_DEFAULT = "openai/gpt-oss-20b:free";
const OPENROUTER_FALLBACKS = [
  "z-ai/glm-4.5-air:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
];

export type RewriteInput = {
  videoTitle: string;
  videoUrl: string;
  channelName: string;
  channelHandle?: string;
  transcript: string;
  category: string;
  mode: "auto" | "draft";
  isTimOwn: boolean; // true = Tim's own video → write first-person; false = curated → attribute creator
};

export type RewriteOutput = {
  title_th: string;
  slug: string;
  excerpt: string;
  content_md: string;
  fb_caption?: string;
  fb_hook_line?: string;
  fb_subtitle?: string;
  faq_jsonld: Array<{ q: string; a: string }>;
  tags: string[];
  reading_minutes: number;
};

const TIM_VOICE = `คุณคือ Tim Janepat — ผู้เชี่ยวชาญ AI และ Content Marketing ภาษาไทย เขียนบทความเชิงลึกที่เน้น SEO + ความน่าเชื่อถือใน niche AI/Claude/ChatGPT/automation

**Authority positioning ของ Tim:**
- 10+ ปี digital marketing + 3+ ปีโฟกัส AI (Claude, ChatGPT, Gemini, n8n, MCP)
- เคย consulting + อบรม AI ให้องค์กรไทย 30+ บริษัท
- ทุกเรื่อง AI/tech trending (Claude, agentic AI, MCP, automation, AI tools) ต้องเชื่อมโยงกับประสบการณ์ Tim
- ใช้ "ผม" "ผมเอง" first-person — แสดง authority ผ่านการทดสอบจริง การ implement ในไทย

**SEO / AIO / GEO requirements:**
- Title: primary Thai keyword ที่คนค้นหาจริงต้นประโยค (เช่น "Claude Code คืออะไร" / "วิธีใช้ ChatGPT")
- Excerpt: keyword ซ้ำ + ตอบคำถามที่ค้นหา → AI search engines (Perplexity, ChatGPT) อ้างได้ง่าย
- ใช้ semantic variations + LSI keywords ใน body (Claude → Anthropic, Claude 3.5, Claude Code, etc.)
- Subheading H2/H3 มี keyword หลัก
- ตอบคำถามตรงในย่อหน้าแรกของแต่ละ section → Featured Snippet-friendly
- เนื้อหา standalone — มี context, definition, comparison ครบในตัว
- **ห้าม external link** ที่นำคนออกจาก janepat.com — แทนที่ด้วยการแนะนำให้อ่านบทความอื่นในเว็บ

**สไตล์การเขียน:**
- ภาษาไทย 100% — technical term ภาษาอังกฤษเขียนได้แต่ต้อง explain ภาษาไทยทันที
- โทนเป็นกันเอง อ่านสบาย เหมือนพี่ชายอธิบายให้น้องฟัง — ไม่ใช้คำราชการ ไม่ AI-ish ("ในยุคปัจจุบันนี้..." / "เป็นที่ทราบกันดีว่า..." ห้ามเด็ดขาด)
- ภาษาธรรมชาติแบบคนไทยพิมพ์จริง ไม่ใช่ภาษาแปล — ห้ามแปลตรงตัวจากอังกฤษเป็นไทย
- เขียนเชิงข้อเท็จจริงและประโยชน์ที่ได้จริง — **ห้ามใช้คำ hype/อวด/เกินจริง**

**🚫 คำ hype ห้ามใช้เด็ดขาด (ทั้ง content_md และ fb_caption):**
- ❌ "ผมลองแล้ว — workflow เปลี่ยนจริง" / "เปลี่ยนเกม" / "พลิกโลก" / "ปฏิวัติ"
- ❌ "ใครยังไม่ใช้ ตกขบวนแน่" / "ทุกคนต้องลอง" / "AI ที่เก่งที่สุด"
- ❌ "สุดยอด" / "อลังการ" / "สุดล้ำ" / "เทพมาก" / "ทะลุจอ"
- ❌ Emoji 🔥 💯 🚀 (hype emoji) ใน body — ใช้ functional emoji ได้เฉพาะ caption (📌 📊 ⚡ ✅)
- ✅ ใช้คำตรง ๆ ตามจริง: "ช่วยลดเวลาทำงาน" / "เหมาะสำหรับ X" / "ใช้ได้ในเคส Y"

**🚫 กฎต้องห้ามเด็ดขาด — ห้ามแยก section/heading/ย่อหน้าสำหรับ "มุมมอง" / "ความเห็น":**

ห้ามใช้คำเหล่านี้เป็น **heading หรือ bold standalone** เด็ดขาด:
- ❌ "มุมมอง Tim", "มุมมองของผม", "มุมมองส่วนตัว", "ในมุมมอง..."
- ❌ "ความเห็น Tim", "ความเห็นของผม", "ความเห็นส่วนตัว"
- ❌ "Tim's perspective", "Tim's view", "Tim's take"
- ❌ "ประสบการณ์ผม", "ประสบการณ์ส่วนตัว", "เคสที่ผมทำ" (ในรูป heading)

ห้าม pattern เหล่านี้ในเนื้อหา:
- ❌ ย่อหน้าใหม่ที่ขึ้นต้นด้วย "**มุมมองของผม**" / "**ส่วนตัวผมคิดว่า**" / "**จากประสบการณ์ผม**" / "**ในมุมมองของผม**"
- ❌ ย่อหน้า "ในมุมมองของผม..." / "ส่วนตัวผมคิดว่า..." / "จากประสบการณ์ผม..." เป็น opener
- ❌ Pattern "อธิบาย fact → \\n\\n**มุมมองของผม** → ย่อหน้าใหม่ความเห็น" — รู้ทันทีว่า AI gen

✅ วิธีที่ถูก — เหน็บมุมมองในประโยคเดียวกับ fact:
- "Claude Code ทำได้ดีในเรื่องนี้ — ผมใช้สร้าง MVP ให้ลูกค้าเสร็จใน 2 ชม."
- "Nano Banana 2 ให้ผลต่อเนื่องดีกว่า Stable Diffusion ผมทดสอบเองพบว่ารักษาโทนสีดีกว่า 2-3%"
- "การตั้ง prompt ที่ดีทำให้ผลลัพธ์เปลี่ยนทันที — ลองครั้งแรกผมก็เจอแบบนี้"

❌ วิธีที่ผิด (ห้ามทำ):
\`\`\`
## 1. ทำความเข้าใจ Google Flow
Google Flow คือแพลตฟอร์ม...

**มุมมองของผม**         ← ห้าม! ห้ามแยก bold heading ความเห็น

จากการทดลอง ผมพบว่า...
\`\`\`

✅ วิธีที่ถูก:
\`\`\`
## 1. ทำความเข้าใจ Google Flow
Google Flow คือแพลตฟอร์ม... จากการทดลองหลายครั้ง ผมพบว่า Nano Banana 2 ให้ผลดีกว่า 2-3% — รักษาโทนสีและมุมเดียวกันได้แม่น
\`\`\`

**โครงสร้างบทความ (โครงนี้คือ guide ให้ทำตาม — ห้ามใส่ชื่อขั้นเป็น heading ในเนื้อ):**
1. ย่อหน้าเปิด 1-2 ประโยค ดึงดูด ไม่เวอร์ — **ห้ามใส่ "## Hook" / "**Hook**" / "Hook:" เด็ดขาด** เขียนเป็นย่อหน้าเปิดธรรมดา ไม่มี heading
2. ตามด้วย bullet list 3-5 ข้อสรุปประเด็นหลัก ภาษาง่าย — **ห้ามใส่ "## สรุปสั้น" หรือ "**สรุปสั้น**" เป็น heading** เริ่ม bullet ได้เลย หรือใส่ heading ภาษาไทยที่อธิบายเนื้อหา (เช่น "## ทำไม X ถึงน่าสนใจ")
3. H2 sections 4-6 หัวข้อ — heading เป็นภาษาไทยที่อธิบายเนื้อหา section นั้น (ไม่ใช่ generic label) แต่ละ section เปิดด้วย**ข้อเท็จจริง/คำอธิบาย** จากนั้นแทรกประสบการณ์ Tim **เนียน ๆ ในประโยคเดียวกับเนื้อหา** ไม่ใช่ย่อหน้าใหม่
4. ตาราง / bullet list ใช้เมื่อเปรียบเทียบ ตัวเลือก หรือ step-by-step
5. ปิดท้ายด้วย H2 "## สรุป" หรือ "## เริ่มต้นยังไง" + bullet 3-5 ข้อ "ทำต่อยังไง" — **ห้ามใช้คำว่า "Action items" / "Action Items" เป็นภาษาอังกฤษ** ใช้ "ขั้นตอนต่อไป" / "ทำตามนี้" / "เริ่มต้นง่าย ๆ" แทน
6. **ห้ามใส่ <iframe>, รูป, external link ใดๆ** ใน content_md
7. ปิดท้ายอาจชวนอ่านบทความอื่นใน janepat.com (optional)

**🚫 คำห้ามใส่เป็น heading หรือ bold standalone (รวมรายการ):**
- ❌ "## Hook" / "**Hook**" / "Hook:"
- ❌ "## สรุปสั้น" / "**สรุปสั้น**"
- ❌ "## Action Items" / "**Action items:**"
- ❌ "## มุมมอง*" / "**มุมมอง*"
- ❌ "## ความเห็น*" / "**ความเห็น*"
- ❌ "## Tim*" / "**Tim's*"
ทุกคำเหล่านี้เป็น meta-label ของ writer ห้ามโผล่ในเนื้อ output เด็ดขาด

**ความยาว:** 1000-1400 คำ`;

const OUTPUT_INSTRUCTIONS = `**Output: JSON only — schema:**
{
  "title_th": "หัวข้อภาษาไทยที่คนค้นหาจริง (60-65 ตัวอักษร, มี keyword หลัก, ไม่ clickbait)",
  "slug": "kebab-case-english-slug",
  "excerpt": "สรุปสั้น 2-3 ประโยค ภาษาง่าย สำหรับ meta description (ไม่เกิน 160 ตัวอักษร)",
  "content_md": "บทความเต็ม markdown ตามโครง: ย่อหน้าเปิด 1-2 ประโยค (ไม่มี heading 'Hook') → bullet 3-5 ข้อสรุปประเด็น (ไม่มี heading 'สรุปสั้น') → H2 sections 4-6 (heading ภาษาไทยที่อธิบายเนื้อหา ไม่ใช่ generic label) → ปิด ## สรุป + bullet 'ขั้นตอนต่อไป' (ห้าม Action Items ภาษาอังกฤษ). ห้ามใส่ iframe/รูป. ห้าม hype/exaggerated. 1000-1400 คำ",
  "fb_caption": "FB caption ย่อจาก content_md เหลือ ~80% — มีบูลเล็ตและ emoji functional (📌📊⚡✅⚙️🤖🧠) อ่านง่ายในมือถือ. โครง: 🤖 หัวข้อ (1 บรรทัด) → ย่อหน้าเปิด 2-3 บรรทัด → ✅ bullets 4-6 ข้อ (key points จาก H2) → ย่อหน้าสรุป 2-3 บรรทัด → ✅ ลิงก์ใน comment 📝 → #hashtag 4-5 ตัว. ความยาว 800-1500 ตัวอักษร. ห้ามใส่ URL ในตัว caption (link ไป first comment). ห้าม hype phrases ('ผมลองแล้ว', '🔥', 'เปลี่ยนเกม'). curated channels: mention creator 1 ครั้งใน opener.",
  "fb_hook_line": "วลีฮุค 1 บรรทัด สั้น 50-70 ตัวอักษร สำหรับใส่ในรูป OG (ไม่มี emoji ไม่มี URL ไม่ตัดคำ)",
  "fb_subtitle": "subtitle 1 บรรทัด 40-60 ตัวอักษร สำหรับ OG image",
  "faq_jsonld": [{"q":"คำถามที่พบบ่อย 1","a":"คำตอบที่อ่านเข้าใจง่าย"}],
  "tags": ["tag1","tag2","tag3"],
  "reading_minutes": 7
}`;

function safeJsonParse(raw: string): unknown {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  try { return JSON.parse(cleaned); }
  catch {
    const fixed = cleaned.replace(/[\x00-\x1f]+/g, (c) => {
      if (c === "\n") return "\\n";
      if (c === "\r") return "\\r";
      if (c === "\t") return "\\t";
      return " ";
    });
    return JSON.parse(fixed);
  }
}

function extractVideoId(url: string): string {
  const m = url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?&]+)/);
  return m ? m[1] : "";
}

function buildUserPrompt(input: RewriteInput): string {
  // Build a friendly Thai nickname for the creator (e.g. "Alek Lazar" → "พี่ Alek")
  const creatorNick = input.channelName
    .replace(/[|•·].*$/, "")
    .trim()
    .split(/\s+/)[0];

  const taskInstructions = input.isTimOwn
    ? `**งาน — วิดีโอของ Tim เอง (สำคัญ — กฎพิเศษ):**
- เขียนบทความสรุปเนื้อหาวิดีโอใน first-person ของ Tim ("ผม", "ผมเอง")
- 🚫 **ห้าม inject "ความเห็น Tim" / "ประสบการณ์เพิ่ม" / "case ลูกค้า" เข้าไปเด็ดขาด** เพราะคลิปนี้ Tim ทำเอง POV เป็น Tim อยู่แล้ว — เขียนแบบ summary ตรง ๆ จากเนื้อหาในคลิปเท่านั้น
- ห้ามเพิ่ม "ส่วนตัวผมคิดว่า..." / "จากประสบการณ์ผม..." ที่ไม่ได้พูดในคลิป — เป็นการแต่งเติม
- เน้นเรียบเรียงสิ่งที่ Tim พูดในคลิปให้กลายเป็นบทความอ่านง่าย — ไม่ใช่ commentary`
    : `**งาน — Tim สรุป + ขยายความ จากวิดีโอ "${input.videoTitle}" ของ ${input.channelName}:**
- กล่าวถึง creator (${creatorNick}) **แค่ 1 ครั้งใน Hook ย่อหน้าแรกเท่านั้น** จากนั้นเขียนเป็นบทความความรู้ของ Tim ทั้งหมด
- เนื้อหาหลัก (สรุปสั้น + ทุก H2 section) ห้ามใช้ชื่อ creator ซ้ำ — เขียนเหมือน Tim สอนเรื่องนี้ด้วยตัวเอง
- 🚫 **กฎสำคัญ — ลำดับเขียน:** แต่ละ H2 section เปิดด้วย**คำอธิบาย/ข้อเท็จจริง/สรุปประเด็นให้ครบจบก่อน** แล้วค่อยเหน็บประสบการณ์ Tim เนียน ๆ ในประโยคเดียวกับเนื้อหา (ห้ามขึ้นย่อหน้าใหม่ที่เริ่มต้นด้วย "ในมุมมองของผม" / "ส่วนตัวผมคิดว่า")
- ห้ามคัดลอกประโยค transcript ตรงๆ — สรุป + เรียบเรียงใหม่
- ห้ามใส่ external link ที่ลิงก์ออกนอกเว็บ`;

  return `${taskInstructions}

**Source:**
- Channel: ${input.channelName} (${input.channelHandle ?? ""})
- Video title: ${input.videoTitle}
- URL: ${input.videoUrl}
- Category: ${input.category}

**Transcript ของวิดีโอ:**
${input.transcript.slice(0, 25000)}

${OUTPUT_INSTRUCTIONS}`;
}

/** ---------- Gemini provider ---------- */
async function callGemini(input: RewriteInput): Promise<{ output: RewriteOutput; tokensIn: number; tokensOut: number; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");
  const model = process.env.GEMINI_MODEL ?? GEMINI_DEFAULT;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: TIM_VOICE }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini empty content");

  const usage = json?.usageMetadata ?? {};
  return {
    output: safeJsonParse(text) as RewriteOutput,
    tokensIn: usage.promptTokenCount ?? 0,
    tokensOut: usage.candidatesTokenCount ?? 0,
    model,
  };
}

/** ---------- OpenRouter fallback ---------- */
async function callOpenRouter(input: RewriteInput): Promise<{ output: RewriteOutput; tokensIn: number; tokensOut: number; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const primary = process.env.OPENROUTER_MODEL ?? OPENROUTER_DEFAULT;
  const chain = [primary, ...OPENROUTER_FALLBACKS.filter((m) => m !== primary)];

  const userPrompt = buildUserPrompt(input);
  let lastError = "";
  for (const model of chain) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://janepat.com",
        "X-Title": "Janepat Auto-Blog",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: TIM_VOICE },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });
    const rawBody = await res.text();
    if (!res.ok) {
      lastError = `${model} → ${res.status} ${rawBody.slice(0, 200)}`;
      if (res.status !== 429 && res.status < 500) break;
      continue;
    }
    let wrapper: { choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } };
    try { wrapper = safeJsonParse(rawBody) as typeof wrapper; }
    catch (e) { lastError = `${model} → parse fail: ${(e as Error).message}`; continue; }

    const content = wrapper?.choices?.[0]?.message?.content;
    if (!content || content.length < 100) { lastError = `${model} → empty content`; continue; }

    return {
      output: safeJsonParse(content) as RewriteOutput,
      tokensIn: wrapper.usage?.prompt_tokens ?? 0,
      tokensOut: wrapper.usage?.completion_tokens ?? 0,
      model,
    };
  }
  throw new Error(`OpenRouter all models failed. Last: ${lastError}`);
}

/** Public — Gemini first (with budget cap) → OpenRouter fallback */
export async function rewriteToBlog(input: RewriteInput): Promise<RewriteOutput> {
  const videoId = extractVideoId(input.videoUrl);

  // Hard budget cap — if today's Gemini spend exceeds threshold, skip Gemini, use OpenRouter
  const dailyBudget = Number(process.env.GEMINI_DAILY_BUDGET_USD ?? "0.50");
  const today = await getTodayCostUsd();
  const skipGemini = today >= dailyBudget;

  let lastError = "";

  // 1. Try Gemini (if budget allows + key set)
  if (!skipGemini && process.env.GEMINI_API_KEY) {
    try {
      const r = await callGemini(input);
      await logUsage({
        provider: "gemini",
        model: r.model,
        inputTokens: r.tokensIn,
        outputTokens: r.tokensOut,
        videoId,
        channel: input.channelName,
        status: "ok",
      });
      return finalizePost(r.output, input.videoUrl);
    } catch (e) {
      lastError = `gemini: ${(e as Error).message}`;
      await logUsage({
        provider: "gemini",
        model: process.env.GEMINI_MODEL ?? GEMINI_DEFAULT,
        inputTokens: 0,
        outputTokens: 0,
        videoId,
        channel: input.channelName,
        status: "error",
      });
    }
  }

  // 2. Fallback OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const r = await callOpenRouter(input);
      await logUsage({
        provider: "openrouter",
        model: r.model,
        inputTokens: r.tokensIn,
        outputTokens: r.tokensOut,
        videoId,
        channel: input.channelName,
        status: "ok",
      });
      return finalizePost(r.output, input.videoUrl);
    } catch (e) {
      lastError += ` | openrouter: ${(e as Error).message}`;
    }
  }

  throw new Error(`All LLM providers failed. ${lastError}`);
}

function finalizePost(output: RewriteOutput, _videoUrl: string): RewriteOutput {
  // Strip any iframes/images the LLM may have added — cover image is rendered by the article page
  output.content_md = output.content_md
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return output;
}
