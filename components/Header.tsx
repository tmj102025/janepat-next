"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-[#faf9f5]/90 backdrop-blur border-b border-[#e6dfd8]">
        <div className="mx-auto flex max-w-[1200px] h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="font-display text-[28px] font-bold tracking-[-0.02em] text-[#141413] leading-none">
              Janepat
            </span>
          </Link>

          {/* Desktop links — bigger + bolder */}
          <div className="hidden md:flex items-center gap-9">
            {NAV.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[16px] font-bold transition-colors py-1 ${
                    isActive
                      ? "text-[#cc785c] border-b-[2.5px] border-[#cc785c] pb-[2px]"
                      : "text-[#141413] hover:text-[#cc785c]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener"
              className="hidden md:inline-flex text-[14px] font-medium text-[#3d3d3a] hover:text-[#cc785c]"
            >
              YouTube
            </a>
            <Link
              href="/contact"
              className="hidden md:inline-flex h-10 items-center rounded-full bg-[#cc785c] px-5 text-[14px] font-medium text-white transition hover:bg-[#a9583e]"
            >
              ติดต่อ Tim
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-[#141413]"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-0.5 bg-[#141413] rounded transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 bg-[#141413] rounded transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 bg-[#141413] rounded transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-[#faf9f5] border-t border-[#e6dfd8] px-5 py-4 flex flex-col gap-1">
            {NAV.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-[16px] font-bold py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "text-[#cc785c] bg-[#cc785c]/10"
                      : "text-[#141413] hover:bg-[#efe9de] hover:text-[#cc785c]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="h-px bg-[#e6dfd8] my-2" />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="bg-[#cc785c] text-white text-[14px] font-medium text-center py-3 rounded-full"
            >
              ติดต่อ Tim
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
