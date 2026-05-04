import { SITE } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="border-t border-white/[0.06] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">
          Voices
        </div>
        <h2 className="mt-3 text-[28px] font-bold tracking-tight text-white md:text-[42px]">
          คนที่เรียนกับ Tim พูดยังไง
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SITE.testimonials.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-[#0f1011] p-7 transition hover:border-teal-400/30"
            >
              <svg
                className="h-6 w-6 text-teal-300/60"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9 22V12c0-2.5 2-4 5-4v3c-1 0-2 1-2 2h2v9H9zm12 0V12c0-2.5 2-4 5-4v3c-1 0-2 1-2 2h2v9h-5z" />
              </svg>
              <blockquote className="mt-4 text-[15px] leading-[1.85] text-zinc-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-white/[0.06] pt-4">
                <div className="text-[13px] font-semibold text-white">{t.author}</div>
                <div className="text-[12px] text-zinc-500">{t.company}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
