import { SITE } from "@/lib/site";

export function BrandStrip() {
  return (
    <section className="border-y border-[#e6dfd8] bg-[#f5f0e8] py-8 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center text-[12px] font-medium uppercase tracking-[1.5px] text-[#6c6a64]">
          Featured & worked with
        </div>
      </div>
      <div className="mt-5 overflow-hidden">
        <div className="ticker">
          {[...SITE.brandsWorkedWith, ...SITE.brandsWorkedWith].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-[24px] tracking-[-0.01em] text-[#8e8b82] md:text-[32px]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
