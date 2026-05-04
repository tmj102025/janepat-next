import Link from "next/link";
import { AI_CATEGORIES, NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-amber-300 text-black font-black">
                T
              </span>
              <span className="font-semibold text-stone-900">{SITE.brand}</span>
            </div>
            <p className="mt-4 max-w-md text-[14px] leading-[1.8] text-stone-600">
              {SITE.author.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
              <FooterSocial href={SITE.social.youtube} label="YouTube" />
              <FooterSocial href={SITE.social.facebook} label="Facebook" />
              <FooterSocial href={SITE.social.instagram} label="Instagram" />
              <FooterSocial href={SITE.social.line} label="LINE" />
              <FooterSocial href={SITE.social.x} label="X" />
              <FooterSocial href={SITE.social.tiktok} label="TikTok" />
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-widest text-teal-600">
              เมนู
            </h4>
            <ul className="mt-4 space-y-3 text-[14px] text-stone-600">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-stone-900">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-widest text-teal-600">
              ความรู้ AI
            </h4>
            <ul className="mt-4 space-y-3 text-[14px] text-stone-600">
              {AI_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/ai/${cat.slug}`} className="hover:text-stone-900">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-stone-200 pt-6 text-[12px] text-stone-500 md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} {SITE.brand} · เขียนโดย Tim Janepat ·{" "}
            <span className="text-stone-600">AI Expert ภาษาไทย</span>
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-stone-900">เกี่ยวกับ</Link>
            <Link href="/contact" className="hover:text-stone-900">ติดต่อ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSocial({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="rounded-full border border-stone-200 px-3 py-1 text-stone-700 transition hover:border-teal-300 hover:text-stone-900"
    >
      {label}
    </a>
  );
}
