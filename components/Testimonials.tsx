import { SITE } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="border-t border-stone-200 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
          Voices
        </div>
        <h2 className="mt-3 text-[28px] font-bold tracking-tight text-stone-900 md:text-[42px]">
          คนที่เรียนกับ Tim พูดยังไง
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SITE.testimonials.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-7 transition hover:border-teal-300"
            >
              <svg
                className="h-6 w-6 text-teal-600/60"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9 22V12c0-2.5 2-4 5-4v3c-1 0-2 1-2 2h2v9H9zm12 0V12c0-2.5 2-4 5-4v3c-1 0-2 1-2 2h2v9h-5z" />
              </svg>
              <blockquote className="mt-4 text-[15px] leading-[1.85] text-stone-800">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-stone-200 pt-4">
                <div className="text-[13px] font-semibold text-stone-900">{t.author}</div>
                <div className="text-[12px] text-stone-500">{t.company}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
