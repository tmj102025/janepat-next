import Link from "next/link";
import { AI_CATEGORIES, NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[#181715] px-6 py-12 text-[#a09d96]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="spike-mark text-[#faf9f5]" aria-hidden />
              <span className="font-display text-[22px] tracking-[-0.01em] text-[#faf9f5]">
                Janepat
              </span>
            </div>
            <p className="mt-5 max-w-md text-[14px] leading-[1.6] text-[#a09d96]">
              {SITE.author.bio}
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-[12px]">
              <FooterSocial href={SITE.social.youtube} label="YouTube" />
              <FooterSocial href={SITE.social.facebook} label="Facebook" />
              <FooterSocial href={SITE.social.instagram} label="Instagram" />
              <FooterSocial href={SITE.social.line} label="LINE" />
              <FooterSocial href={SITE.social.x} label="X" />
              <FooterSocial href={SITE.social.tiktok} label="TikTok" />
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#faf9f5]">
              Menu
            </h4>
            <ul className="mt-4 space-y-3 text-[14px]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#faf9f5]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#faf9f5]">
              ความรู้ AI
            </h4>
            <ul className="mt-4 space-y-3 text-[14px]">
              {AI_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/ai/${cat.slug}`} className="hover:text-[#faf9f5]">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#252320] pt-6 text-[12px] text-[#a09d96] md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} {SITE.brand} — เขียนโดย Tim Janepat</div>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-[#faf9f5]">About</Link>
            <Link href="/contact" className="hover:text-[#faf9f5]">Contact</Link>
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
      className="rounded-full border border-[#252320] px-3 py-1 text-[#a09d96] transition hover:border-[#cc785c] hover:text-[#faf9f5]"
    >
      {label}
    </a>
  );
}
