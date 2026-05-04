/**
 * Source channels สำหรับ auto-blog
 * - mode "auto"  = Tim's own channels → publish=true ทันที
 * - mode "draft" = ช่อง curated → published=false + Telegram notify ให้ Tim review ก่อน
 */

export type SourceMode = "auto" | "draft";

export type SourceChannel = {
  id: string;
  handle: string;
  name: string;
  mode: SourceMode;
  defaultCategory: string;
  voice?: string;
};

export const SOURCE_CHANNELS: SourceChannel[] = [
  // Tim's own — auto-publish
  {
    id: "UCRKlO0XkDH9VI6ziF2agdSg",
    handle: "@TimJanepat",
    name: "Tim Janepat",
    mode: "auto",
    defaultCategory: "tools",
  },

  // Curated AI experts — draft + Telegram notify
  {
    id: "UChpleBmo18P08aKCIgti38g",
    handle: "@mreflow",
    name: "Matt Wolfe",
    mode: "draft",
    defaultCategory: "tools",
  },
  {
    id: "UCRJFAp0rewx8kzdhEqDHIlA",
    handle: "@theaiadvantage",
    name: "The AI Advantage",
    mode: "draft",
    defaultCategory: "tools",
  },
  {
    id: "UCNJ1Ymd5yFuUPtn21xtRbbw",
    handle: "@aiexplained-official",
    name: "AI Explained",
    mode: "draft",
    defaultCategory: "basics",
  },
];
