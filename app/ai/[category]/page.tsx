import Link from "next/link";
import { notFound } from "next/navigation";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/schema";
import { listPublishedPosts } from "@/lib/pocketbase";

type Params = Promise<{ category: string }>;

export async function generateStaticParams() {
  return AI_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { category } = await params;
  const cat = AI_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return buildMetadata({ title: "ไม่พบหัวข้อ", path: `/ai/${category}`, noIndex: true });

  return buildMetadata({
    title: `${cat.name} — บทความ AI ภาษาไทย`,
    description: cat.description,
    path: `/ai/${category}`,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = AI_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const posts = await listPublishedPosts({ category, limit: 50 });

  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "ความรู้ AI", url: `${SITE.url}/ai` },
    { name: cat.name, url: `${SITE.url}/ai/${cat.slug}` },
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />

      <section className="gradient-hero">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28">
          <Link href="/ai" className="text-[12px] font-mono text-teal-600 hover:text-teal-700">
            ← /ai
          </Link>
          <div className={`mt-6 inline-block rounded-full bg-gradient-to-r ${cat.color} bg-clip-text text-[11px] font-mono uppercase tracking-widest text-transparent`}>
            Category · /ai/{cat.slug}
          </div>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 md:text-[58px]">
            {cat.name}
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-[1.85] text-stone-700">{cat.description}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-[24px] font-bold text-stone-900 md:text-[28px]">บทความทั้งหมด</h2>

          {posts.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center">
              <p className="text-[14px] text-stone-600">บทความหัวข้อนี้กำลังจะมาเร็ว ๆ นี้</p>
              <Link
                href="/ai"
                className="mt-4 inline-flex items-center text-[13px] text-teal-600 hover:text-teal-700"
              >
                ดูหัวข้ออื่น →
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/ai/${cat.slug}/${p.slug}`}
                  className="group rounded-2xl border border-stone-200 bg-white overflow-hidden transition hover:border-teal-300"
                >
                  {p.cover && (
                    <div className="aspect-video overflow-hidden bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt={p.title_th} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">{cat.name}</div>
                    <h3 className="mt-2 text-[18px] font-bold text-stone-900 line-clamp-2">{p.title_th}</h3>
                    <p className="mt-2 text-[13px] leading-[1.7] text-stone-600 line-clamp-3">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
