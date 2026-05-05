import Link from "next/link";
import { listPublishedPosts } from "@/lib/pocketbase";
import { MOCK_POSTS } from "@/lib/mockPosts";
import { LatestVideos } from "@/components/LatestVideos";
import { FeaturedStoryCard, LatestRowCard, TrendingRow } from "@/components/PostCard";

// Always render at request time so newly-published PB posts show up immediately
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const real = await listPublishedPosts({ limit: 20 });
  const posts = real.length > 0 ? real : MOCK_POSTS;
  const sorted = posts
    .slice()
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  const featured = sorted.slice(0, 5);
  const latest = sorted.slice(0, 6); // newest list, can overlap with featured
  const trending = sorted.slice(0, 5); // mock trending = newest 5

  return (
    <>
      {/* Section 1 — Articles feed (Featured Stories + The Latest + On Trending) */}
      <section className="bg-[#faf9f5]">
        <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-12 md:pt-12">
          {/* Featured Stories header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="block w-1 h-6 bg-[#cc785c]" aria-hidden />
              <h2 className="font-sans font-bold text-[20px] md:text-[24px] text-[#141413]">
                Featured Stories
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-[13px] font-medium text-[#6c6a64] hover:text-[#cc785c]"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {/* Featured grid — 5 image cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-12 md:mb-14">
            {featured.map((p) => (
              <FeaturedStoryCard key={p.id} post={p} />
            ))}
          </div>

          {/* Latest + Trending split */}
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
            {/* The Latest column */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="block w-1 h-6 bg-[#cc785c]" aria-hidden />
                <h2 className="font-sans font-bold text-[20px] md:text-[24px] text-[#141413]">
                  The Latest
                </h2>
              </div>
              <div className="mt-4">
                {latest.map((p) => (
                  <LatestRowCard key={p.id} post={p} />
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex h-10 items-center rounded-full border border-[#e6dfd8] bg-white px-5 text-[13px] font-medium text-[#141413] hover:border-[#cc785c] hover:text-[#cc785c]"
                >
                  ดูบทความทั้งหมด →
                </Link>
              </div>
            </div>

            {/* On Trending sidebar */}
            <aside className="rounded-2xl bg-[#f5f0e8] p-6">
              <h3 className="font-sans font-bold text-[18px] md:text-[20px] text-[#cc785c] mb-1 flex items-center gap-2">
                On Trending <span aria-hidden>🔥</span>
              </h3>
              <div className="mt-2">
                {trending.map((p, i) => (
                  <TrendingRow key={p.id} post={p} rank={i + 1} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Section 2 — Videos */}
      <LatestVideos />
    </>
  );
}
