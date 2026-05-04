import { SITE } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="px-6 py-24 md:py-[96px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#6c6a64]">
          Voices
        </div>
        <h2 className="mt-3 max-w-2xl font-display text-[40px] tracking-[-0.5px] text-[#141413] md:text-[48px]">
          คนที่เรียนกับ Tim พูดยังไง
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SITE.testimonials.map((t, i) => (
            <figure
              key={i}
              className="rounded-xl bg-[#efe9de] p-8"
            >
              <span className="font-display text-[48px] leading-none text-[#cc785c]">“</span>
              <blockquote className="mt-2 text-[17px] leading-[1.55] text-[#252523]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-[#e6dfd8] pt-4">
                <div className="text-[14px] font-medium text-[#141413]">{t.author}</div>
                <div className="text-[13px] text-[#6c6a64]">{t.company}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
