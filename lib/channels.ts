/**
 * Source channels สำหรับ auto-blog
 * - mode "auto"  = Tim's own channels → publish=true ทันที (Tim ไว้ใจตัวเอง)
 * - mode "draft" = ช่อง curated → published=false + LINE notify ให้ Tim review ก่อน
 *
 * channelId หาได้จาก: View Source หน้าช่อง → ค้น "channel_id"
 *   หรือใช้ https://commentpicker.com/youtube-channel-id.php
 */

export type SourceMode = "auto" | "draft";

export type SourceChannel = {
  id: string;            // YouTube channel ID (UCxxxx...)
  handle: string;        // @handle สำหรับ display
  name: string;          // ชื่อช่อง
  mode: SourceMode;
  defaultCategory: string; // slug ใน AI_CATEGORIES
  voice?: string;        // optional voice override สำหรับ rewrite
};

export const SOURCE_CHANNELS: SourceChannel[] = [
  // Tim's own — auto-publish
  {
    id: "UC1IbB55Lqe0_8h2g3rs0PZA", // จาก @TimJanepat — ตรวจสอบจริงตอน production
    handle: "@TimJanepat",
    name: "Tim Janepat",
    mode: "auto",
    defaultCategory: "tools",
  },

  // Curated AI experts — draft + LINE notify
  {
    id: "UCSHZKyawb77ixDdsGog4iWA", // Lex Fridman
    handle: "@lexfridman",
    name: "Lex Fridman",
    mode: "draft",
    defaultCategory: "basics",
  },
  {
    id: "UCV5t5rEvLR7VZrK9lfeF2bA", // Matt Wolfe
    handle: "@mreflow",
    name: "Matt Wolfe",
    mode: "draft",
    defaultCategory: "tools",
  },
  // เพิ่มช่องอื่นได้ที่นี่ — BoomBigNose (ไทย), AI Explained, Mreflow ฯลฯ
];
