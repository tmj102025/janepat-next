import Link from "next/link";
import { notFound } from "next/navigation";
import { AI_CATEGORIES, SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema, howToSchema, jsonLdScriptProps } from "@/lib/schema";
import { getPostBySlug, listPublishedPosts } from "@/lib/pocketbase";
import { renderMarkdown } from "@/lib/markdown";
import { PostCard } from "@/components/PostCard";
import { AuthorByline } from "@/components/AuthorByline";

type Params = Promise<{ category: string; slug: string }>;

async function resolvePost(slug: string) {
  return getPostBySlug(slug);
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

  // Related — same category from PB, exclude current; fallback to recent across categories
  const sameCategory = await listPublishedPosts({ category: post.category, limit: 6 });
  let related = sameCategory.filter((p) => p.slug !== post.slug).slice(0, 3);
  if (related.length < 3) {
    const recent = await listPublishedPosts({ limit: 8 });
    const seen = new Set(related.map((p) => p.id));
    seen.add(post.id);
    for (const p of recent) {
      if (related.length >= 3) break;
      if (!seen.has(p.id)) {
        related.push(p);
        seen.add(p.id);
      }
    }
  }

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

            {/* Author byline (links to /about) */}
            <AuthorByline />

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

            {/* Source video — prominent block at end of article */}
            {post.citations && post.citations.length > 0 && (
              <section className="mt-12 rounded-2xl border border-[#e6dfd8] bg-[#f5f0e8] p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#cc785c] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                      <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.5.5c-1 .3-1.7 1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .5 9.5.5 9.5.5s7.5 0 9.5-.5c1-.3 1.7-1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#cc785c] mb-1">วิดีโอต้นฉบับ</h3>
                    {post.citations.map((c) => (
                      <a
                        key={c.url}
                        href={c.url}
                        target="_blank"
                        rel="noopener"
                        className="block font-sans font-semibold text-[15px] text-[#141413] hover:text-[#cc785c] transition-colors mb-1"
                      >
                        {c.label}
                      </a>
                    ))}
                    <p className="font-sans text-[13px] text-[#6c6a64] mt-2">
                      บทความนี้สรุปและขยายความจากเนื้อหาในวิดีโอ — กดดูคลิปต้นฉบับเพื่อดูภาพและตัวอย่างเพิ่มเติม
                    </p>
                  </div>
                </div>
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
