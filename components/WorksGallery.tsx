"use client";

import { useEffect, useState, useCallback } from "react";

type Work = {
  image: string;
  title: string;
  client: string;
  type: string;
  summary: string;
};

export function WorksGallery({ works }: { works: readonly Work[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % works.length)),
    [works.length],
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + works.length) % works.length)),
    [works.length],
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

  const open = openIdx !== null ? works[openIdx] : null;

  return (
    <>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {works.map((w, i) => (
          <button
            key={w.image}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="group nk-card overflow-hidden text-left"
          >
            <div className="aspect-[4/5] overflow-hidden bg-stone-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.image}
                alt={w.title}
                loading="lazy"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="px-3 py-3">
              <span className="nk-tag" style={{ fontSize: 10 }}>{w.type}</span>
              <div className="mt-2 text-[12px] font-semibold text-stone-900 line-clamp-2">
                {w.title}
              </div>
              <div className="mt-1 nk-mono text-[10px] text-[#b8854f] truncate">
                {w.client}
              </div>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/85 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
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
            aria-label="Next"
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-900 transition hover:bg-white"
          >
            →
          </button>
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
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="overflow-auto bg-stone-100" style={{ maxHeight: "75vh" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={open.image}
                alt={open.title}
                className="block h-auto w-full object-contain"
              />
            </div>
            <div className="border-t border-stone-900/[0.06] px-6 py-4">
              <span className="nk-tag">{open.type}</span>
              <h3 className="mt-2 text-[18px] font-bold text-stone-900">{open.title}</h3>
              <div className="mt-1 nk-mono text-[11px] text-[#b8854f]">{open.client}</div>
              <p className="mt-3 text-[13px] leading-[1.7] text-stone-700">{open.summary}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
