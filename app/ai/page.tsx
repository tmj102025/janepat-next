import Link from "next/link";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, jsonLdScriptProps } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "AI คืออะไร — รวมความรู้ AI ภาษาไทย ครบทุกหัวข้อ",
  description:
    "Pillar hub ความรู้ AI ภาษาไทย — ChatGPT, Claude, Gemini, AI Marketing, AI Automation, Prompt Engineering, AI Tools — สอนแบบเข้าใจง่าย ใช้ได้จริง โดย Tim Janepat",
  path: "/ai",
});

const faqs = [
  {
    q: "AI คืออะไรในภาษาไทย?",
    a: "AI หรือ Artificial Intelligence (ปัญญาประดิษฐ์) คือเทคโนโลยีที่ทำให้คอมพิวเตอร์เลียนแบบความสามารถในการคิด เรียนรู้ และตัดสินใจของมนุษย์ได้ ในยุคปี 2024-2026 AI ที่ได้รับความนิยมมากที่สุดคือ Generative AI เช่น ChatGPT, Claude, และ Gemini ที่สามารถสร้างข้อความ ภาพ วิดีโอ และโค้ดได้",
  },
  {
    q: "คนไทยควรเริ่มเรียน AI จากไหน?",
    a: "เริ่มจากการเข้าใจ ChatGPT หรือ Claude ก่อน — ทั้งสองเป็น AI ที่ใช้งานง่ายและรองรับภาษาไทยดี ฝึก prompt พื้นฐาน เช่น การสรุปเนื้อหา ตอบอีเมล หรือเขียน content จากนั้นจึงค่อยขยายไปยัง AI Tools เฉพาะทาง เช่น AI สำหรับการตลาด หรือ AI Automation ผ่าน n8n, Make",
  },
  {
    q: "ใช้ AI ทำธุรกิจได้จริงไหม?",
    a: "ได้แน่นอน — ในปี 2026 ธุรกิจไทยจำนวนมากใช้ AI เพื่อ ลดต้นทุน customer service ผ่าน chatbot, สร้าง content ทางการตลาดอัตโนมัติ, วิเคราะห์ข้อมูลลูกค้า, และ automate งาน operations Tim สอนวิธีใช้ AI ทำธุรกิจจริงผ่านบริการ Corporate Training และ AI Consulting",
  },
  {
    q: "ChatGPT vs Claude vs Gemini ตัวไหนดีสุด?",
    a: "แต่ละตัวเก่งคนละด้าน: ChatGPT (GPT-4/5) เก่งทั่วไปและมี ecosystem ใหญ่ที่สุด, Claude เก่งงานเขียน วิเคราะห์เอกสารยาว และโค้ด, Gemini เชื่อมกับ Google Workspace ได้ลึก สำหรับคนไทย แนะนำใช้ ChatGPT หรือ Claude เป็นหลัก และเสริมด้วย Gemini ถ้าใช้ Google ecosystem หนัก",
  },
  {
    q: "เรียน AI ฟรีได้ที่ไหน?",
    a: "janepat.com มีบทความ AI ภาษาไทยฟรีทุกหัวข้อ — ครอบคลุม ChatGPT, Claude, AI Marketing, AI Automation, Prompt Engineering อ่านได้ทันทีโดยไม่ต้อง subscribe",
  },
];

export default function AIPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "ความรู้ AI", url: `${SITE.url}/ai` },
  ]);
  const faq = faqSchema(faqs);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(faq)} />

      <section className="gradient-hero">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
            Pillar Hub
          </div>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 md:text-[60px]">
            <span className="text-gradient">ความรู้ AI</span>
            <br />
            ภาษาไทย ครบทุกหัวข้อ
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-stone-700">
            แหล่งรวมความรู้ AI สำหรับคนไทย — ตั้งแต่พื้นฐาน ChatGPT, Claude, Gemini ไปจนถึง
            AI Marketing, AI Automation, Prompt Engineering และ AI Tools เลือกหัวข้อที่อยากเรียนรู้
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-[28px] font-bold text-stone-900 md:text-[36px]">หัวข้อ AI ทั้งหมด</h2>
          <p className="mt-3 text-[15px] text-stone-600">เลือกหัวข้อเพื่อดูบทความและ tutorial ทั้งหมดของแต่ละ topic</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AI_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/ai/${cat.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-7 transition hover:border-teal-300"
              >
                <div className={`inline-block rounded-full bg-gradient-to-r ${cat.color} bg-clip-text text-[12px] font-mono uppercase tracking-widest text-transparent`}>
                  /ai/{cat.slug}
                </div>
                <h3 className="mt-3 text-[22px] font-bold text-stone-900">{cat.name}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-stone-600">{cat.description}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-[13px] text-teal-600 transition group-hover:gap-2">
                  ดูบทความทั้งหมด <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-100 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">FAQ</div>
          <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[36px]">คำถามที่พบบ่อยเรื่อง AI</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-stone-200 bg-white p-6 open:border-teal-300"
              >
                <summary className="cursor-pointer list-none text-[16px] font-semibold text-stone-900">
                  <span className="mr-3 text-teal-600">Q.</span>
                  {f.q}
                </summary>
                <div className="mt-4 text-[15px] leading-[1.85] text-stone-700">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
