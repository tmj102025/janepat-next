import Link from "next/link";

/** Author byline — clickable, links to /about. Used at top of article pages. */
export function AuthorByline() {
  return (
    <Link
      href="/about"
      className="group flex items-center gap-3 mb-8 pb-6 border-b border-[#e6dfd8] hover:opacity-90 transition-opacity"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#cc785c] shrink-0 ring-2 ring-[#cc785c]/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tim-janepat.jpg"
          alt="Tim Janepat"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <p className="font-sans font-semibold text-[14px] text-[#141413] group-hover:text-[#cc785c] transition-colors">
          Tim Janepat
        </p>
        <p className="font-sans text-[12px] text-[#6c6a64]">
          ผู้ก่อตั้ง AiCEO Academy · ผู้เชี่ยวชาญด้าน AI
        </p>
      </div>
    </Link>
  );
}
