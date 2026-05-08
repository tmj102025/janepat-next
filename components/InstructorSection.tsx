import Link from "next/link";

/** Instructor section for homepage — mirrors next.aiceo.im "เกี่ยวกับวิทยากร" pattern */
export function InstructorSection() {
  return (
    <section className="bg-white border-t border-[#e6dfd8]">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
        <div className="grid gap-8 md:gap-12 md:grid-cols-[280px_1fr] items-center">
          {/* Photo column */}
          <div className="mx-auto md:mx-0">
            <div className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden ring-4 ring-[#cc785c]/20 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tim-janepat.jpg"
                alt="Tim Janepat"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text column */}
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-3">
              เกี่ยวกับวิทยากร
            </div>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] tracking-[-0.6px] text-[#141413] mb-2">
              อ.ทิม เจนพัฒน์
            </h2>
            <p className="font-sans text-[15px] text-[#6c6a64] mb-5">
              Timothy Janepat · ผู้ก่อตั้ง AiCEO Academy · ผู้เชี่ยวชาญด้าน AI
            </p>
            <p className="font-sans text-[15px] md:text-[16px] leading-[1.7] text-[#3d3d3a] mb-3">
              ประสบการณ์ <strong>10+ ปี</strong> ในวงการ Digital Marketing พร้อมโฟกัส{" "}
              <strong>Generative AI และ AI Automation</strong> 3 ปีหลังกับเครื่องมืออย่าง
              Claude, ChatGPT, Gemini, n8n และ MCP
            </p>
            <p className="font-sans text-[14px] leading-[1.7] text-[#6c6a64] mb-6">
              เคย consulting + อบรม AI ให้องค์กรไทย 30+ บริษัท · YouTube @TimJanepat (28.9K subs) ·
              ผู้ก่อตั้ง AiCEO Academy + janepat.com
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#cc785c] hover:text-[#a9583e] transition-colors"
            >
              อ่านต่อ <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
