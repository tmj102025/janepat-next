import Link from "next/link";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "บริการของ Tim Janepat — Brand Deal, AI Consulting, Corporate Training",
  description:
    "บริการของ Tim Janepat — Brand partnership บน YouTube, AI consulting สำหรับธุรกิจ, อบรม AI in-house สำหรับองค์กร และคอร์ส AI ออนไลน์ภาษาไทย",
  path: "/services",
});

const services = [
  {
    name: "Brand Partnership",
    tagline: "YouTube sponsored content + paid review",
    description:
      "ผมร่วมงานกับแบรนด์ AI/Tech ทั่วโลกผ่านช่อง YouTube @TimJanepat (28.8K subs) ในรูปแบบ dedicated review, integration, สปอนเซอร์ และเนื้อหาคู่กัน — เน้นคุณภาพ ตรงกลุ่มผู้ชมไทยที่สนใจ AI และเทคโนโลยี",
    deliverables: [
      "Dedicated YouTube video (8-15 นาที)",
      "Pre-production strategy session",
      "Cross-promote บน FB / IG / TikTok / X",
      "Performance report หลัง publish 30 วัน",
    ],
    pricing: "เริ่มที่ ฿20,000 ต่อ video",
    cta: "ขอ rate card",
  },
  {
    name: "AI Consulting",
    tagline: "ออกแบบ AI workflow ให้ธุรกิจ",
    description:
      "สำหรับเจ้าของธุรกิจที่อยากใช้ AI จริง ๆ ในการลดต้นทุน เพิ่มยอดขาย หรือ automate งาน — ผม consult แบบ end-to-end ตั้งแต่ audit ปัญหา ออกแบบ workflow เลือก AI tools และ implement ผ่าน ChatGPT, Claude, n8n, Make",
    deliverables: [
      "Discovery session 2 ชั่วโมง",
      "AI workflow blueprint (PDF)",
      "Tool stack recommendation",
      "30-day implementation support",
    ],
    pricing: "เริ่มที่ ฿35,000 ต่อ project",
    cta: "ติดต่อ consult",
  },
  {
    name: "Corporate Training",
    tagline: "อบรม AI ให้องค์กรของคุณ",
    description:
      "หลักสูตรอบรม AI in-house ปรับแต่งตามอุตสาหกรรมและบทบาทของพนักงาน — ตั้งแต่ผู้บริหาร, ฝ่ายการตลาด, ฝ่ายขาย ไปจนถึง operations ผมเคยอบรมให้องค์กรไทยมาแล้วกว่า 30 บริษัท",
    deliverables: [
      "Pre-training survey + curriculum design",
      "Onsite / Online training (1-3 วัน)",
      "Hands-on workshop พร้อม template",
      "Post-training Q&A 30 วัน",
    ],
    pricing: "เริ่มที่ ฿80,000 ต่อหลักสูตร",
    cta: "ขอใบเสนอราคา",
  },
  {
    name: "Online Course",
    tagline: "คอร์ส AI ออนไลน์ Lifetime access",
    description:
      "คอร์สเรียน AI ภาษาไทยฉบับเต็มของ Tim — เริ่มต้นถึงระดับมืออาชีพ ครอบคลุม ChatGPT, Claude, AI Marketing, AI Automation พร้อม community + live Q&A ทุกเดือน",
    deliverables: [
      "12+ คอร์ส on-demand",
      "Live class ทุกเดือน",
      "Private community",
      "Templates & prompt library",
    ],
    pricing: "Lifetime ฿3,990 (ปกติ ฿7,990)",
    cta: "ติดต่อสมัคร",
  },
];

export default function ServicesPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "บริการ", url: `${SITE.url}/services` },
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />

      <section className="gradient-hero">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">Services</div>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 md:text-[60px]">
            ทำงานร่วมกับ <span className="text-gradient">Tim Janepat</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-stone-700">
            4 บริการที่ผมเปิดให้แบรนด์ บริษัท และคนที่อยากเรียน AI จริง ๆ —
            ทุกอย่างมุ่งเน้น &quot;ผลลัพธ์&quot; ไม่ใช่แค่ความรู้
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          {services.map((s) => (
            <div key={s.name} className="rounded-2xl border border-stone-200 bg-white p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-[24px] font-bold text-stone-900 md:text-[30px]">{s.name}</h2>
                  <div className="mt-1 text-[13px] font-mono uppercase tracking-widest text-teal-600">
                    {s.tagline}
                  </div>
                  <p className="mt-4 text-[15px] leading-[1.85] text-stone-700">{s.description}</p>
                </div>
                <div className="rounded-xl border border-teal-300 bg-teal-600/5 px-4 py-3">
                  <div className="text-[11px] font-mono text-teal-600">PRICING</div>
                  <div className="mt-1 text-[14px] font-semibold text-stone-900">{s.pricing}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.deliverables.map((d) => (
                  <div key={d} className="flex items-start gap-2 text-[13px] text-stone-700">
                    <span className="mt-1 text-teal-400">✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href={`/contact?type=${encodeURIComponent(s.name)}`}
                  className="inline-flex items-center rounded-full bg-teal-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-700"
                >
                  {s.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
