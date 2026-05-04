import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#e6dfd8] bg-[#faf9f5]/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="spike-mark text-[#141413]" aria-hidden />
          <span className="font-display text-[20px] tracking-[-0.01em] text-[#141413]">
            Janepat
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#3d3d3a]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#141413]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={SITE.social.youtube}
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex text-[14px] font-medium text-[#3d3d3a] hover:text-[#141413]"
          >
            YouTube
          </a>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-md bg-[#cc785c] px-5 text-[14px] font-medium text-white transition hover:bg-[#a9583e]"
          >
            ติดต่อ Tim
          </Link>
        </div>
      </div>
    </header>
  );
}
