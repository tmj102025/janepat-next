import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[rgba(10,10,10,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-amber-300 text-black font-black">
            T
          </span>
          <span className="text-[15px]">
            <span className="text-white">Tim</span>
            <span className="text-teal-300">Janepat</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[14px] text-zinc-300">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={SITE.related.aiceoAcademy}
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-[13px] text-zinc-300 transition hover:border-teal-400/30 hover:text-white"
          >
            AiCEO Academy ↗
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-teal-400 px-4 py-2 text-[13px] font-semibold text-zinc-900 transition hover:bg-teal-300"
          >
            ติดต่อ
          </Link>
        </div>
      </div>
    </header>
  );
}
