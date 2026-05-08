import Link from "next/link";
import { listPublishedPosts } from "@/lib/pocketbase";
import { MOCK_POSTS } from "@/lib/mockPosts";
import { LatestVideos } from "@/components/LatestVideos";
import { HeroFeaturedCard, SideListCard, LatestRowCard } from "@/components/PostCard";
import { InstructorSection } from "@/components/InstructorSection";

// Always render at request time so newly-published PB posts show up immediately
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const real = await listPublishedPosts({ limit: 20 });
  const posts = real.length > 0 ? real : MOCK_POSTS;
  const sorted = posts
    .slice()
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  const hero = sorted[0];
  const sideList = sorted.slice(1, 5);
  const latest = sorted.slice(5, 11);

  return (
    <>
      {/* Section 1 — Yahoo-style hero (lead + side list) */}
      {hero && (
        <section className="bg-[#faf9f5] border-t border-[#e6dfd8]">
          <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-10 md:pt-10">
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.55fr_1fr]">
              {/* Lead */}
              <HeroFeaturedCard post={hero} />

              {/* Side list */}
              <div className="flex flex-col">
                <div className="flex-1">
                  {sideList.map((p) => (
                    <SideListCard key={p.id} post={p} />
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#cc785c] hover:text-[#a9583e]"
                >
                  View More <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2 — Articles grid */}
      {latest.length > 0 && (
        <section className="bg-white border-t border-[#e6dfd8]">
          <div className="mx-auto max-w-[1200px] px-6 py-10 md:py-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-1 h-6 bg-[#cc785c]" aria-hidden />
              <h2 className="font-sans font-bold text-[20px] md:text-[24px] text-[#141413]">
                บทความเพิ่มเติม
              </h2>
            </div>

            <div className="mt-4 grid gap-x-8 gap-y-0 md:grid-cols-2">
              {latest.map((p) => (
                <LatestRowCard key={p.id} post={p} />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex h-10 items-center rounded-full border border-[#e6dfd8] bg-white px-5 text-[13px] font-medium text-[#141413] hover:border-[#cc785c] hover:text-[#cc785c]"
              >
                ดูบทความทั้งหมด →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 3 — Videos */}
      <LatestVideos />

      {/* Section 4 — Instructor (เกี่ยวกับวิทยากร) */}
      <InstructorSection />
    </>
  );
}
