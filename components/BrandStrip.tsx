import { SITE } from "@/lib/site";

export function BrandStrip() {
  return (
    <section className="border-y border-stone-200 bg-stone-100 py-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500">
          Featured & worked with
        </div>
      </div>
      <div className="mt-6 overflow-hidden">
        <div className="ticker">
          {[...SITE.brandsWorkedWith, ...SITE.brandsWorkedWith].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[18px] md:text-[24px] font-semibold tracking-tight text-stone-500/70 hover:text-stone-700 transition"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
