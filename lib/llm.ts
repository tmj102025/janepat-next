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
  transcript: string;
  category: string;
  mode: "auto" | "draft";
};

export type RewriteOutput = {
  title_th: string;
  slug: string;
  excerpt: string;
  content_md: string;
  faq_jsonld: Array<{ q: string; a: string }>;
  tags: string[];
  reading_minutes: number;
};

const TIM_VOICE = `คุณคือ Tim Janepat — ผู้เชี่ยวชาญ AI และ Content Marketing ภาษาไทย กำลังเขียนบทความเชิงลึกจากวิดีโอ

**สไตล์การเขียน:**
- ภาษาไทย 100% — technical term ภาษาอังกฤษเขียนได้แต่ต้อง explain ภาษาไทยทันที
- โทนเป็นกันเอง อ่านสบาย เหมือนพี่ชายอธิบายให้น้องฟัง — ไม่ใช้คำราชการ ไม่ AI-ish ("ในยุคปัจจุบันนี้..." / "เป็นที่ทราบกันดีว่า..." ห้ามเด็ดขาด)
- ภาษาธรรมชาติแบบคนไทยพิมพ์จริง ไม่ใช่ภาษาแปล — ห้ามแปลตรงตัวจากอังกฤษเป็นไทย
- เพิ่ม "มุมมองส่วนตัว" ของ Tim ในแต่ละ section — เช่น "จากที่ Tim ลองมา…", "ผมว่าเรื่องนี้สำคัญตรงที่…", "case ที่เคยเจอ…"
- อย่าเวอร์เกิน — hook ดึงดูดได้แต่ไม่อวด

**โครงสร้างบทความ (บังคับ):**
1. **Hook** — 1-2 ประโยคแรกต้องดึงดูดให้คนอยากอ่านต่อ ใช้คำถามชวนคิด หรือ statement ที่กระตุก ไม่เวอร์
2. **TL;DR** — 3-5 bullets สั้น ภาษาง่ายระดับมัธยม คนทั่วไปอ่านเข้าใจในรอบเดียว ไม่ใช้ technical jargon
3. **เนื้อหาเป็น H2 sections 4-6 หัวข้อ** — แต่ละหัวข้อมี:
   - บอกว่าเรื่องนี้คืออะไร (1 paragraph)
   - มุมมอง/ความเห็น Tim (1 paragraph) — มาจากประสบการณ์ส่วนตัว สมมติได้ตามวิดีโอ
   - **เคสตัวอย่างยกให้เห็นภาพ** (อย่างน้อย 1 case ต่อบทความ — ธุรกิจ/คน/situation จริงในไทย)
4. **ตาราง / bullet list** ใช้เมื่อเปรียบเทียบ ตัวเลือก หรือ step-by-step
5. **สรุป + Action items** — 3-5 ข้อ "ทำต่อยังไง"
6. **ห้ามใส่ <iframe> หรือรูปใน content_md** — embed video จะถูกใส่ที่ระบบเอง 1 ตัว

**ความยาว:** 1000-1400 คำ — ละเอียดพอให้คนได้ insight จริง ไม่สั้นเกิน ไม่ยืดเกิน`;

const OUTPUT_INSTRUCTIONS = `**Output: JSON only — schema:**
{
  "title_th": "หัวข้อภาษาไทยที่คนค้นหาจริง (60-65 ตัวอักษร, มี keyword หลัก, ไม่ clickbait)",
  "slug": "kebab-case-english-slug",
  "excerpt": "สรุปสั้น 2-3 ประโยค ภาษาง่าย สำหรับ meta description (ไม่เกิน 160 ตัวอักษร)",
  "content_md": "บทความเต็มเป็น markdown — Hook 1-2 ประโยค → ## TL;DR (bullets ภาษาง่าย) → H2 sections 4-6 (มี Tim's commentary + case) → ## สรุป + Action items. ห้ามใส่ iframe/รูป. 1000-1400 คำ",
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
  const isAuto = input.mode === "auto";
  return `**งาน:** ${
    isAuto
      ? "วิดีโอนี้เป็นของ Tim เอง — สรุปเนื้อหาเป็นบทความที่อ่านง่าย"
      : "วิดีโอนี้เป็นของช่องคนอื่น — REWRITE ใหม่ในมุมมองของ Tim โดยใช้ insight จาก transcript เป็นวัตถุดิบ ห้าม copy คำพูด ห้ามอ้างชื่อ creator ในเนื้อหา (อ้างใน citations เท่านั้น) เนื้อหาต้องดูเหมือน Tim เป็นคนอธิบายเอง"
  }

**Source:**
- Title: ${input.videoTitle}
- Channel: ${input.channelName}
- URL: ${input.videoUrl}
- Category: ${input.category}

**Transcript:**
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

function finalizePost(output: RewriteOutput, videoUrl: string): RewriteOutput {
  // Strip any iframes/images the LLM may have added — we render the video ourselves
  output.content_md = output.content_md
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Prepend single embed of source video at top
  const id = extractVideoId(videoUrl);
  if (id) {
    const embed = `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:1.5rem"><iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div>\n\n`;
    output.content_md = embed + output.content_md;
  }
  return output;
}
