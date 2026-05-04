import { SITE } from "@/lib/site";

export function FeaturedVideo() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0b0b0d] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 live-pulse" />
            Latest from YouTube
          </div>
          <h2 className="mt-6 text-[28px] font-bold tracking-tight text-white md:text-[40px] leading-tight">
            ดู Tim สอน AI <br />
            <span className="text-gradient">บน YouTube</span>
          </h2>
          <p className="mt-5 text-[15px] leading-[1.85] text-zinc-300 max-w-md">
            ช่อง <strong className="text-white">@TimJanepat</strong> — 28.8K subscribers · เผยแพร่
            tutorial AI ทุกสัปดาห์ ฟรี ทุกหัวข้อตั้งแต่ ChatGPT พื้นฐานจนถึง n8n automation ระดับ
            advanced
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-[14px] font-semibold text-white hover:bg-red-500"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.5.5c-1 .3-1.7 1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .5 9.5.5 9.5.5s7.5 0 9.5-.5c1-.3 1.7-1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
              </svg>
              Subscribe Tim
            </a>
            <a
              href={`https://www.youtube.com/watch?v=${SITE.featuredVideoId}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-[14px] text-white hover:border-teal-400/30"
            >
              เปิดใน YouTube ↗
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <MiniStat n="28.8K" l="Subscribers" />
            <MiniStat n="200+" l="Videos" />
            <MiniStat n="Weekly" l="Uploads" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-teal-400/20 via-transparent to-amber-300/20 blur-2xl opacity-50" />
          <div className="relative aspect-video rounded-2xl border border-white/[0.08] bg-zinc-900 overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${SITE.featuredVideoId}?rel=0&modestbranding=1`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Featured video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0f1011] p-3">
      <div className="text-[18px] font-bold text-white">{n}</div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{l}</div>
    </div>
  );
}
