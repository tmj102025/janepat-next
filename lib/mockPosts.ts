/**
 * Mockup posts for layout preview before Pocketbase has data.
 * Matches the PostRecord shape from lib/pocketbase.ts so the same
 * rendering code works.
 */
import type { PostRecord } from "./pocketbase";

const baseContent = (title: string) => `
## ทำไมหัวข้อนี้สำคัญ

${title} เป็นเรื่องที่คนไทยกำลังให้ความสนใจมากในปี 2026 เพราะ AI กำลังเปลี่ยนวิธีทำงานในทุกวงการ — ตั้งแต่การตลาด การขาย การ operations ไปจนถึงการสร้างคอนเทนต์

> ถ้าคุณยังไม่ได้เริ่มใช้ AI ในวันนี้ คู่แข่งของคุณกำลังใช้อยู่แล้ว — และพวกเขาทำงานเสร็จเร็วกว่าคุณ 3-5 เท่า

## 3 จุดที่ต้องเข้าใจก่อน

1. **AI ไม่ใช่ตัวแทน** — มันเป็นเครื่องมือที่ขยายความสามารถของคุณ ไม่ใช่ตัวแทน
2. **คุณภาพ output ขึ้นกับ prompt** — Garbage in, garbage out — prompt ที่ดี output ก็ดี
3. **Iteration คือคำตอบ** — อย่าหวังให้ AI เก่งครั้งแรก ลอง 3-5 รอบจะได้ผลที่ใช้ได้จริง

## ขั้นตอนใช้งาน

### Step 1: กำหนดเป้าหมายให้ชัด

ก่อนเปิด ChatGPT หรือ Claude ให้ถามตัวเองก่อนว่า "ผลลัพธ์ที่ต้องการคืออะไร" — เป็น email? บทความ? โค้ด? วิดีโอ script?

### Step 2: ใส่ context ให้ครบ

AI ต้องการ context พอ ๆ กับคนใหม่ที่เพิ่งเข้าทีม — ใครคือ audience? brand voice เป็นยังไง? ตัวอย่างที่ดีหน้าตาแบบไหน?

### Step 3: ตรวจสอบและแก้ไข

อย่าใช้ output แรกเลย — อ่านอย่างละเอียด แก้จุดที่ AI ทำผิด แล้วค่อยใช้

## ตารางเปรียบเทียบ

| Tool | จุดเด่น | ใช้ได้กับ | ราคา |
|------|---------|-----------|------|
| ChatGPT | ทั่วไป + ecosystem ใหญ่ | งานทั่วไป | ฟรี - $20/mo |
| Claude | งานเขียน + วิเคราะห์ลึก | content + code | ฟรี - $20/mo |
| Gemini | เชื่อม Google Workspace | สาย Google | ฟรี - $20/mo |

## สรุป

${title} ถ้าทำแบบมีระบบ ใช้เวลา 2-4 สัปดาห์ก็เห็นผล — สำคัญที่สุดคือต้องลงมือทำจริง ไม่ใช่แค่อ่าน
`;

const baseFAQ = (title: string) => [
  {
    q: `${title} เริ่มใช้งานต้องเตรียมอะไรบ้าง?`,
    a: "อย่างน้อยต้องมี: AI account (ChatGPT หรือ Claude), เป้าหมายที่ชัดเจน, และตัวอย่างผลลัพธ์ที่ต้องการ ใช้เวลาเซ็ตอัป 1 ชั่วโมงก็เริ่มได้",
  },
  {
    q: "ใช้ได้กับธุรกิจขนาดเล็กไหม?",
    a: "ได้แน่นอน — จริง ๆ แล้ว SME ได้ประโยชน์มากกว่าธุรกิจใหญ่ เพราะปรับเปลี่ยนเร็ว ไม่มี bureaucracy ลองเริ่มจากงาน 1-2 อย่างก่อน",
  },
  {
    q: "ค่าใช้จ่ายโดยรวมประมาณเท่าไหร่?",
    a: "เริ่มจากฟรี (ChatGPT free / Claude free) — ถ้าต้องการ feature เต็ม ราว ฿700/เดือน ต่อคน คุ้มมากเทียบกับเวลาที่ประหยัดได้",
  },
];

const baseCitations = [
  { label: "OpenAI Documentation", url: "https://platform.openai.com/docs" },
  { label: "Anthropic Claude Docs", url: "https://docs.anthropic.com" },
];

const MOCK_BASE: Pick<PostRecord, "published" | "featured" | "author"> = {
  published: true,
  featured: false,
  author: "Tim Janepat",
};

const seeds: Array<Omit<PostRecord, "content_md" | "faq_jsonld" | "citations" | "tags" | "published" | "featured" | "author">> = [
  {
    id: "mock-01",
    slug: "chatgpt-prompt-engineering-thai",
    title_th: "Prompt Engineering ChatGPT ภาษาไทย — เทคนิคที่คนไทยไม่ค่อยรู้",
    excerpt: "5 เทคนิค prompt ที่ทำให้ ChatGPT ตอบภาษาไทยได้คมขึ้น แม่นขึ้น พร้อมตัวอย่าง template ที่เอาไปใช้ได้ทันที",
    cover: "https://picsum.photos/seed/chatgpt-prompt/1200/675",
    category: "chatgpt",
    reading_minutes: 8,
    created: "2026-05-02T10:00:00Z",
    updated: "2026-05-02T10:00:00Z",
  },
  {
    id: "mock-02",
    slug: "claude-code-vs-chatgpt-code-mode",
    title_th: "Claude Code vs ChatGPT Code Mode — เลือกตัวไหนดีในปี 2026",
    excerpt: "เปรียบเทียบ AI สองตัวนี้ทั้ง use case ราคา ความเร็ว และคุณภาพโค้ด — สรุปตอบจบสำหรับคนไทย",
    cover: "https://picsum.photos/seed/claude-vs-chatgpt/1200/675",
    category: "claude",
    reading_minutes: 10,
    created: "2026-05-01T08:00:00Z",
    updated: "2026-05-01T08:00:00Z",
  },
  {
    id: "mock-03",
    slug: "ai-marketing-stack-2026",
    title_th: "AI Marketing Stack 2026 — เครื่องมือที่ทีม performance ใช้จริง",
    excerpt: "10 เครื่องมือ AI ที่นักการตลาดไทยใช้ในปี 2026 ครอบคลุม content ads SEO social analytics พร้อม pricing",
    cover: "https://picsum.photos/seed/ai-marketing/1200/675",
    category: "marketing",
    reading_minutes: 12,
    created: "2026-04-30T09:00:00Z",
    updated: "2026-04-30T09:00:00Z",
  },
  {
    id: "mock-04",
    slug: "n8n-claude-workflow-automation",
    title_th: "n8n + Claude Workflow — Automate งานทั้งระบบใน 1 ชั่วโมง",
    excerpt: "Tutorial step-by-step สร้าง workflow อัตโนมัติด้วย n8n + Claude API — รับเมล/Line/Telegram → AI ตอบ → บันทึก DB",
    cover: "https://picsum.photos/seed/n8n-claude/1200/675",
    category: "automation",
    reading_minutes: 15,
    created: "2026-04-28T11:00:00Z",
    updated: "2026-04-28T11:00:00Z",
  },
  {
    id: "mock-05",
    slug: "ai-tools-2026-business-stack",
    title_th: "AI Tools รวม 2026 — เลือก stack สำหรับธุรกิจขนาดเล็ก",
    excerpt: "รวม AI tools ที่จำเป็นสำหรับธุรกิจ SME ไทย — แยกตามแผนก HR Sales Marketing Operations พร้อมราคา",
    cover: "https://picsum.photos/seed/ai-tools-stack/1200/675",
    category: "tools",
    reading_minutes: 9,
    created: "2026-04-26T10:00:00Z",
    updated: "2026-04-26T10:00:00Z",
  },
  {
    id: "mock-06",
    slug: "ai-for-business-cost-reduction",
    title_th: "AI สำหรับธุรกิจ — Case study ลดต้นทุน 40% ใน 3 เดือน",
    excerpt: "บทเรียนจริงจากธุรกิจไทย 3 แห่งที่นำ AI มาใช้ลด customer service cost content creation cost และ operations",
    cover: "https://picsum.photos/seed/ai-business/1200/675",
    category: "business",
    reading_minutes: 11,
    created: "2026-04-24T08:30:00Z",
    updated: "2026-04-24T08:30:00Z",
  },
  {
    id: "mock-07",
    slug: "ai-creator-faceless-channel",
    title_th: "Faceless YouTube Channel ด้วย AI — ทำคนเดียวรายได้ 6 หลัก",
    excerpt: "ขั้นตอนสร้าง YouTube channel แบบไม่ต้องโชว์หน้าด้วย AI — script voiceover video thumbnail พร้อมตัวอย่างจริง",
    cover: "https://picsum.photos/seed/faceless-channel/1200/675",
    category: "creator",
    reading_minutes: 14,
    created: "2026-04-22T07:00:00Z",
    updated: "2026-04-22T07:00:00Z",
  },
  {
    id: "mock-08",
    slug: "ai-101-thai-beginner",
    title_th: "AI 101 ภาษาไทย — เริ่มต้นจากศูนย์ใน 30 นาที",
    excerpt: "คู่มือ AI สำหรับมือใหม่ — Generative AI คืออะไร ใช้ตัวไหนก่อน prompt ยังไง ความเสี่ยงที่ต้องรู้",
    cover: "https://picsum.photos/seed/ai-101/1200/675",
    category: "basics",
    reading_minutes: 6,
    created: "2026-04-20T12:00:00Z",
    updated: "2026-04-20T12:00:00Z",
  },
  {
    id: "mock-09",
    slug: "midjourney-thai-content",
    title_th: "Midjourney v7 สำหรับคอนเทนต์ไทย — Prompt template + ตัวอย่าง",
    excerpt: "ใช้ Midjourney สร้างภาพประกอบบทความ social post ad creative ได้อย่างมือโปร พร้อม prompt 30+ template",
    cover: "https://picsum.photos/seed/midjourney/1200/675",
    category: "tools",
    reading_minutes: 10,
    created: "2026-04-18T09:00:00Z",
    updated: "2026-04-18T09:00:00Z",
  },
  {
    id: "mock-10",
    slug: "claude-skills-mcp-thai",
    title_th: "Claude Skills + MCP — ทำให้ Claude ใช้กับงานคุณได้ทันที",
    excerpt: "Skills คือ feature ใหม่ที่ทำให้ Claude เก่งงานเฉพาะของคุณ — สอนตั้งแต่ 0 จนพร้อมใช้กับทีม",
    cover: "https://picsum.photos/seed/claude-skills/1200/675",
    category: "claude",
    reading_minutes: 13,
    created: "2026-04-16T10:00:00Z",
    updated: "2026-04-16T10:00:00Z",
  },
  {
    id: "mock-11",
    slug: "ai-content-calendar-90-days",
    title_th: "Content Calendar 90 วันด้วย AI — แผนคอนเทนต์ทั้งไตรมาสใน 1 ชั่วโมง",
    excerpt: "Workflow วางแผน content 90 วันด้วย Claude + Notion + Make — สร้าง 270+ ideas พร้อม brief และ deadline",
    cover: "https://picsum.photos/seed/content-calendar/1200/675",
    category: "marketing",
    reading_minutes: 11,
    created: "2026-04-14T11:30:00Z",
    updated: "2026-04-14T11:30:00Z",
  },
  {
    id: "mock-12",
    slug: "suno-thai-music-prompt",
    title_th: "Suno AI สร้างเพลงไทย — Prompt structure + เทคนิค genre Thai pop",
    excerpt: "วิธีเขียน prompt Suno ให้ออกมาเป็นเพลงไทยฟังเป็นธรรมชาติ ครอบคลุม pop rock luktung และ indie",
    cover: "https://picsum.photos/seed/suno-thai/1200/675",
    category: "creator",
    reading_minutes: 8,
    created: "2026-04-12T14:00:00Z",
    updated: "2026-04-12T14:00:00Z",
  },
];

export const MOCK_POSTS: PostRecord[] = seeds.map((s) => ({
  ...MOCK_BASE,
  ...s,
  content_md: baseContent(s.title_th),
  faq_jsonld: baseFAQ(s.title_th),
  citations: baseCitations,
  tags: [s.category, "AI", "Tutorial"],
}));

export function findMockPost(slug: string): PostRecord | undefined {
  return MOCK_POSTS.find((p) => p.slug === slug);
}
