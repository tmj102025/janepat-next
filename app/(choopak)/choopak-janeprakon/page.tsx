import Link from "next/link";
import { CHOOPAK } from "@/lib/choopak";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/schema";
import { YouTubeCard } from "@/components/YouTubeCard";

export const metadata = buildMetadata({
  title: `${CHOOPAK.name} — ${CHOOPAK.role}`,
  description:
    "Choopak Janeprakon — Digital Content Creator & Designer ผู้เชี่ยวชาญ video editing, graphic design และ Adobe Creative Suite ดู portfolio ผลงาน video และประสบการณ์",
  path: "/choopak-janeprakon",
  type: "profile",
});

const personSchemaChoopak = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: CHOOPAK.name,
  jobTitle: CHOOPAK.role,
  description: CHOOPAK.summary,
  birthDate: "1990-09-11",
  knowsAbout: [
    "Video Editing",
    "Graphic Design",
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Content Creation",
    "Videography",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Mahanakorn University of Technology",
    },
  ],
  url: `${SITE.url}/choopak-janeprakon`,
};

export default function ChoopakPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: CHOOPAK.name, url: `${SITE.url}/choopak-janeprakon` },
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(personSchemaChoopak)} />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-20 md:pt-28 md:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-teal-300">
                Portfolio · Digital Creator
              </div>
              <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[64px]">
                <span className="text-gradient">CHOOPAK</span>
                <br />
                JANEPRAKON
              </h1>
              <p className="mt-4 text-[16px] font-mono uppercase tracking-[0.2em] text-teal-300">
                {CHOOPAK.role}
              </p>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-zinc-300">
                {CHOOPAK.tagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#portfolio"
                  className="inline-flex items-center rounded-full bg-teal-400 px-6 py-3 text-[14px] font-semibold text-zinc-900 hover:bg-teal-300"
                >
                  ดูผลงาน Video →
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-[14px] text-white hover:border-teal-400/30"
                >
                  ติดต่อร่วมงาน
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-300/20 to-amber-300/20">
                <div className="flex h-full w-full items-center justify-center text-[120px] font-black text-white/10">
                  CJ
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-2xl border border-teal-400/30 bg-zinc-950 px-4 py-2 text-[12px]">
                <div className="font-mono text-teal-300">10+ YEARS</div>
                <div className="text-zinc-400">Video & Design</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Summary */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
            Professional Summary
          </div>
          <h2 className="mt-3 text-[28px] font-bold text-white md:text-[36px]">
            ครีเอเตอร์ที่เล่าเรื่องด้วยภาพ
          </h2>
          <p className="mt-6 text-[16px] leading-[1.9] text-zinc-300">{CHOOPAK.summary}</p>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">Skills</div>
          <h2 className="mt-3 text-[28px] font-bold text-white md:text-[36px]">เครื่องมือที่ใช้</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHOOPAK.skills.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-white">{s.name}</div>
                  <div className="text-[11px] font-mono text-teal-300">{s.level}%</div>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-amber-300"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  {s.group}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
            Experience
          </div>
          <h2 className="mt-3 text-[28px] font-bold text-white md:text-[36px]">ประสบการณ์ทำงาน</h2>

          <div className="mt-10 space-y-4">
            {CHOOPAK.experience.map((e, idx) => (
              <div
                key={`${e.company}-${idx}`}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#0f1011] p-6 md:p-8 transition hover:border-teal-400/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[20px] font-bold text-white">{e.company}</div>
                    <div className="mt-1 text-[14px] text-teal-300">{e.role}</div>
                  </div>
                  <div className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] font-mono text-zinc-400">
                    {e.period}
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-[1.8] text-zinc-300">{e.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-teal-300/10 border border-teal-400/20 px-2.5 py-0.5 text-[11px] text-teal-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio (YouTube grid) */}
      <section
        id="portfolio"
        className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
                Portfolio
              </div>
              <h2 className="mt-3 text-[28px] font-bold text-white md:text-[42px]">ผลงาน Video</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-zinc-400">
                คลิกเพื่อดูผลงาน video ที่ผลิตให้แบรนด์ต่างๆ
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHOOPAK.portfolio.map((v) => (
              <YouTubeCard key={v.id} videoId={v.id} title={v.title} client={v.client} />
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">Education</div>
          <h2 className="mt-3 text-[28px] font-bold text-white md:text-[36px]">การศึกษา</h2>

          <div className="mt-10 space-y-4">
            {CHOOPAK.education.map((e, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-bold text-white">{e.school}</div>
                    <div className="mt-1 text-[13px] text-zinc-400">{e.degree}</div>
                  </div>
                  <div className="text-[11px] font-mono text-teal-300">{e.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">Contact</div>
          <h2 className="mt-3 text-[28px] font-bold text-white md:text-[36px]">
            ติดต่อร่วมงาน
          </h2>
          <p className="mt-4 text-[15px] leading-[1.8] text-zinc-400">
            สนใจร่วมงาน video production, content creation, หรือ graphic design? ติดต่อได้ตามช่องทางด้านล่าง
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={`tel:${CHOOPAK.phone.replace(/-/g, "")}`}
              className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-6 text-left transition hover:border-teal-400/30"
            >
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">Phone</div>
              <div className="mt-2 text-[18px] font-semibold text-white">{CHOOPAK.phone}</div>
            </a>
            <a
              href={`mailto:${CHOOPAK.email}`}
              className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-6 text-left transition hover:border-teal-400/30"
            >
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">Email</div>
              <div className="mt-2 text-[16px] font-semibold text-white break-all">{CHOOPAK.email}</div>
            </a>
          </div>

          <div className="mt-12 text-[12px] text-zinc-600">
            <Link href="/" className="hover:text-teal-300">← กลับหน้าแรก janepat.com</Link>
          </div>
        </div>
      </section>
    </>
  );
}
