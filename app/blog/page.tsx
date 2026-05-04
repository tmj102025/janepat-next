import Link from "next/link";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/schema";
import { listPublishedPosts } from "@/lib/pocketbase";

export const metadata = buildMetadata({
  title: "บทความทั้งหมด — AI ภาษาไทย โดย Tim Janepat",
  description: "บทความ AI ภาษาไทยทั้งหมด ครอบคลุม ChatGPT, Claude, Gemini, AI Marketing, AI Automation, Prompt Engineering และ AI Tools",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts({ limit: 100 });

  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "บทความ", url: `${SITE.url}/blog` },
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />

      <section className="gradient-hero">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-12 md:pt-28">
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">Blog</div>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 md:text-[56px]">
            บทความ AI ทั้งหมด
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-stone-700">
            อัปเดต tutorial, รีวิว AI tools, และความรู้ AI ที่คนไทยใช้ได้จริง — เผยแพร่เนื้อหาใหม่ 2-4 บทความต่อสัปดาห์
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {AI_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/ai/${c.slug}`}
                className="rounded-full border border-stone-200 bg-white px-4 py-1.5 text-[12px] text-stone-700 transition hover:border-teal-300 hover:text-stone-900"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center">
              <p className="text-[14px] text-stone-600">บทความใหม่กำลังจะมา ติดตามได้เร็ว ๆ นี้</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const cat = AI_CATEGORIES.find((c) => c.slug === p.category);
                return (
                  <Link
                    key={p.id}
                    href={`/ai/${p.category}/${p.slug}`}
                    className="group rounded-2xl border border-stone-200 bg-white overflow-hidden transition hover:border-teal-300"
                  >
                    {p.cover && (
                      <div className="aspect-video overflow-hidden bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.cover} alt={p.title_th} className="h-full w-full object-cover transition group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">
                        {cat?.name ?? p.category}
                      </div>
                      <h3 className="mt-2 text-[18px] font-bold text-stone-900 line-clamp-2">{p.title_th}</h3>
                      <p className="mt-2 text-[13px] leading-[1.7] text-stone-600 line-clamp-3">{p.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
