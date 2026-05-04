import Link from "next/link";
import { notFound } from "next/navigation";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema, howToSchema, jsonLdScriptProps } from "@/lib/schema";
import { getPostBySlug } from "@/lib/pocketbase";
import { renderMarkdown } from "@/lib/markdown";

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.category !== category) {
    return buildMetadata({ title: "ไม่พบบทความ", noIndex: true });
  }
  return buildMetadata({
    title: post.seo_title ?? post.title_th,
    description: post.seo_description ?? post.excerpt,
    path: `/ai/${category}/${slug}`,
    type: "article",
    image: post.cover,
    publishedTime: post.created,
    modifiedTime: post.updated,
    tags: post.tags,
  });
}

export default async function PostPage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const cat = AI_CATEGORIES.find((c) => c.slug === category);
  const post = await getPostBySlug(slug);

  if (!cat || !post || post.category !== category) notFound();

  const url = `${SITE.url}/ai/${category}/${slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "ความรู้ AI", url: `${SITE.url}/ai` },
    { name: cat.name, url: `${SITE.url}/ai/${cat.slug}` },
    { name: post.title_th, url },
  ]);
  const article = articleSchema({
    url,
    title: post.title_th,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.created,
    dateModified: post.updated,
    category: cat.name,
    tags: post.tags,
  });

  const html = await renderMarkdown(post.content_md);

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(article)} />
      {post.faq_jsonld && post.faq_jsonld.length > 0 && (
        <script {...jsonLdScriptProps(faqSchema(post.faq_jsonld))} />
      )}
      {post.howto_jsonld && (
        <script {...jsonLdScriptProps(howToSchema(post.howto_jsonld))} />
      )}

      <article className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <nav className="text-[12px] text-stone-500">
            <Link href="/ai" className="hover:text-teal-600">ความรู้ AI</Link>
            <span className="mx-2">/</span>
            <Link href={`/ai/${cat.slug}`} className="hover:text-teal-600">{cat.name}</Link>
          </nav>

          <h1 className="mt-6 text-[34px] font-semibold leading-[1.2] tracking-[-0.01em] text-stone-900 md:text-[48px]">
            {post.title_th}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-[13px] text-stone-500">
            <span>โดย Tim Janepat</span>
            <span>·</span>
            <time dateTime={post.created}>
              {new Date(post.created).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {post.reading_minutes && (
              <>
                <span>·</span>
                <span>{post.reading_minutes} นาที</span>
              </>
            )}
          </div>

          {/* TL;DR — GEO win */}
          <div className="mt-10 rounded-2xl border border-teal-300 bg-teal-600/5 p-6">
            <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600">TL;DR</div>
            <p className="mt-2 text-[15px] leading-[1.8] text-stone-800">{post.excerpt}</p>
          </div>

          {/* Content */}
          <div
            className="prose-th mt-12"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* FAQ */}
          {post.faq_jsonld && post.faq_jsonld.length > 0 && (
            <section className="mt-16 border-t border-stone-200 pt-12">
              <h2 className="text-[24px] font-bold text-stone-900 md:text-[28px]">คำถามที่พบบ่อย</h2>
              <div className="mt-8 space-y-3">
                {post.faq_jsonld.map((f) => (
                  <details key={f.q} className="rounded-xl border border-stone-200 bg-white p-5">
                    <summary className="cursor-pointer list-none text-[15px] font-semibold text-stone-900">
                      <span className="mr-3 text-teal-600">Q.</span>
                      {f.q}
                    </summary>
                    <div className="mt-3 text-[14px] leading-[1.8] text-stone-700">{f.a}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Citations */}
          {post.citations && post.citations.length > 0 && (
            <section className="mt-12 border-t border-stone-200 pt-8">
              <h3 className="text-[14px] font-mono uppercase tracking-widest text-teal-600">แหล่งอ้างอิง</h3>
              <ul className="mt-4 space-y-2 text-[13px] text-stone-600">
                {post.citations.map((c) => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener" className="text-teal-600 underline hover:text-teal-700">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Author byline */}
          <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-amber-300 text-black font-black">
                T
              </div>
              <div>
                <div className="text-[15px] font-bold text-stone-900">เขียนโดย Tim Janepat</div>
                <p className="mt-1 text-[13px] leading-[1.7] text-stone-600">{SITE.author.bio}</p>
                <Link href="/about" className="mt-3 inline-block text-[13px] text-teal-600 hover:text-teal-700">
                  อ่านประวัติเต็ม →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
