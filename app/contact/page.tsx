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
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">Contact</div>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 md:text-[56px]">
            ติดต่อ <span className="text-gradient">Tim</span>
          </h1>
          <p className="mt-6 text-[16px] leading-[1.85] text-stone-700">
            กรอกฟอร์มด้านล่าง ผมหรือทีมจะตอบกลับภายใน 24 ชั่วโมง สำหรับงานเร่งด่วน LINE หรืออีเมลโดยตรงเร็วกว่า
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl grid gap-10 md:grid-cols-[1fr_280px]">
          <ContactForm />

          <aside className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">Direct</div>
              <ul className="mt-3 space-y-3 text-[14px]">
                <li>
                  <a href={`mailto:${SITE.author.email}`} className="text-stone-900 hover:text-teal-600">
                    {SITE.author.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.social.line} target="_blank" rel="noopener" className="text-stone-900 hover:text-teal-600">
                    LINE: @timjanepat
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">Social</div>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li><a href={SITE.social.youtube} target="_blank" rel="noopener" className="text-stone-700 hover:text-stone-900">YouTube ↗</a></li>
                <li><a href={SITE.social.facebook} target="_blank" rel="noopener" className="text-stone-700 hover:text-stone-900">Facebook ↗</a></li>
                <li><a href={SITE.social.instagram} target="_blank" rel="noopener" className="text-stone-700 hover:text-stone-900">Instagram ↗</a></li>
                <li><a href={SITE.social.x} target="_blank" rel="noopener" className="text-stone-700 hover:text-stone-900">X (Twitter) ↗</a></li>
                <li><a href={SITE.social.tiktok} target="_blank" rel="noopener" className="text-stone-700 hover:text-stone-900">TikTok ↗</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
