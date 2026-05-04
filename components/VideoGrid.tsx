"use client";

import { useEffect, useState } from "react";
import type { LatestVideo } from "@/lib/youtube";
import { formatDuration, formatViewCount } from "@/lib/youtube";

export function VideoGrid({ videos }: { videos: LatestVideo[] }) {
  const [selected, setSelected] = useState<LatestVideo | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v) => (
          <button
            key={v.videoId}
            type="button"
            onClick={() => setSelected(v)}
            className="group rounded-xl border border-[#e6dfd8] bg-[#faf9f5] overflow-hidden text-left transition hover:border-[#cc785c] hover:-translate-y-0.5"
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
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cc785c] shadow-lg">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-[14px] font-medium leading-[1.4] text-[#141413] line-clamp-2 group-hover:text-[#cc785c]">
                {v.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6c6a64]">
                <span>{formatViewCount(v.viewCount)} views</span>
                <span>·</span>
                <time dateTime={v.publishedAt}>
                  {new Date(v.publishedAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selected.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={selected.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[16px] font-medium text-white max-w-3xl">{selected.title}</h3>
              <a
                href={`https://www.youtube.com/watch?v=${selected.videoId}`}
                target="_blank"
                rel="noopener"
                className="inline-flex h-9 items-center rounded-full bg-white/10 px-4 text-[12px] font-medium text-white hover:bg-white/20"
              >
                เปิดใน YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
