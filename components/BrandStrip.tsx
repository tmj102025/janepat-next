import { SITE } from "@/lib/site";

export function BrandStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-[#070708] py-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
          Featured & worked with
        </div>
      </div>
      <div className="mt-6 overflow-hidden">
        <div className="ticker">
          {[...SITE.brandsWorkedWith, ...SITE.brandsWorkedWith].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[18px] md:text-[24px] font-semibold tracking-tight text-zinc-500/70 hover:text-zinc-300 transition"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
