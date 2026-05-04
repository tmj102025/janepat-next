import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/schema";
import { ContactForm } from "@/components/ContactForm";

export const metadata = buildMetadata({
  title: "ติดต่อ Tim Janepat — Brand Deal, Consulting, Training",
  description: "ติดต่อ Tim Janepat สำหรับ brand partnership, AI consulting, อบรมองค์กร หรือคำถามทั่วไป ตอบกลับภายใน 24 ชั่วโมง",
  path: "/contact",
});

export default function ContactPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "ติดต่อ", url: `${SITE.url}/contact` },
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />

      <section className="gradient-hero">
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-12 md:pt-28">
          <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">Contact</div>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] tracking-[-0.8px] text-[#141413] md:text-[56px]">
            ติดต่อ <span className="text-gradient">Tim</span>
          </h1>
          <p className="mt-6 text-[16px] leading-[1.85] text-[#3d3d3a]">
            กรอกฟอร์มด้านล่าง ผมหรือทีมจะตอบกลับภายใน 24 ชั่วโมง สำหรับงานเร่งด่วน LINE หรืออีเมลโดยตรงเร็วกว่า
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl grid gap-10 md:grid-cols-[1fr_280px]">
          <ContactForm />

          <aside className="space-y-4">
            <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">Direct</div>
              <ul className="mt-3 space-y-3 text-[14px]">
                <li>
                  <a href={`mailto:${SITE.author.email}`} className="text-[#141413] hover:text-[#cc785c]">
                    {SITE.author.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.social.line} target="_blank" rel="noopener" className="text-[#141413] hover:text-[#cc785c]">
                    LINE: @timjanepat
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">Social</div>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li><a href={SITE.social.youtube} target="_blank" rel="noopener" className="text-[#3d3d3a] hover:text-[#141413]">YouTube ↗</a></li>
                <li><a href={SITE.social.facebook} target="_blank" rel="noopener" className="text-[#3d3d3a] hover:text-[#141413]">Facebook ↗</a></li>
                <li><a href={SITE.social.instagram} target="_blank" rel="noopener" className="text-[#3d3d3a] hover:text-[#141413]">Instagram ↗</a></li>
                <li><a href={SITE.social.x} target="_blank" rel="noopener" className="text-[#3d3d3a] hover:text-[#141413]">X (Twitter) ↗</a></li>
                <li><a href={SITE.social.tiktok} target="_blank" rel="noopener" className="text-[#3d3d3a] hover:text-[#141413]">TikTok ↗</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
