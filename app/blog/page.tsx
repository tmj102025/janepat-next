import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  jsonLdScriptProps,
} from "@/lib/schema";
import { listPublishedPosts } from "@/lib/pocketbase";
import { PostCard } from "@/components/PostCard";

// Always render at request time
export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "บทความ AI — Tips, Tutorials, Use Cases ภาษาไทย",
  description:
    "บทความ AI ภาษาไทย ครอบคลุม ChatGPT, Claude, Gemini, AI Marketing, AI Automation, Prompt Engineering และ AI Tools — อัปเดตทุกสัปดาห์",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await listPublishedPosts({ limit: 100 });
  const sorted = posts
    .slice()
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  const collectionUrl = `${SITE.url}/blog`;
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "บทความ AI", url: collectionUrl },
  ]);
  const collection = collectionPageSchema({
    url: collectionUrl,
    name: "บทความ AI ภาษาไทย",
    description:
      "บทความ AI ภาษาไทย ครอบคลุม ChatGPT, Claude, Gemini, AI Marketing, AI Automation, Prompt Engineering และ AI Tools",
    numberOfItems: sorted.length,
  });
  const itemList = itemListSchema({
    url: collectionUrl,
    items: sorted.slice(0, 30).map((p) => ({
      url: `${SITE.url}/ai/${p.category}/${p.slug}`,
      name: p.title_th,
      image: p.cover,
    })),
  });

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(collection)} />
      <script {...jsonLdScriptProps(itemList)} />

      <div className="min-h-screen bg-[#faf9f5]">
        {/* Header — centered like /videos */}
        <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-6 md:pt-12 md:pb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cc785c]" />
            Articles
          </div>
          <h1 className="font-display text-[36px] md:text-[52px] text-[#141413] leading-[1.1] mb-3 tracking-[-0.8px]">
            <span className="text-[#cc785c]">บทความ AI</span>
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-[#6c6a64] max-w-xl mx-auto">
            ความรู้ AI สำหรับมือใหม่ และเจ้าของธุรกิจ — เรียงล่าสุดก่อน
          </p>
        </div>

        {/* Grid 4-col like /videos */}
        <div className="mx-auto max-w-[1200px] px-6 pb-14">
          {sorted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sorted.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#6c6a64]">
              <div className="text-5xl mb-4">📝</div>
              <p className="font-sans">ยังไม่มีบทความ</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
