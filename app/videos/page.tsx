import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  jsonLdScriptProps,
  videoObjectSchema,
} from "@/lib/schema";
import { fetchLatestLongVideos } from "@/lib/youtube";
import { VideoGrid } from "@/components/VideoGrid";

export const metadata = buildMetadata({
  title: "วีดีโอความรู้ AI — Tutorials, Reviews, Workflows ภาษาไทย",
  description:
    "รวมวีดีโอความรู้ AI ภาษาไทยจากช่อง @TimJanepat — tutorial, รีวิว AI tools, workflow ใช้งานจริง อัปเดตทุกสัปดาห์ ดูได้ทั้งหมดในหน้าเดียว",
  path: "/videos",
});

export default async function VideosPage() {
  const videos = await fetchLatestLongVideos(SITE.youtubeUploadsPlaylist, 20);

  const collectionUrl = `${SITE.url}/videos`;
  const breadcrumb = breadcrumbSchema([
    { name: "หน้าแรก", url: SITE.url },
    { name: "วีดีโอความรู้ AI", url: collectionUrl },
  ]);
  const collection = collectionPageSchema({
    url: collectionUrl,
    name: "วีดีโอความรู้ AI ภาษาไทย",
    description:
      "รวมวีดีโอ long-form ภาษาไทยจากช่อง @TimJanepat — tutorial, รีวิว AI tools, workflow ใช้งานจริง",
    numberOfItems: videos.length,
  });
  const itemList = itemListSchema({
    url: collectionUrl,
    items: videos.map((v) => ({
      url: `https://www.youtube.com/watch?v=${v.videoId}`,
      name: v.title,
      image: v.thumbnail,
    })),
  });
  const videoSchemas = videos.map((v) =>
    videoObjectSchema({
      videoId: v.videoId,
      name: v.title,
      thumbnail: v.thumbnail,
      uploadDate: v.publishedAt,
      durationSec: v.durationSec,
    }),
  );

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(collection)} />
      <script {...jsonLdScriptProps(itemList)} />
      {videoSchemas.map((s, i) => (
        <script key={i} {...jsonLdScriptProps(s)} />
      ))}

      <div className="min-h-screen bg-[#faf9f5]">
        {/* Header */}
        <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-6 md:pt-12 md:pb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c64545] live-pulse" />
            Latest from YouTube
          </div>
          <h1 className="font-display text-[36px] md:text-[52px] text-[#141413] leading-[1.1] mb-3 tracking-[-0.8px]">
            <span className="text-[#cc785c]">วีดีโอความรู้ AI</span>
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#6c6a64] max-w-xl mx-auto">
            ติดตาม{" "}
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener"
              className="text-[#cc785c] hover:text-[#a9583e] underline-offset-3"
            >
              {SITE.youtubeHandle}
            </a>{" "}
            รับความรู้ AI ใหม่ทุกอาทิตย์
          </p>
          <a
            href={SITE.social.youtube}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#cc785c] px-5 text-[13px] font-medium text-white hover:bg-[#a9583e]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.5.5c-1 .3-1.7 1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .5 9.5.5 9.5.5s7.5 0 9.5-.5c1-.3 1.7-1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
            </svg>
            Subscribe
          </a>
        </div>

        {/* Grid — 4 cols × 5 rows = 20 videos on desktop */}
        <div className="mx-auto max-w-[1200px] px-6 pb-14">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="text-center py-20 text-[#6c6a64]">
              <div className="text-5xl mb-4">🎬</div>
              <p className="text-[14px]">โหลดวิดีโอไม่สำเร็จ ลองใหม่ภายหลัง</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
