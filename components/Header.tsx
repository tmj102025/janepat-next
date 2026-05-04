import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-amber-300 text-black font-black">
            T
          </span>
          <span className="text-[15px]">
            <span className="text-stone-900">Tim</span>
            <span className="text-teal-600">Janepat</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[14px] text-stone-700">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={SITE.social.youtube}
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex items-center rounded-full border border-stone-200 px-4 py-2 text-[13px] text-stone-700 transition hover:border-teal-300 hover:text-stone-900"
          >
            YouTube ↗
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-teal-700"
          >
            ติดต่อ
          </Link>
        </div>
      </div>
    </header>
  );
}
