import Link from "next/link";
import { notFound } from "next/navigation";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema, howToSchema, jsonLdScriptProps } from "@/lib/schema";
import { getPostBySlug } from "@/lib/pocketbase";
import { findMockPost, MOCK_POSTS } from "@/lib/mockPosts";
import { renderMarkdown } from "@/lib/markdown";
import { PostCard } from "@/components/PostCard";

type Params = Promise<{ category: string; slug: string }>;

async function resolvePost(slug: string) {
  const real = await getPostBySlug(slug);
  if (real) return real;
  return findMockPost(slug);
}

export async function generateMetadata({ params }: { params: Params }) {
  const { category, slug } = await params;
  const post = await resolvePost(slug);
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
  const post = await resolvePost(slug);

  if (!cat || !post || post.category !== category) notFound();

  const url = `${SITE.url}/ai/${category}/${slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "บทความ AI", url: `${SITE.url}/blog` },
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
  const dateStr = new Date(post.created).toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric",
  });

  // Related — same category, exclude current
  const allPosts = MOCK_POSTS;
  const related = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

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

      <div className="min-h-screen bg-[#faf9f5]">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="font-sans text-[13px] text-[#6c6a64] mb-6">
              <Link href="/blog" className="hover:text-[#cc785c] transition-colors">บทความ</Link>
              <span className="mx-2">/</span>
              <Link href={`/ai/${cat.slug}`} className="hover:text-[#cc785c] transition-colors">{cat.name}</Link>
              <span className="mx-2">/</span>
              <span className="text-[#3d3d3a] line-clamp-1">{post.title_th}</span>
            </nav>

            {/* Category + Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#cc785c]/10 text-[#cc785c] uppercase tracking-[1px]">
                {cat.name}
              </span>
              <span className="font-sans text-[13px] text-[#6c6a64]">{dateStr}</span>
              {Number.isFinite(post.reading_minutes as number) && (
                <>
                  <span className="text-[#8e8b82]">·</span>
                  <span className="font-sans text-[13px] text-[#6c6a64]">{post.reading_minutes} นาทีอ่าน</span>
                </>
              )}
            </div>

            {/* Title — editorial display */}
            <h1 className="font-display text-[34px] md:text-[44px] leading-[1.15] tracking-[-0.6px] text-[#141413] mb-6">
              {post.title_th}
            </h1>

            {/* Author row */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#e6dfd8]">
              <div className="w-10 h-10 rounded-full bg-[#cc785c] flex items-center justify-center font-display text-[18px] font-bold text-white shrink-0">
                T
              </div>
              <div>
                <p className="font-sans font-semibold text-[14px] text-[#141413]">{post.author ?? "Tim Janepat"}</p>
                <p className="font-sans text-[12px] text-[#6c6a64]">AI Expert · Bangkok</p>
              </div>
            </div>

            {/* Cover image — non-interactive, keep readers on site */}
            {post.cover && (
              <figure className="aspect-video rounded-xl overflow-hidden bg-[#efe9de] mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover}
                  alt={post.title_th}
                  className="w-full h-full object-cover"
                />
              </figure>
            )}

            {/* Lead summary — Speakable for voice/AI assistants */}
            <div className="tldr rounded-xl border-l-4 border-[#cc785c] bg-[#cc785c]/5 p-5 mb-10">
              <p className="font-sans text-[17px] text-[#252523] leading-[1.7] font-medium">{post.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose-th" dangerouslySetInnerHTML={{ __html: html }} />

            {/* FAQ */}
            {post.faq_jsonld && post.faq_jsonld.length > 0 && (
              <section className="mt-14 pt-10 border-t border-[#e6dfd8]">
                <h2 className="font-display text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.5px] text-[#141413] mb-6">
                  คำถามที่พบบ่อย
                </h2>
                <div className="space-y-3">
                  {post.faq_jsonld.map((f) => (
                    <details key={f.q} className="group rounded-xl border border-[#e6dfd8] bg-white p-5 open:border-[#cc785c]/40">
                      <summary className="cursor-pointer list-none font-sans font-semibold text-[15px] text-[#141413] flex items-start gap-3">
                        <span className="text-[#cc785c] shrink-0">Q.</span>
                        <span>{f.q}</span>
                      </summary>
                      <div className="mt-3 ml-7 font-sans text-[14px] leading-[1.75] text-[#3d3d3a]">{f.a}</div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[#e6dfd8] flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#e6dfd8] bg-white px-3 py-1 text-[12px] text-[#3d3d3a]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Citations */}
            {post.citations && post.citations.length > 0 && (
              <section className="mt-10 pt-6 border-t border-[#e6dfd8]">
                <h3 className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-3">แหล่งอ้างอิง</h3>
                <ul className="space-y-2 text-[13px]">
                  {post.citations.map((c) => (
                    <li key={c.url}>
                      <a href={c.url} target="_blank" rel="noopener" className="text-[#cc785c] underline underline-offset-3 hover:text-[#a9583e]">
                        {c.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-[#e6dfd8]">
              <p className="font-sans text-[13px] text-[#6c6a64] mb-3">แชร์บทความนี้:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "LINE", href: `https://line.me/R/msg/text/?${encodeURIComponent(post.title_th + " " + url)}` },
                  { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
                  { label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title_th)}&url=${encodeURIComponent(url)}` },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-9 items-center rounded-full border border-[#e6dfd8] bg-white px-4 text-[13px] font-medium text-[#141413] hover:border-[#cc785c] hover:text-[#cc785c] transition">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="bg-white border-t border-[#e6dfd8]">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-14">
              <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-2">Related</div>
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.15] tracking-[-0.5px] text-[#141413] mb-8">
                บทความที่เกี่ยวข้อง
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
