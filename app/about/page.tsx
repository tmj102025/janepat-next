import Link from "next/link";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps, webPageSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "เกี่ยวกับ Tim Janepat — AI Expert ภาษาไทย",
  description:
    "Tim Janepat — นักการตลาดดิจิทัล 10+ ปี Gemini Certified Trainer YouTube creator @TimJanepat 28K+ subscribers สอน AI ภาษาไทยให้คนไทยใช้ได้จริง",
  path: "/about",
  type: "profile",
});

const credentials = [
  { label: "10+ ปี", desc: "ประสบการณ์ Digital Marketing" },
  { label: "28.8K", desc: "YouTube subscribers" },
  { label: "100+", desc: "บทความ AI ที่เผยแพร่" },
];

export default function AboutPage() {
  const url = `${SITE.url}/about`;
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "เกี่ยวกับ Tim", url },
  ]);
  const webPage = webPageSchema({
    url,
    name: "เกี่ยวกับ Tim Janepat",
    description: "ประวัติและความเชี่ยวชาญของ Tim Janepat — AI Expert และนักการตลาดดิจิทัลของไทย",
    type: "AboutPage",
  });

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(webPage)} />

      <div className="min-h-screen bg-[#faf9f5]">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
            About
          </div>
          <h1 className="mt-3 font-display text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.8px] text-[#141413]">
            <span className="text-[#cc785c]">Tim Janepat</span>
            <br />สอนคนไทยใช้ AI สร้างรายได้จริง
          </h1>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-3xl px-6 pb-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {credentials.map((c) => (
              <div key={c.label} className="rounded-xl border border-[#e6dfd8] bg-white p-5">
                <div className="font-display text-[32px] leading-none tracking-[-0.5px] text-[#141413]">
                  {c.label}
                </div>
                <div className="mt-2 text-[12px] text-[#6c6a64]">{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Concise prose — single flowing section */}
        <section className="mx-auto max-w-3xl px-6 pb-10">
          <div className="space-y-4 text-[16px] leading-[1.75] text-[#3d3d3a]">
            <p>
              ผมคือ Timothy Janepat (Tim) — นักการตลาดดิจิทัลและผู้เชี่ยวชาญ AI ภาษาไทย
              เริ่มทำ digital marketing ตั้งแต่ปี 2014 ทำงานกับแบรนด์ใหญ่ทั้งในและต่างประเทศ
              ก่อนจะมาโฟกัสที่ AI อย่างจริงจังในปี 2022 หลังจาก ChatGPT เปิดตัว
              และเห็นว่า AI กำลังจะเปลี่ยนวิธีที่คนทำงานทุกอุตสาหกรรม
            </p>
            <p>
              สิ่งที่ผมโฟกัสตลอดคือการ <strong className="text-[#141413]">&quot;ทำเรื่อง AI ที่ดูยาก ให้คนทั่วไปใช้ได้จริง&quot;</strong>
              {" "}— ผ่าน YouTube channel{" "}
              <a href={SITE.social.youtube} target="_blank" rel="noopener" className="text-[#cc785c] hover:text-[#a9583e]">
                @TimJanepat
              </a>
              , บทความบน janepat.com และ workshop องค์กร
              เชี่ยวชาญ Generative AI, Prompt Engineering (ChatGPT, Claude, Gemini),
              AI Marketing, AI Automation ผ่าน n8n / Make / Zapier และ Corporate AI Training
            </p>
            <p>
              เป็น <strong className="text-[#141413]">Google Gemini Certified Trainer</strong> และวิทยากรอบรม AI
              ให้บริษัทไทยกว่า 30+ องค์กร — ตั้งแต่ SME, enterprise ไปจนถึงหน่วยงานราชการ
              เป้าหมายคืออยากให้คนไทยทุกคน — ทั้งเจ้าของธุรกิจ คนทำงาน content creator
              และนักเรียนนักศึกษา — ใช้ AI เพิ่มผลผลิตและสร้างรายได้ได้จริง
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex h-10 items-center rounded-full bg-[#cc785c] px-5 text-[14px] font-medium text-white hover:bg-[#a9583e] transition"
            >
              อ่านบทความ AI →
            </Link>
            <Link
              href="/services"
              className="inline-flex h-10 items-center rounded-full border border-[#e6dfd8] bg-white px-5 text-[14px] font-medium text-[#141413] hover:border-[#cc785c] hover:text-[#cc785c] transition"
            >
              อบรมองค์กร
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-full border border-[#e6dfd8] bg-white px-5 text-[14px] font-medium text-[#141413] hover:border-[#cc785c] hover:text-[#cc785c] transition"
            >
              ติดต่อ
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
