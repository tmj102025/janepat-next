import { SITE } from "@/lib/site";
import { fetchLatestLongVideos } from "@/lib/youtube";
import { VideoGrid } from "./VideoGrid";

export async function LatestVideos() {
  const videos = await fetchLatestLongVideos(SITE.youtubeUploadsPlaylist, 8);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#e6dfd8] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-1 h-6 bg-[#cc785c]" aria-hidden />
              <h2 className="font-sans font-bold text-[20px] md:text-[24px] text-[#141413]">
                วิดีโอล่าสุดของ Tim
              </h2>
            </div>
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
              — คลิกเพื่อดูในป๊อบอัพ
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

        <div className="mt-8">
          <VideoGrid videos={videos} />
        </div>
      </div>
    </section>
  );
}
