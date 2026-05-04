"use client";

import { useEffect, useState, useCallback } from "react";

type Video = {
  id: string;
  title: string;
};

export function VideoLightboxGallery({
  videos,
  client,
}: {
  videos: readonly Video[];
  client: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % videos.length)),
    [videos.length],
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + videos.length) % videos.length)),
    [videos.length],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, close, next, prev]);

  const active = openIdx !== null ? videos[openIdx] : null;

  return (
    <>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {videos.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setOpenIdx(i)}
            aria-label={`Play video: ${v.title}`}
            className="group nk-card overflow-hidden text-left"
          >
            <div className="relative aspect-video overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/15 transition group-hover:bg-stone-900/35" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a373] shadow-lg ring-4 ring-white/70 transition group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-stone-900">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[12px] font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-[#0e7490] transition-colors">
                {v.title}
              </p>
              <p className="nk-mono mt-1.5 text-[10px] text-[#b8854f]">{client}</p>
            </div>
          </button>
        ))}
      </div>

      {active && openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/85 p-4 backdrop-blur-sm sm:p-8"
        >
          {videos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous video"
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 transition hover:bg-white"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next video"
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 transition hover:bg-white"
              >
                →
              </button>
            </>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-900 transition hover:bg-white"
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                key={active.id}
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 px-1 text-white">
              <p className="text-[14px] font-semibold line-clamp-2">{active.title}</p>
              <span className="nk-mono shrink-0 text-[11px] text-white/70">
                {openIdx + 1} / {videos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
