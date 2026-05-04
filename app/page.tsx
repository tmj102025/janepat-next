import Link from "next/link";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { listPublishedPosts } from "@/lib/pocketbase";
import { BrandStrip } from "@/components/BrandStrip";
import { Testimonials } from "@/components/Testimonials";
import { LatestVideos } from "@/components/LatestVideos";

export default async function HomePage() {
  const featuredPosts = await listPublishedPosts({ featured: true, limit: 3 });

  return (
    <>
      {/* Hero — cream canvas, coral CTA */}
      <section className="hero-band px-6 py-14 md:py-18">
        <div className="mx-auto max-w-[1200px] grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cc785c] live-pulse" />
              AI Expert · ภาษาไทย
            </div>
            <h1 className="mt-6 font-display text-[56px] leading-[1.05] tracking-[-1.5px] text-[#141413] md:text-[80px] lg:text-[96px]">
              เรียนรู้ AI<br />
              ภาษาไทย<br />
              <span className="text-[#cc785c]">กับ Tim Janepat</span>
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-[1.55] text-[#3d3d3a]">
              ทุกเรื่อง AI ที่คนไทยควรรู้ — ChatGPT, Claude, Gemini, AI Marketing, Automation
              สอนให้เข้าใจง่าย ใช้ได้จริง โดยผู้เชี่ยวชาญที่สอนคนไทยมาแล้วกว่า{" "}
              <span className="text-[#141413] font-medium">1,200+</span> คน
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#cc785c] px-5 text-[14px] font-medium text-white transition hover:bg-[#a9583e]"
              >
                อ่านบทความ AI →
              </Link>
              <Link
                href="/services"
                className="inline-flex h-10 items-center rounded-full border border-[#e6dfd8] bg-[#faf9f5] px-5 text-[14px] font-medium text-[#141413] hover:border-[#cc785c]"
              >
                ดูบริการของ Tim
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4 max-w-3xl">
              <Stat value="28.8K+" label="YouTube subscribers" />
              <Stat value="1,200+" label="นักเรียน AI" />
              <Stat value="10+" label="ปีในวงการดิจิทัล" />
              <Stat value="100+" label="บทความ AI" />
            </div>
          </div>

          {/* Hero illustration card — dark navy product mockup */}
          <div className="hidden lg:block">
            <div className="rounded-xl bg-[#181715] p-6 shadow-sm">
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#a09d96]">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#5db872]" />
                  Live activity
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <ActivityItem badge="LIVE" badgeColor="bg-[#c64545]" title="ChatGPT 5 Code Mode" meta="ออกอากาศใน 3 ชั่วโมง" />
                <ActivityItem badge="NEW" badgeColor="bg-[#cc785c]" title="n8n + Claude Workflow" meta="บทความใหม่ · 12 นาที" />
                <ActivityItem badge="HOT" badgeColor="bg-[#e8a55a]" title="AI Marketing Stack 2026" meta="2.4k views อาทิตย์นี้" />
              </div>

              <div className="mt-6 rounded-lg bg-[#1f1e1b] p-5 border border-[#252320]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cc785c] font-display text-[22px] text-white">
                    T
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#faf9f5]">Tim Janepat</div>
                    <div className="text-[12px] text-[#a09d96]">AI Expert · Bangkok</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-medium">
                  <div className="rounded bg-[#252320] px-2 py-1.5 text-[#5db8a6] text-center">
                    Gemini Cert.
                  </div>
                  <div className="rounded bg-[#252320] px-2 py-1.5 text-[#e8a55a] text-center">
                    28.8K · YT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandStrip />

      {/* Featured Articles — cream canvas with hairline cards */}
      <section className="px-6 py-14 md:py-18">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
                Latest Articles
              </div>
              <h2 className="mt-2 font-display text-[40px] leading-[1.1] tracking-[-0.7px] text-[#141413] md:text-[56px]">
                บทความ AI ล่าสุด
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-[14px] font-medium text-[#cc785c] underline underline-offset-4 hover:text-[#a9583e]"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {featuredPosts.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/ai/${post.category}/${post.slug}`}
                  className="group rounded-xl border border-[#e6dfd8] bg-[#faf9f5] overflow-hidden transition hover:border-[#cc785c]"
                >
                  {post.cover && (
                    <div className="aspect-video overflow-hidden bg-[#efe9de]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover}
                        alt={post.title_th}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
                      {post.category}
                    </div>
                    <h3 className="mt-3 font-display text-[24px] leading-[1.15] tracking-[-0.3px] text-[#141413] line-clamp-2">
                      {post.title_th}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.55] text-[#3d3d3a] line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.reading_minutes && (
                      <div className="mt-4 text-[12px] font-medium text-[#6c6a64]">
                        ⏱ {post.reading_minutes} นาที
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {AI_CATEGORIES.slice(0, 3).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ai/${cat.slug}`}
                  className="group rounded-xl border border-dashed border-[#e6dfd8] bg-[#faf9f5] p-6 hover:border-[#cc785c] transition"
                >
                  <div className="flex h-32 items-center justify-center">
                    <div className="font-display text-[64px] leading-none text-[#cc785c]/40">
                      AI
                    </div>
                  </div>
                  <div className="mt-4 text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
                    {cat.name}
                  </div>
                  <div className="mt-2 text-[14px] text-[#6c6a64]">
                    บทความใหม่กำลังจะมา
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* CTA band — coral callout */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-xl bg-[#cc785c] p-6 md:p-12 text-white">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-white/70">
                  Services · 4 ทาง
                </div>
                <h2 className="mt-4 font-display text-[44px] leading-[1.1] tracking-[-0.7px] md:text-[56px]">
                  ทำงาน AI<br />ร่วมกับ Tim
                </h2>
                <p className="mt-5 max-w-md text-[17px] leading-[1.55] text-white/90">
                  Brand deal · AI consulting · Corporate training · Online course —
                  ทุกอย่างมุ่งเน้น &quot;ผลลัพธ์&quot; ไม่ใช่แค่ความรู้
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/services"
                    className="inline-flex h-10 items-center rounded-full bg-[#faf9f5] px-5 text-[14px] font-medium text-[#141413] hover:bg-white"
                  >
                    ดูบริการทั้งหมด →
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center rounded-full border border-white/40 px-5 text-[14px] font-medium text-white hover:border-white"
                  >
                    ติดต่อ Tim
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ServiceTile num="01" title="Brand Partnership" />
                <ServiceTile num="02" title="AI Consulting" />
                <ServiceTile num="03" title="Corporate Training" />
                <ServiceTile num="04" title="Online Course" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest YouTube videos — last section before footer */}
      <LatestVideos />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[40px] leading-none tracking-[-0.5px] text-[#141413]">
        {value}
      </div>
      <div className="mt-2 text-[12px] font-medium uppercase tracking-[1.5px] text-[#6c6a64]">
        {label}
      </div>
    </div>
  );
}

function ActivityItem({
  badge,
  badgeColor,
  title,
  meta,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-[#1f1e1b] p-3 border border-[#252320]">
      <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-[1.5px] text-white ${badgeColor}`}>
        {badge}
      </span>
      <div className="min-w-0">
        <div className="text-[14px] font-medium text-[#faf9f5] truncate">{title}</div>
        <div className="text-[12px] text-[#a09d96]">{meta}</div>
      </div>
    </div>
  );
}

function ServiceTile({ num, title }: { num: string; title: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-5 border border-white/15">
      <div className="text-[11px] font-mono text-white/70">{num}</div>
      <div className="mt-3 font-display text-[20px] leading-[1.2] tracking-[-0.2px]">
        {title}
      </div>
    </div>
  );
}
