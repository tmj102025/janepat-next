import { SITE } from "@/lib/site";

export function FeaturedVideo() {
  return (
    <section className="bg-[#181715] px-6 py-12 md:py-20">
      <div className="mx-auto max-w-[1200px] grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[1.5px] text-[#a09d96]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cc785c] live-pulse" />
            Latest from YouTube
          </div>
          <h2 className="mt-6 font-display text-[44px] leading-[1.1] tracking-[-0.7px] text-[#faf9f5] md:text-[56px]">
            ดู Tim สอน AI<br />
            <span className="text-[#cc785c]">บน YouTube</span>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-[1.6] text-[#a09d96]">
            ช่อง <span className="text-[#faf9f5]">@TimJanepat</span> — 28.8K subscribers
            เผยแพร่ tutorial AI ทุกสัปดาห์ ฟรี ทุกหัวข้อตั้งแต่ ChatGPT พื้นฐานจนถึง n8n automation ระดับ advanced
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#cc785c] px-5 text-[14px] font-medium text-white hover:bg-[#a9583e]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.5.5c-1 .3-1.7 1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .5 9.5.5 9.5.5s7.5 0 9.5-.5c1-.3 1.7-1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
              </svg>
              Subscribe
            </a>
            <a
              href={`https://www.youtube.com/watch?v=${SITE.featuredVideoId}`}
              target="_blank"
              rel="noopener"
              className="inline-flex h-10 items-center rounded-full bg-[#252320] px-5 text-[14px] font-medium text-[#faf9f5] hover:bg-[#2f2c28]"
            >
              เปิดใน YouTube ↗
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            <MiniStat n="28.8K" l="Subscribers" />
            <MiniStat n="200+" l="Videos" />
            <MiniStat n="Weekly" l="Uploads" />
          </div>
        </div>

        <div className="rounded-xl bg-[#1f1e1b] p-2">
          <div className="aspect-video rounded-lg overflow-hidden bg-[#0a0a0a]">
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
    <div className="rounded-md border border-[#252320] bg-[#1f1e1b] px-3 py-2">
      <div className="font-display text-[20px] text-[#faf9f5]">{n}</div>
      <div className="text-[11px] uppercase tracking-[1.5px] text-[#a09d96] font-medium">{l}</div>
    </div>
  );
}
