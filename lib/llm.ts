/**
 * LLM helper — OpenRouter free tier (per feedback_no_anthropic_key.md)
 *
 * ENV: OPENROUTER_API_KEY, OPENROUTER_MODEL (optional)
 *
 * Default model: google/gemini-2.0-flash-exp:free — fast + free + Thai-strong
 * Alternatives: meta-llama/llama-3.3-70b-instruct:free, qwen/qwq-32b:free
 */

/** Strip code fences + escape raw control chars on retry — used for both wrapper + content */
function safeJsonParse(raw: string): unknown {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const fixed = cleaned.replace(/[\x00-\x1f]+/g, (c) => {
      if (c === "\n") return "\\n";
      if (c === "\r") return "\\r";
      if (c === "\t") return "\\t";
      return " ";
    });
    return JSON.parse(fixed);
  }
}

// Primary + fallback chain — ทุกตัวฟรีและตอบไทยได้
// (ทดสอบเมื่อ 2026-05-04 — gpt-oss-120b ตอบไทยคล่องที่สุด)
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";
const FALLBACK_MODELS = [
  "openai/gpt-oss-20b:free",
  "z-ai/glm-4.5-air:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
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

const TIM_VOICE = `เขียนแบบ Tim Janepat — ผู้เชี่ยวชาญ AI ภาษาไทย
- ใช้ภาษาไทย 100% (technical term ภาษาอังกฤษได้ แต่ explain ภาษาไทย)
- โทนเป็นกันเอง อธิบายเหมือนคุยกับเพื่อน ไม่ใช้คำราชการ
- เน้น "ทำไมคนไทยควรรู้" + "เอาไปใช้ยังไงได้จริง"
- หลีกเลี่ยงประโยค AI-ish เช่น "ในยุคปัจจุบันนี้..." "เป็นที่ทราบกันดีว่า..."
- ใช้ heading H2/H3 + bullet list + table เปรียบเทียบเมื่อเหมาะ
- ทุกบทความต้องมี TL;DR แล้ว body แล้ว FAQ`;

export async function rewriteToBlog(input: RewriteInput): Promise<RewriteOutput> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY env var required");

  const primary = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;
  const chain = [primary, ...FALLBACK_MODELS.filter((m) => m !== primary)];
  const isAuto = input.mode === "auto";

  const userPrompt = `**งาน:** ${
    isAuto
      ? "วิดีโอนี้เป็นของ Tim เอง — สรุปเนื้อหาเป็นบทความที่อ่านง่าย พร้อมลิงก์ embed วิดีโอ"
      : "วิดีโอนี้เป็นของช่องคนอื่น — REWRITE เป็นมุมมองของ Tim โดยใช้ insight จาก transcript เป็นวัตถุดิบ ห้าม copy คำพูด ห้ามอ้างชื่อ creator ในเนื้อหาตรงๆ (อ้างได้ใน citations เท่านั้น) ให้เนื้อหาดูเหมือน Tim เป็นคนอธิบายเอง"
  }

**Source video:**
- Title: ${input.videoTitle}
- Channel: ${input.channelName}
- URL: ${input.videoUrl}
- Category: ${input.category}

**Transcript:**
${input.transcript.slice(0, 25000)}

**Output: JSON only, no markdown fences. Schema:**
{
  "title_th": "หัวข้อภาษาไทยที่คนค้นหาจริง (60-65 ตัวอักษร, มี keyword หลัก)",
  "slug": "kebab-case-english-slug",
  "excerpt": "สรุปสั้น 2-3 ประโยค สำหรับ TL;DR + meta description (ไม่เกิน 160 ตัวอักษร)",
  "content_md": "บทความเต็มเป็น markdown — H2 sections, paragraphs, bullets, code blocks เมื่อจำเป็น ความยาว 1200-2000 คำ",
  "faq_jsonld": [{"q":"คำถามที่พบบ่อย 1","a":"คำตอบ"}],
  "tags": ["tag1","tag2","tag3"],
  "reading_minutes": 6
}`;

  let text: string | undefined;
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
        response_format: { type: "json_object" },
      }),
    });

    const rawBody = await res.text();
    if (!res.ok) {
      lastError = `${model} → ${res.status} ${rawBody.slice(0, 200)}`;
      if (res.status !== 429 && res.status < 500) break;
      continue;
    }

    let wrapper;
    try {
      wrapper = safeJsonParse(rawBody);
    } catch (e) {
      lastError = `${model} → wrapper parse fail: ${(e as Error).message} | body: ${rawBody.slice(0, 200)}`;
      continue;
    }
    const content: string | undefined = wrapper?.choices?.[0]?.message?.content;
    if (content && content.length > 100) {
      text = content;
      break;
    }
    lastError = `${model} → empty content`;
  }
  if (!text) throw new Error(`OpenRouter all models failed. Last: ${lastError}`);

  const parsed = safeJsonParse(text) as RewriteOutput;

  if (input.mode === "auto") {
    const id = extractVideoId(input.videoUrl);
    const embed = `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:1.5rem"><iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div>\n\n`;
    parsed.content_md = embed + parsed.content_md;
  }

  return parsed;
}

function extractVideoId(url: string): string {
  const m = url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?&]+)/);
  return m ? m[1] : "";
}
