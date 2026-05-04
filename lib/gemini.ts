/**
 * Gemini API helper — ใช้ free tier (gemini-2.0-flash หรือ gemini-2.5-flash)
 * ไม่ใช้ Anthropic API per memory
 */

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

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
- โทนเป็นกันเอง, อธิบายเหมือนคุยกับเพื่อน, ไม่ใช้คำราชการ
- เน้น "ทำไมคนไทยควรรู้" + "เอาไปใช้ยังไงได้จริง"
- หลีกเลี่ยงประโยค AI-ish เช่น "ในยุคปัจจุบันนี้..." "เป็นที่ทราบกันดีว่า..."
- ใช้ heading H2/H3 + bullet list + table เปรียบเทียบเมื่อเหมาะ
- ทุกบทความต้องมี TL;DR, แล้ว body, แล้ว FAQ`;

export async function rewriteToBlog(input: RewriteInput): Promise<RewriteOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY env var required");

  const isAuto = input.mode === "auto";

  const prompt = `${TIM_VOICE}

**งาน:** ${
    isAuto
      ? "วิดีโอนี้เป็นของ Tim เอง — สรุปเนื้อหาเป็นบทความที่อ่านง่าย พร้อมลิงก์ embed วิดีโอ"
      : "วิดีโอนี้เป็นของช่องคนอื่น — REWRITE เป็นมุมมองของ Tim โดยใช้ insight จาก transcript เป็นวัตถุดิบ ห้าม copy คำพูด ห้ามอ้างชื่อ creator ในเนื้อหาตรง ๆ (อ้างได้ใน citations เท่านั้น) ให้เนื้อหาดูเหมือน Tim เป็นคนอธิบายเอง"
  }

**Source video:**
- Title: ${input.videoTitle}
- Channel: ${input.channelName}
- URL: ${input.videoUrl}
- Category: ${input.category}

**Transcript:**
${input.transcript.slice(0, 30000)}

**Output (JSON only, no markdown fences):**
{
  "title_th": "หัวข้อภาษาไทยที่คนค้นหาจริง (60-65 ตัวอักษร, มี keyword หลัก)",
  "slug": "kebab-case-english-slug",
  "excerpt": "สรุปสั้น 2-3 ประโยค สำหรับ TL;DR + meta description (ไม่เกิน 160 ตัวอักษร)",
  "content_md": "บทความเต็มเป็น markdown — H2 sections, paragraphs, bullets, code blocks เมื่อจำเป็น ความยาว 1200-2000 คำ",
  "faq_jsonld": [{"q":"คำถามที่พบบ่อย 1","a":"คำตอบ"}, ...],  // 3-5 คำถาม
  "tags": ["tag1","tag2","tag3"],
  "reading_minutes": 6
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText.slice(0, 500)}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty content");

  const parsed = JSON.parse(text) as RewriteOutput;

  // เพิ่ม embed วิดีโอที่ส่วนบนของ content_md (สำหรับ auto mode = Tim's video)
  if (input.mode === "auto") {
    const embed = `<div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden;margin-bottom:1.5rem"><iframe src="https://www.youtube.com/embed/${extractVideoId(input.videoUrl)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div>\n\n`;
    parsed.content_md = embed + parsed.content_md;
  }

  return parsed;
}

function extractVideoId(url: string): string {
  const m = url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?&]+)/);
  return m ? m[1] : "";
}
