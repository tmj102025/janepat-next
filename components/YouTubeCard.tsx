"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  title: string;
  client?: string;
};

export function YouTubeCard({ videoId, title, client }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#0f1011] overflow-hidden transition hover:border-teal-400/30">
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group/btn relative h-full w-full overflow-hidden"
            aria-label={`Play ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover/btn:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover/btn:bg-black/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-400 shadow-2xl transition group-hover/btn:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-zinc-900">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-5">
        {client && (
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-300">{client}</div>
        )}
        <h3 className="mt-2 text-[15px] font-semibold text-white line-clamp-2">{title}</h3>
      </div>
    </div>
  );
}
