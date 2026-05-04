import Link from "next/link";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { listPublishedPosts } from "@/lib/pocketbase";
import { BrandStrip } from "@/components/BrandStrip";
import { Testimonials } from "@/components/Testimonials";
import { FeaturedVideo } from "@/components/FeaturedVideo";

export default async function HomePage() {
  const featuredPosts = await listPublishedPosts({ featured: true, limit: 3 });

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="hero-orbit" />
        <div className="absolute inset-0 dotted-grid opacity-40" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-teal-600">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 live-pulse" />
                AI Expert · ภาษาไทย · 28.8K subs
              </div>

              <h1 className="mt-7 text-[44px] font-semibold leading-[1.02] tracking-[-0.025em] text-stone-900 md:text-[76px] lg:text-[88px]">
                เรียนรู้
                <br />
                <span className="text-gradient">AI ภาษาไทย</span>
                <br />
                <span className="text-stroke-faint">กับ TIM JANEPAT</span>
              </h1>

              <p className="mt-7 max-w-xl text-[16px] leading-[1.85] text-stone-700 md:text-[18px]">
                ทุกเรื่อง AI ที่คนไทยควรรู้ — ChatGPT, Claude, Gemini, AI Marketing, Automation
                สอนให้เข้าใจง่าย ใช้ได้จริง โดยผู้เชี่ยวชาญที่สอนคนไทยมาแล้วกว่า{" "}
                <strong className="text-stone-900">1,200+</strong> คน
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/ai"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-teal-700 hover:scale-[1.03]"
                >
                  เริ่มเรียน AI ฟรี
                  <span className="text-[16px]">→</span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3.5 text-[14px] text-stone-900 transition hover:border-teal-400"
                >
                  ดูบริการของ Tim
                </Link>
              </div>

              <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4 max-w-2xl">
                <Stat value="28.8K+" label="YouTube subscribers" />
                <Stat value="1,200+" label="นักเรียน AI" />
                <Stat value="10+" label="ปีในวงการดิจิทัล" />
                <Stat value="100+" label="บทความ AI ภาษาไทย" />
              </div>
            </div>

            {/* Hero side card */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-teal-400/25 via-transparent to-amber-300/20 blur-3xl" />
              <div className="relative rounded-3xl border border-stone-200 bg-white/80 backdrop-blur p-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-teal-600/70">
                  Live activity
                </div>
                <div className="mt-5 space-y-4">
                  <ActivityItem
                    badge="LIVE"
                    badgeColor="bg-rose-500"
                    title="ChatGPT 5 Code Mode"
                    meta="ออกอากาศใน 3 ชั่วโมงข้างหน้า"
                  />
                  <ActivityItem
                    badge="NEW"
                    badgeColor="bg-teal-600 text-white"
                    title="n8n + Claude Workflow"
                    meta="บทความใหม่ · 12 นาที"
                  />
                  <ActivityItem
                    badge="HOT"
                    badgeColor="bg-amber-300 text-white"
                    title="AI Marketing Stack 2026"
                    meta="2.4k views อาทิตย์นี้"
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 to-amber-300 font-black text-white text-xl">
                      T
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-stone-900">Tim Janepat</div>
                      <div className="text-[11px] text-stone-500">AI Expert · Bangkok</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="rounded-lg bg-teal-50 border border-teal-300 px-2 py-1.5 text-teal-600 text-center">
                      Gemini Cert
                    </div>
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1.5 text-amber-600 text-center">
                      28.8K · YouTube
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandStrip />

      {/* AI Topics Grid — redesigned with numbers + better hierarchy */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-end">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
                Topic Hub · 8 หัวข้อหลัก
              </div>
              <h2 className="mt-3 text-[32px] font-bold tracking-[-0.01em] text-stone-900 md:text-[52px] leading-[1.05]">
                เลือกหัวข้อ AI<br />ที่อยากเรียนรู้
              </h2>
            </div>
            <p className="text-[15px] leading-[1.85] text-stone-600 max-w-2xl lg:justify-self-end">
              แต่ละหัวข้อมีบทความ tutorial และ resource ฟรี ครอบคลุมตั้งแต่พื้นฐานถึงระดับ advanced —
              อ่านครบทั้ง 8 หัวข้อ ใช้ AI ทำงานได้จริง
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AI_CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/ai/${cat.slug}`}
                className="group card-glow rounded-2xl border border-stone-200 bg-white p-7 transition hover:bg-stone-50 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`text-[10px] font-mono uppercase tracking-[0.25em] bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}
                  >
                    /ai/{cat.slug}
                  </div>
                  <div className="text-[11px] font-mono text-stone-400">
                    0{idx + 1}
                  </div>
                </div>
                <h3 className="mt-5 text-[20px] font-bold text-stone-900 tracking-tight">{cat.name}</h3>
                <p className="mt-2 text-[13px] leading-[1.7] text-stone-600 line-clamp-3">
                  {cat.description}
                </p>
                <div className="mt-7 flex items-center justify-between text-[12px]">
                  <span className="text-teal-600 transition group-hover:translate-x-1">
                    อ่านเพิ่ม →
                  </span>
                  <span className="text-stone-400 font-mono">เร็ว ๆ นี้</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedVideo />

      {/* Featured Articles or call to subscribe */}
      <section className="border-t border-stone-200 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
                Latest Articles
              </div>
              <h2 className="mt-3 text-[28px] font-bold tracking-tight text-stone-900 md:text-[42px]">
                บทความ AI ล่าสุด
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-[13px] font-mono uppercase tracking-widest text-teal-600 hover:text-teal-700"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {featuredPosts.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/ai/${post.category}/${post.slug}`}
                  className="group rounded-2xl border border-stone-200 bg-white overflow-hidden transition hover:border-teal-300 hover:-translate-y-1"
                >
                  {post.cover && (
                    <div className="aspect-video overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover}
                        alt={post.title_th}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
                      {post.category}
                    </div>
                    <h3 className="mt-3 text-[18px] font-bold text-stone-900 line-clamp-2">
                      {post.title_th}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-stone-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.reading_minutes && (
                      <div className="mt-4 text-[11px] font-mono text-stone-500">
                        ⏱ {post.reading_minutes} นาที
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {AI_CATEGORIES.slice(0, 3).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ai/${cat.slug}`}
                  className="group rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-7 hover:border-teal-300 transition"
                >
                  <div className="flex h-32 items-center justify-center">
                    <div
                      className={`text-[64px] font-black bg-gradient-to-br ${cat.color} bg-clip-text text-transparent leading-none`}
                    >
                      AI
                    </div>
                  </div>
                  <div className="mt-4 text-[11px] font-mono uppercase tracking-widest text-teal-600">
                    {cat.name}
                  </div>
                  <div className="mt-2 text-[13px] text-stone-600">
                    บทความใหม่กำลังจะมา ติดตามได้ที่ YouTube ก่อน
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* Services CTA */}
      <section className="relative border-t border-stone-200 bg-stone-50 px-6 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 dotted-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
                Services · 4 ทาง
              </div>
              <h2 className="mt-3 text-[32px] font-bold tracking-tight text-stone-900 md:text-[52px] leading-[1.02]">
                ทำงาน AI<br />
                <span className="text-stroke">ร่วมกับ TIM</span>
              </h2>
              <p className="mt-5 text-[15px] leading-[1.85] text-stone-600 max-w-md">
                ตั้งแต่ brand deal, AI consulting, อบรมองค์กร ไปจนถึงคอร์สออนไลน์
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center rounded-full bg-teal-600 px-6 py-3.5 text-[14px] font-semibold text-white hover:bg-teal-700 hover:scale-[1.03] transition"
                >
                  ดูบริการทั้งหมด
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-stone-300 px-6 py-3.5 text-[14px] text-stone-900 hover:border-teal-400 transition"
                >
                  ติดต่อ Tim
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ServiceCard
                num="01"
                title="Brand Partnership"
                desc="YouTube sponsored / paid review สำหรับแบรนด์ AI/Tech"
                tone="teal"
              />
              <ServiceCard
                num="02"
                title="AI Consulting"
                desc="ออกแบบ AI workflow ให้ธุรกิจ — ChatGPT, Claude, n8n"
                tone="amber"
              />
              <ServiceCard
                num="03"
                title="Corporate Training"
                desc="อบรม AI ให้พนักงาน in-house ปรับแต่งตามอุตสาหกรรม"
                tone="rose"
              />
              <ServiceCard
                num="04"
                title="Online Course"
                desc="คอร์ส AI ออนไลน์ภาษาไทย — Lifetime access"
                tone="emerald"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-stone-200 pl-4">
      <div className="text-[28px] font-bold text-stone-900 md:text-[34px] leading-none">{value}</div>
      <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-stone-500">
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
    <div className="flex items-start gap-3 rounded-xl border border-stone-200/60 bg-stone-50/60 p-3">
      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-stone-900 ${badgeColor}`}>
        {badge}
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-stone-900 truncate">{title}</div>
        <div className="text-[11px] text-stone-500">{meta}</div>
      </div>
    </div>
  );
}

function ServiceCard({
  num,
  title,
  desc,
  tone,
}: {
  num: string;
  title: string;
  desc: string;
  tone: "teal" | "amber" | "rose" | "emerald";
}) {
  const toneClass = {
    teal: "text-teal-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    emerald: "text-emerald-600",
  }[tone];
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-teal-300">
      <div className={`text-[11px] font-mono ${toneClass}`}>{num}</div>
      <div className="mt-3 text-[15px] font-bold text-stone-900">{title}</div>
      <div className="mt-2 text-[13px] leading-[1.7] text-stone-600">{desc}</div>
    </div>
  );
}
