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
      <section className="nk-hero nk-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-20 md:pt-28 md:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0891b2]/30 bg-[#0891b2]/8 px-3 py-1 nk-mono text-[11px] text-[#0e7490]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#166534]" />
                Portfolio · Digital Creator
              </div>
              <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-stone-900 md:text-[64px]">
                <span className="nk-text-gradient">CHOOPAK</span>
                <br />
                JANEPRAKON
              </h1>
              <p className="mt-4 nk-mono text-[14px] text-[#0e7490]">
                {CHOOPAK.role}
              </p>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-stone-700">
                {CHOOPAK.tagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#portfolio"
                  className="inline-flex items-center rounded-full bg-[#d4a373] px-6 py-3 text-[14px] font-semibold text-stone-900 shadow-md shadow-[#d4a373]/30 transition hover:bg-[#c89465]"
                >
                  ดูผลงาน Video →
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-full border border-stone-900/15 bg-white px-6 py-3 text-[14px] text-stone-900 transition hover:border-[#0891b2]/50 hover:text-[#0891b2]"
                >
                  ติดต่อร่วมงาน
                </a>
              </div>

              {/* Section nav — single page anchors */}
              <nav className="mt-10 flex flex-wrap gap-2" aria-label="Sections">
                {[
                  { href: "#showreel", label: "Showreel" },
                  { href: "#about", label: "About" },
                  { href: "#skills", label: "Skills" },
                  { href: "#experience", label: "Experience" },
                  { href: "#portfolio", label: "Portfolio" },
                  { href: "#education", label: "Education" },
                  { href: "#contact", label: "Contact" },
                ].map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    className="nk-mono rounded-full border border-stone-900/10 bg-white/60 px-3 py-1.5 text-[10px] text-stone-700 backdrop-blur transition hover:border-[#d4a373] hover:bg-[#d4a373]/15 hover:text-[#92400e]"
                  >
                    ↓ {s.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl border border-[#d4a373]/30 bg-gradient-to-br from-[#d4a373]/25 via-white to-[#0891b2]/15 shadow-xl shadow-[#d4a373]/15">
                <div className="flex h-full w-full items-center justify-center text-[120px] font-black text-[#b8854f]/25">
                  CJ
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-2xl border border-[#d4a373]/40 bg-white px-4 py-2 text-[12px] shadow-lg shadow-stone-900/5">
                <div className="nk-mono text-[#b8854f]">10+ YEARS</div>
                <div className="text-stone-600">Video & Design</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showreel */}
      <section id="showreel" className="border-t border-stone-900/[0.06] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="nk-mono text-[11px] text-[#0e7490]">Featured</div>
              <h2 className="mt-2 text-[24px] font-bold text-stone-900 md:text-[32px]">
                {CHOOPAK.showreel.title}
              </h2>
            </div>
            <span className="nk-tag nk-tag-forest">● Available for projects</span>
          </div>
          <div className="mt-8">
            <YouTubeCard videoId={CHOOPAK.showreel.id} title={CHOOPAK.showreel.title} client="Showreel" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="nk-marquee">
        <div className="nk-marquee-track">
          <span className="px-6">✺ Premiere Pro</span>
          <span className="px-6">✺ After Effects</span>
          <span className="px-6">✺ Photoshop</span>
          <span className="px-6">✺ Illustrator</span>
          <span className="px-6">✺ Lightroom</span>
          <span className="px-6">✺ Video Production</span>
          <span className="px-6">✺ Premiere Pro</span>
          <span className="px-6">✺ After Effects</span>
          <span className="px-6">✺ Photoshop</span>
          <span className="px-6">✺ Illustrator</span>
          <span className="px-6">✺ Lightroom</span>
          <span className="px-6">✺ Video Production</span>
        </div>
      </div>

      {/* About / Summary */}
      <section id="about" className="border-t border-stone-900/[0.06] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="nk-mono text-[11px] text-[#0e7490]">
            Professional Summary
          </div>
          <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[36px]">
            ครีเอเตอร์ที่เล่าเรื่องด้วยภาพ
          </h2>
          <div className="nk-divider mt-6 max-w-[120px]" />
          <p className="mt-6 text-[16px] leading-[1.9] text-stone-700">{CHOOPAK.summary}</p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-t border-stone-900/[0.06] bg-[#fbf6ec] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="nk-mono text-[11px] text-[#0e7490]">Skills</div>
          <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[36px]">เครื่องมือที่ใช้</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHOOPAK.skills.map((s) => (
              <div key={s.name} className="nk-card p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-stone-900">{s.name}</div>
                  <div className="nk-mono text-[11px] text-[#b8854f]">{s.level}%</div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#d4a373] to-[#0891b2]"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="nk-mono mt-3 text-[10px] text-stone-500">
                  {s.group}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="border-t border-stone-900/[0.06] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="nk-mono text-[11px] text-[#0e7490]">
            Experience
          </div>
          <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[36px]">ประสบการณ์ทำงาน</h2>

          <div className="mt-10 space-y-4">
            {CHOOPAK.experience.map((e, idx) => (
              <div
                key={`${e.company}-${idx}`}
                className="nk-card p-6 md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[20px] font-bold text-stone-900">{e.company}</div>
                    <div className="mt-1 text-[14px] text-[#0891b2]">{e.role}</div>
                  </div>
                  <div className="rounded-full border border-[#d4a373]/40 bg-[#d4a373]/10 px-3 py-1 nk-mono text-[11px] text-[#92400e]">
                    {e.period}
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-[1.8] text-stone-700">{e.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span key={t} className="nk-tag nk-tag-forest">
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
        className="border-t border-stone-900/[0.06] bg-[#fbf6ec] px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="nk-mono text-[11px] text-[#0e7490]">
                Portfolio
              </div>
              <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[42px]">ผลงาน Video</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-stone-600">
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
      <section id="education" className="border-t border-stone-900/[0.06] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="nk-mono text-[11px] text-[#0e7490]">Education</div>
          <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[36px]">การศึกษา</h2>

          <div className="mt-10 space-y-4">
            {CHOOPAK.education.map((e, idx) => (
              <div key={idx} className="nk-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-bold text-stone-900">{e.school}</div>
                    <div className="mt-1 text-[13px] text-stone-600">{e.degree}</div>
                  </div>
                  <div className="nk-mono text-[11px] text-[#b8854f]">{e.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-stone-900/[0.06] bg-[#fbf6ec] px-6 py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="nk-mono text-[11px] text-[#0e7490]">Contact</div>
          <h2 className="mt-3 text-[28px] font-bold text-stone-900 md:text-[36px]">
            ติดต่อร่วมงาน
          </h2>
          <p className="mt-4 text-[15px] leading-[1.8] text-stone-600">
            สนใจร่วมงาน video production, content creation, หรือ graphic design? ติดต่อได้ตามช่องทางด้านล่าง
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={`tel:${CHOOPAK.phone.replace(/-/g, "")}`}
              className="nk-card p-6 text-left"
            >
              <div className="nk-mono text-[11px] text-[#0e7490]">Phone</div>
              <div className="mt-2 text-[18px] font-semibold text-stone-900">{CHOOPAK.phone}</div>
            </a>
            <a
              href={`mailto:${CHOOPAK.email}`}
              className="nk-card p-6 text-left"
            >
              <div className="nk-mono text-[11px] text-[#0e7490]">Email</div>
              <div className="mt-2 text-[16px] font-semibold text-stone-900 break-all">{CHOOPAK.email}</div>
            </a>
          </div>

          <div className="mt-12 text-[12px] text-stone-500">
            <Link href="/" className="transition hover:text-[#0891b2]">← กลับหน้าแรก janepat.com</Link>
          </div>
        </div>
      </section>
    </>
  );
}
