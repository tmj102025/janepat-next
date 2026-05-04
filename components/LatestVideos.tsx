import { SITE } from "@/lib/site";
import { fetchLatestLongVideos, formatDuration, formatViewCount } from "@/lib/youtube";

export async function LatestVideos() {
  const videos = await fetchLatestLongVideos(SITE.youtubeUploadsPlaylist, 6);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#e6dfd8] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c64545] live-pulse" />
              Latest from YouTube
            </div>
            <h2 className="mt-2 font-display text-[32px] leading-[1.1] tracking-[-0.6px] text-[#141413] md:text-[44px]">
              วิดีโอล่าสุดของ Tim
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.55] text-[#3d3d3a]">
              คลิป long-form จาก{" "}
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener"
                className="text-[#cc785c] hover:text-[#a9583e] underline-offset-3"
              >
                {SITE.youtubeHandle}
              </a>{" "}
              — อัปเดต tutorial, รีวิว AI tools, และ workflow ใช้งานจริงทุกสัปดาห์
            </p>
          </div>
          <a
            href={SITE.social.youtube}
            target="_blank"
            rel="noopener"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#cc785c] px-5 text-[13px] font-medium text-white hover:bg-[#a9583e]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.5.5c-1 .3-1.7 1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .5 9.5.5 9.5.5s7.5 0 9.5-.5c1-.3 1.7-1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
            </svg>
            Subscribe
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <a
              key={v.videoId}
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener"
              className="group rounded-xl border border-[#e6dfd8] bg-[#faf9f5] overflow-hidden transition hover:border-[#cc785c]"
            >
              <div className="relative aspect-video overflow-hidden bg-[#efe9de]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {formatDuration(v.durationSec)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-[15px] font-medium leading-[1.4] text-[#141413] line-clamp-2 group-hover:text-[#cc785c]">
                  {v.title}
                </h3>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6c6a64]">
                  <span>{formatViewCount(v.viewCount)} views</span>
                  <span>·</span>
                  <time dateTime={v.publishedAt}>
                    {new Date(v.publishedAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
