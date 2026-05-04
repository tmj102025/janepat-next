import Link from "next/link";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdScriptProps,
  serviceSchema,
} from "@/lib/schema";

export const metadata = buildMetadata({
  title: "อบรม AI ให้ทีมและองค์กร — In-house Training โดย Tim Janepat",
  description:
    "บริการอบรม AI In-house Training เฉพาะองค์กร ปรับเนื้อหาให้เข้ากับธุรกิจของคุณ ลงพื้นที่ Onsite ทั่วประเทศไทย โดย Tim Janepat",
  path: "/services",
});

const FEATURES = [
  { icon: "🏢", title: "Onsite ที่ออฟฟิศคุณ", desc: "จัดอบรมที่บริษัทคุณโดยตรง ไม่ต้องเดินทาง" },
  { icon: "🎯", title: "Customize เนื้อหา", desc: "ปรับเนื้อหาเฉพาะงานของทีม การตลาด · ขาย · ผลิต · HR" },
  { icon: "📋", title: "ใบกำกับภาษีเต็มรูปแบบ", desc: "ออกใบเสร็จ/ใบกำกับภาษี เบิกเป็นค่าใช้จ่ายบริษัทได้" },
  { icon: "📅", title: "จัดเวลาตามองค์กร", desc: "ครึ่งวัน · เต็มวัน · หลายวันต่อเนื่อง — ตามตารางคุณ" },
  { icon: "🛠️", title: "Workshop ลงมือทำจริง", desc: "ทุกคนได้ Hands-on ใช้ AI Tools กับงานบริษัทตัวเอง" },
];

const TOPICS = [
  {
    title: "AI for Marketing",
    items: ["AI Content Creation", "Performance Ads ด้วย AI", "Social Media Automation", "Data-driven Decision"],
  },
  {
    title: "AI for Operations",
    items: ["Workflow Automation", "Document Processing", "Customer Support AI", "Internal Knowledge Base"],
  },
  {
    title: "AI for Sales",
    items: ["Lead Generation", "Sales Script Generator", "CRM Integration", "Predictive Analytics"],
  },
  {
    title: "AI Foundation",
    items: ["Prompt Engineering", "AI Tools Stack", "Use Case Framework", "Risk & Governance"],
  },
];

const STEPS = [
  { n: "01", title: "Discovery Call", desc: "พูดคุยเข้าใจธุรกิจและความต้องการของทีม (30 นาที)" },
  { n: "02", title: "ออกแบบหลักสูตร", desc: "ปรับเนื้อหาเฉพาะองค์กร ส่งใบเสนอราคาภายใน 3 วัน" },
  { n: "03", title: "อบรม Onsite", desc: "ลงพื้นที่ทำ Workshop ที่ออฟฟิศคุณ" },
  { n: "04", title: "Follow-up", desc: "ติดตามผลลัพธ์ + กลุ่ม Support หลังอบรม 30 วัน" },
];

const FAQS = [
  { q: "ราคาเริ่มต้นเท่าไหร่?", a: "เริ่มต้นที่ ฿19,900 มีให้เลือกแบบครึ่งวัน 3 ชั่วโมง หรือเต็มวัน" },
  { q: "รับอบรมที่ไหน?", a: "ทั่วประเทศไทย Onsite ที่ออฟฟิศของคุณ หรือสถานที่ที่บริษัทเลือก" },
  { q: "ต้องเตรียมอะไรบ้าง?", a: "แค่ห้องประชุมที่มีจอ Projector/TV และ Wi-Fi" },
  { q: "มี Certificate ไหม?", a: "มี ออกให้ผู้เรียนทุกคนหลังจบอบรม รับรองโดย Tim Janepat" },
];

export default function ServicesPage() {
  const url = `${SITE.url}/services`;
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "บริการ", url },
  ]);
  const service = serviceSchema({
    name: "AI In-house Training โดย Tim Janepat",
    description:
      "บริการอบรม AI In-house Training สำหรับองค์กรไทย Onsite ทั่วประเทศ ปรับเนื้อหาเฉพาะธุรกิจ ครอบคลุม AI for Marketing, Operations, Sales และ Foundation",
    url,
    serviceType: ["AI Corporate Training", "AI Workshop", "AI Consulting"],
    priceRangeFrom: 19900,
    priceCurrency: "THB",
  });
  const faq = faqSchema(FAQS);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(service)} />
      <script {...jsonLdScriptProps(faq)} />

      <div className="min-h-screen bg-[#faf9f5]">
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-6 pt-12 pb-10 md:pt-16 md:pb-14 text-center">
          <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-[#cc785c]/10 px-3 py-1 text-[12px] font-medium text-[#cc785c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cc785c]" />
            In-house Training
          </div>
          <h1 className="font-display text-[36px] md:text-[56px] text-[#141413] leading-[1.05] tracking-[-0.8px] mb-4">
            อบรม AI <span className="text-[#cc785c]">ให้ทีมและองค์กร</span>
          </h1>
          <p className="font-sans text-[15px] md:text-[17px] text-[#3d3d3a] max-w-2xl mx-auto leading-[1.6]">
            บริการอบรม In-house Training เฉพาะองค์กร — ปรับเนื้อหาให้เข้ากับธุรกิจของคุณ
            ลงพื้นที่จริง ผลลัพธ์ใช้ได้จริง
          </p>
          <div className="mt-2 text-[13px] font-medium text-[#6c6a64]">
            ปรับเนื้อหาเฉพาะคุณ · ลงพื้นที่จริง · ผลลัพธ์ใช้ได้จริง
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact?type=training"
              className="inline-flex h-11 items-center rounded-full bg-[#cc785c] px-6 text-[14px] font-medium text-white hover:bg-[#a9583e] transition"
            >
              ขอใบเสนอราคา →
            </Link>
            <a
              href="#process"
              className="inline-flex h-11 items-center rounded-full border border-[#e6dfd8] bg-white px-6 text-[14px] font-medium text-[#141413] hover:border-[#cc785c] hover:text-[#cc785c] transition"
            >
              ดูขั้นตอน
            </a>
          </div>
        </section>

        {/* Why in-house — 5 feature cards */}
        <section className="bg-white border-y border-[#e6dfd8]">
          <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
            <div className="text-center mb-10">
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-2">
                ทำไม In-house
              </div>
              <h2 className="font-display text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.5px] text-[#141413]">
                จุดเด่นที่องค์กรไทยเลือกอบรมกับ Tim
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-5 hover:border-[#cc785c] transition"
                >
                  <div className="text-[28px] mb-3">{f.icon}</div>
                  <h3 className="font-sans font-bold text-[15px] text-[#141413] leading-snug mb-2">
                    {f.title}
                  </h3>
                  <p className="font-sans text-[13px] text-[#3d3d3a] leading-[1.55]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Training topics */}
        <section className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
          <div className="text-center mb-10">
            <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-2">
              หัวข้ออบรม
            </div>
            <h2 className="font-display text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.5px] text-[#141413]">
              ปรับให้เข้ากับทีมของคุณ
            </h2>
            <p className="mt-3 text-[14px] text-[#6c6a64] max-w-2xl mx-auto">
              เลือกหัวข้อที่ตรงกับงานของทีม — หรือผสมตามความต้องการ
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map((t) => (
              <div
                key={t.title}
                className="rounded-xl bg-white border border-[#e6dfd8] p-6 hover:border-[#cc785c] transition"
              >
                <h3 className="font-display text-[20px] tracking-[-0.2px] text-[#141413] mb-4">
                  {t.title}
                </h3>
                <ul className="space-y-2 text-[13px] text-[#3d3d3a]">
                  {t.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#cc785c]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Process timeline */}
        <section id="process" className="bg-[#f5f0e8] border-y border-[#e6dfd8]">
          <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
            <div className="text-center mb-10">
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-2">
                ขั้นตอน
              </div>
              <h2 className="font-display text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.5px] text-[#141413]">
                4 ขั้นตอน Onsite Training
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-xl bg-white border border-[#e6dfd8] p-6">
                  <div className="font-display text-[40px] leading-none text-[#cc785c]/40 mb-3">
                    {s.n}
                  </div>
                  <h3 className="font-sans font-bold text-[16px] text-[#141413] mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-[13px] text-[#3d3d3a] leading-[1.55]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-2">
              FAQ
            </div>
            <h2 className="font-display text-[28px] md:text-[36px] leading-[1.15] tracking-[-0.5px] text-[#141413]">
              คำถามที่พบบ่อย
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-[#e6dfd8] bg-white p-5 open:border-[#cc785c]/40"
              >
                <summary className="cursor-pointer list-none font-sans font-semibold text-[15px] text-[#141413] flex items-start gap-3">
                  <span className="text-[#cc785c] shrink-0">Q.</span>
                  <span>{f.q}</span>
                </summary>
                <div className="mt-3 ml-7 font-sans text-[14px] leading-[1.7] text-[#3d3d3a]">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-[1200px] px-6 pb-14">
          <div className="rounded-2xl bg-[#181715] p-8 md:p-12 text-center">
            <h2 className="font-display text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.5px] text-[#faf9f5] mb-3">
              พร้อมยกระดับทีมด้วย <span className="text-[#cc785c]">AI?</span>
            </h2>
            <p className="text-[14px] text-[#a09d96] mb-6">
              ตอบกลับภายใน 24 ชั่วโมง
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact?type=training"
                className="inline-flex h-11 items-center rounded-full bg-[#cc785c] px-6 text-[14px] font-medium text-white hover:bg-[#a9583e] transition"
              >
                ขอใบเสนอราคา →
              </Link>
              <a
                href={SITE.social.line}
                target="_blank"
                rel="noopener"
                className="inline-flex h-11 items-center rounded-full bg-[#252320] border border-[#252320] px-6 text-[14px] font-medium text-[#faf9f5] hover:bg-[#2f2c28] transition"
              >
                ติดต่อผ่าน LINE →
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
