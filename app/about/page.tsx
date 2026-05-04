import Link from "next/link";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "เกี่ยวกับ Tim Janepat — AI Expert ภาษาไทย",
  description:
    "Tim Janepat — ผู้ก่อตั้ง AiCEO Academy ผู้สอน AI ภาษาไทยมากว่า 1,200 คน นักการตลาดดิจิทัล 10+ ปี Gemini Certified Trainer และ YouTube creator 28K+ subscribers",
  path: "/about",
  type: "profile",
});

const credentials = [
  { label: "10+ ปี", desc: "ประสบการณ์ Digital Marketing" },
  { label: "1,200+", desc: "นักเรียนที่ผ่านการสอน" },
  { label: "28.8K", desc: "YouTube subscribers" },
  { label: "100+", desc: "บทความ AI ที่เผยแพร่" },
];

const expertise = [
  "Generative AI & Large Language Models",
  "ChatGPT, Claude, Gemini Prompt Engineering",
  "AI Marketing & Content Automation",
  "n8n / Make / Zapier Workflow Automation",
  "AI Tools Strategy & Selection",
  "Corporate AI Training & Change Management",
];

export default function AboutPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "เกี่ยวกับ Tim", url: `${SITE.url}/about` },
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />

      <section className="gradient-hero">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
            About
          </div>
          <h1 className="mt-4 max-w-3xl text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[60px]">
            <span className="text-gradient">Tim Janepat</span> — สอนคนไทย
            <br />
            ใช้ AI สร้างรายได้จริง
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-zinc-300">
            ผมคือ Timothy Janepat (Tim) — นักการตลาดดิจิทัลและผู้เชี่ยวชาญ AI ภาษาไทย
            ผู้ก่อตั้ง AiCEO Academy แพลตฟอร์มสอน AI ออนไลน์ภาษาไทยอันดับต้น ๆ ของประเทศ
            ตลอด 10 ปีที่ผ่านมา ผมโฟกัสที่การ &quot;ทำเรื่อง AI ที่ดูยาก ให้คนทั่วไปใช้ได้จริง&quot;
          </p>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-16">
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {credentials.map((c) => (
            <div key={c.label} className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-6">
              <div className="text-[28px] font-bold text-white md:text-[36px]">{c.label}</div>
              <div className="mt-2 text-[13px] text-zinc-400">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[28px] font-bold text-white md:text-[36px]">เส้นทางของผม</h2>
          <div className="prose-th mt-8">
            <p>
              ผมเริ่มทำ digital marketing ตั้งแต่ปี 2014 ทำงานกับแบรนด์ใหญ่ทั้งในและต่างประเทศ
              ก่อนจะมาโฟกัสที่ AI อย่างจริงจังในปี 2022 หลังจาก ChatGPT เปิดตัว
              ผมเห็นว่า AI จะเปลี่ยนวิธีที่คนทำงานทุกอุตสาหกรรม — แต่คนไทยส่วนใหญ่ยังเข้าไม่ถึง เพราะ:
            </p>
            <ul>
              <li>เนื้อหา AI คุณภาพดีส่วนใหญ่เป็นภาษาอังกฤษ</li>
              <li>คอร์สที่มีอยู่เน้น technical เกินไป ไม่ได้ทำให้คนทั่วไปใช้ได้จริง</li>
              <li>ขาดคนที่ &quot;แปล&quot; AI ที่ซับซ้อนเป็นภาษาที่คนทำธุรกิจเข้าใจ</li>
            </ul>
            <p>
              ผมจึงตั้งใจสร้าง <strong>AiCEO Academy</strong> และ <strong>janepat.com</strong>
              เพื่อเป็นแหล่งความรู้ AI ภาษาไทยที่คนไทยทุกคนเข้าถึงได้ —
              ตั้งแต่เจ้าของธุรกิจ คนทำงาน content creator จนถึงนักเรียนนักศึกษา
            </p>

            <h2>สิ่งที่ผมเชี่ยวชาญ</h2>
            <ul>
              {expertise.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>

            <h2>Credentials & Recognitions</h2>
            <ul>
              <li>Google Gemini Certified Trainer</li>
              <li>Founder, AiCEO Academy ({SITE.related.aiceoAcademy.replace("https://", "")})</li>
              <li>YouTube Creator @TimJanepat — 28,800+ subscribers</li>
              <li>Brand partner: Hostinger, Zoer.ai และอีกหลายแบรนด์ AI/Tech ระดับสากล</li>
              <li>วิทยากรองค์กร — บรรยายและอบรม AI ให้บริษัทไทยกว่า 30+ องค์กร</li>
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/ai"
              className="inline-flex items-center rounded-full bg-teal-400 px-6 py-3 text-[14px] font-semibold text-zinc-900 hover:bg-teal-300"
            >
              ดูบทความ AI ของผม →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-[14px] text-white hover:border-teal-400/30"
            >
              ติดต่อร่วมงาน
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
