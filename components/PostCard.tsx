import Link from "next/link";
import { AI_CATEGORIES } from "@/lib/site";
import type { PostRecord } from "@/lib/pocketbase";

const CAT_TEXT: Record<string, string> = {
  chatgpt: "text-[#5db8a6]",
  claude: "text-[#e8a55a]",
  marketing: "text-[#cc785c]",
  automation: "text-[#5db8a6]",
  tools: "text-[#e8a55a]",
  business: "text-[#cc785c]",
  creator: "text-[#e8a55a]",
  basics: "text-[#5db8a6]",
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.max(1, Math.floor((now - then) / 60000));
  if (diffMin < 60) return `${diffMin} mins ago`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  const mo = Math.floor(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}

/** Tall image card with bottom gradient + category pill — for "Featured Stories" row */
export function FeaturedStoryCard({ post }: { post: PostRecord }) {
  const cat = AI_CATEGORIES.find((c) => c.slug === post.category);
  return (
    <Link
      href={`/ai/${post.category}/${post.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-[#181715] aspect-[3/4] shrink-0"
    >
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={post.title_th}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      {/* gradient bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      {/* category pill */}
      <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-[#141413]">
        {cat?.name ?? post.category}
      </span>
      {/* title */}
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="font-display font-bold text-[20px] md:text-[22px] leading-[1.2] text-white tracking-[-0.3px] line-clamp-3">
          {post.title_th}
        </h3>
      </div>
    </Link>
  );
}

/** Horizontal row card — image left (16:9), content right — for "The Latest" list */
export function LatestRowCard({ post }: { post: PostRecord }) {
  const cat = AI_CATEGORIES.find((c) => c.slug === post.category);
  const catTone = CAT_TEXT[post.category] ?? "text-[#cc785c]";
  return (
    <Link
      href={`/ai/${post.category}/${post.slug}`}
      className="group flex gap-4 md:gap-5 py-5 border-b border-[#e6dfd8] last:border-b-0"
    >
      <div className="w-40 md:w-56 aspect-video shrink-0 rounded-xl bg-[#efe9de] overflow-hidden">
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt={post.title_th}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-sans font-bold text-[16px] md:text-[18px] leading-[1.3] text-[#141413] line-clamp-2 group-hover:text-[#cc785c] transition-colors">
          {post.title_th}
        </h3>
        <p className="mt-2 font-sans text-[13px] text-[#3d3d3a] line-clamp-2 leading-[1.55]">
          {post.excerpt}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
          <span className={`inline-flex items-center rounded-full bg-[#f5f0e8] px-2.5 py-0.5 font-medium ${catTone}`}>
            {cat?.name ?? post.category}
          </span>
          <span className="text-[#6c6a64]">{timeAgo(post.created)}</span>
          <span className="text-[#8e8b82]">·</span>
          {post.reading_minutes && (
            <span className="text-[#6c6a64]">{post.reading_minutes} mins read</span>
          )}
        </div>
      </div>
    </Link>
  );
}

/** Numbered ranking row — for "On Trending" sidebar */
export function TrendingRow({ post, rank }: { post: PostRecord; rank: number }) {
  return (
    <Link
      href={`/ai/${post.category}/${post.slug}`}
      className="group flex gap-4 py-4 border-b border-[#e6dfd8] last:border-b-0"
    >
      <span className="font-display text-[36px] md:text-[44px] font-bold leading-none text-[#cc785c]/40 group-hover:text-[#cc785c] transition-colors shrink-0">
        #{rank}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="font-sans font-bold text-[14px] leading-[1.3] text-[#141413] line-clamp-2 group-hover:text-[#cc785c] transition-colors">
          {post.title_th}
        </h4>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-[#6c6a64]">
          <span>{timeAgo(post.created)}</span>
          <span className="text-[#8e8b82]">·</span>
          {post.reading_minutes && <span>{post.reading_minutes} mins read</span>}
        </div>
      </div>
    </Link>
  );
}

/** Default vertical card — for /blog and /videos compatibility */
export function PostCard({ post, variant = "default" }: { post: PostRecord; variant?: "default" | "featured" | "compact" }) {
  const cat = AI_CATEGORIES.find((c) => c.slug === post.category);
  const catTone = CAT_TEXT[post.category] ?? "text-[#6c6a64]";
  const dateStr = new Date(post.created).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (variant === "featured") {
    return (
      <Link
        href={`/ai/${post.category}/${post.slug}`}
        className="group block lg:col-span-2 lg:row-span-2 bg-white rounded-2xl overflow-hidden border border-[#e6dfd8] hover:border-[#cc785c] transition-all duration-300"
      >
        <div className="aspect-[16/10] lg:aspect-[16/11] bg-[#efe9de] overflow-hidden">
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt={post.title_th} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#efe9de] to-[#e8e0d2]">
              <span className="font-display text-[120px] leading-none text-[#cc785c]/40">AI</span>
            </div>
          )}
        </div>
        <div className="p-6 lg:p-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#cc785c]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cc785c]" />
              FEATURED
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-wider ${catTone}`}>
              {cat?.name ?? post.category}
            </span>
            <span className="text-[#8e8b82] text-[10px]">·</span>
            <span className="font-sans text-[11px] text-[#6c6a64]">{dateStr}</span>
          </div>
          <h2 className="font-display text-[26px] lg:text-[32px] leading-[1.15] tracking-[-0.5px] text-[#141413] line-clamp-3 mb-3 group-hover:text-[#cc785c] transition-colors">
            {post.title_th}
          </h2>
          <p className="font-sans text-[14px] lg:text-[15px] text-[#3d3d3a] line-clamp-3 leading-[1.6]">
            {post.excerpt}
          </p>
          <div className="mt-5 pt-4 border-t border-[#ebe6df] flex items-center justify-between text-[11px] text-[#6c6a64]">
            <span className="font-medium">{post.author}</span>
            {post.reading_minutes && <span>{post.reading_minutes} นาทีอ่าน</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/ai/${post.category}/${post.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-[#e6dfd8] hover:border-[#cc785c] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-video bg-[#efe9de] overflow-hidden">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title_th} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#efe9de] to-[#e8e0d2]">
            <span className="font-display text-[64px] leading-none text-[#cc785c]/40">AI</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`font-mono text-[10px] uppercase tracking-wider ${catTone}`}>
            {cat?.name ?? post.category}
          </span>
          <span className="text-[#8e8b82] text-[10px]">·</span>
          <span className="font-sans text-[11px] text-[#6c6a64]">{dateStr}</span>
        </div>
        <h3 className="font-sans font-bold text-[15px] text-[#141413] leading-snug line-clamp-2 mb-2 group-hover:text-[#cc785c] transition-colors">
          {post.title_th}
        </h3>
        <p className="font-sans text-[12px] text-[#6c6a64] line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
