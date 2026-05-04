import Link from "next/link";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { listPublishedPosts } from "@/lib/pocketbase";

export default async function HomePage() {
  const featuredPosts = await listPublishedPosts({ featured: true, limit: 3 });

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            AI Expert · ภาษาไทย · 28K+ subscribers
          </div>

          <h1 className="mt-6 max-w-4xl text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[68px]">
            เรียนรู้ <span className="text-gradient">AI ภาษาไทย</span>
            <br />
            กับ Tim Janepat
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] leading-[1.8] text-zinc-300 md:text-[18px]">
            ทุกเรื่อง AI ที่คนไทยควรรู้ — ChatGPT, Claude, Gemini, AI Marketing, AI Automation
            สอนแบบเข้าใจง่าย ใช้ได้จริง โดยผู้เชี่ยวชาญที่สอนคนไทยมาแล้วกว่า 1,200 คน
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-[14px] font-semibold text-zinc-900 transition hover:bg-teal-300"
            >
              เริ่มเรียน AI ฟรี →
            </Link>
            <a
              href={SITE.related.aiceoAcademy}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[14px] text-white transition hover:border-teal-400/30"
            >
              คอร์สเต็ม @ AiCEO Academy
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat value="28.8K+" label="YouTube subscribers" />
            <Stat value="1,200+" label="นักเรียน AI" />
            <Stat value="10+" label="ปีประสบการณ์ดิจิทัล" />
            <Stat value="100+" label="บทความ AI ภาษาไทย" />
          </div>
        </div>
      </section>

      {/* AI Topics Grid */}
      <section className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
                Topic Hub
              </div>
              <h2 className="mt-3 text-[28px] font-bold tracking-tight text-white md:text-[42px]">
                เลือกหัวข้อ AI ที่อยากเรียนรู้
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-zinc-400">
                แต่ละหัวข้อมีบทความ tutorial และ resource ฟรี ครอบคลุมตั้งแต่พื้นฐานถึงระดับ advanced
              </p>
            </div>
            <Link
              href="/ai"
              className="text-[13px] font-mono uppercase tracking-widest text-teal-300 hover:text-teal-200"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AI_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/ai/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f1011] p-6 transition hover:border-teal-400/30 hover:bg-[#101214]"
              >
                <div
                  className={`inline-block rounded-full bg-gradient-to-r ${cat.color} bg-clip-text text-[11px] font-mono uppercase tracking-widest text-transparent`}
                >
                  {cat.name}
                </div>
                <h3 className="mt-4 text-[18px] font-bold text-white">{cat.name}</h3>
                <p className="mt-2 text-[13px] leading-[1.7] text-zinc-400 line-clamp-3">
                  {cat.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-[12px] text-teal-300 transition group-hover:gap-2">
                  อ่านเพิ่ม
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts (or placeholder) */}
      <section className="border-t border-white/[0.06] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
            Latest Articles
          </div>
          <h2 className="mt-3 text-[28px] font-bold tracking-tight text-white md:text-[42px]">
            บทความ AI ล่าสุด
          </h2>

          {featuredPosts.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/ai/${post.category}/${post.slug}`}
                  className="group rounded-2xl border border-white/[0.08] bg-[#0f1011] overflow-hidden transition hover:border-teal-400/30"
                >
                  {post.cover && (
                    <div className="aspect-video overflow-hidden bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover} alt={post.title_th} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
                      {post.category}
                    </div>
                    <h3 className="mt-3 text-[18px] font-bold text-white line-clamp-2">{post.title_th}</h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-zinc-400 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-[#0f1011] p-10 text-center">
              <p className="text-[14px] text-zinc-400">
                บทความใหม่กำลังจะมา — ติดตามได้ที่{" "}
                <a href={SITE.social.youtube} target="_blank" rel="noopener" className="text-teal-300 underline">
                  YouTube channel
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Services Teaser */}
      <section className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
              Services
            </div>
            <h2 className="mt-3 text-[28px] font-bold tracking-tight text-white md:text-[42px]">
              ทำงาน AI ร่วมกับ Tim
            </h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-zinc-400">
              ตั้งแต่ brand deal, AI consulting, อบรมองค์กร ไปจนถึงคอร์สออนไลน์ใน AiCEO Academy
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center rounded-full bg-teal-400 px-6 py-3 text-[14px] font-semibold text-zinc-900 hover:bg-teal-300"
              >
                ดูบริการทั้งหมด
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-[14px] text-white hover:border-teal-400/30"
              >
                ติดต่อ Tim
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ServiceCard title="Brand Partnership" desc="YouTube sponsored / paid review สำหรับแบรนด์ AI/Tech" />
            <ServiceCard title="AI Consulting" desc="ออกแบบ AI workflow ให้ธุรกิจ — ChatGPT, Claude, n8n" />
            <ServiceCard title="Corporate Training" desc="อบรม AI ให้พนักงาน in-house ปรับแต่งตามอุตสาหกรรม" />
            <ServiceCard title="Online Course" desc="คอร์สเต็มที่ AiCEO Academy — Lifetime access" />
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[28px] font-bold text-white md:text-[36px]">{value}</div>
      <div className="mt-1 text-[12px] text-zinc-500">{label}</div>
    </div>
  );
}

function ServiceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-5">
      <div className="text-[14px] font-bold text-white">{title}</div>
      <div className="mt-2 text-[13px] leading-[1.7] text-zinc-400">{desc}</div>
    </div>
  );
}
