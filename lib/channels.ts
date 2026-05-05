/**
 * Source channels สำหรับ auto-blog
 * - mode "auto" = publish=true ทันที (ทั้งหมดเป็น auto ตามที่ Tim สั่ง)
 * - mode "draft" = publish=false + Telegram notify (ไม่ใช้ตอนนี้)
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
  // Tim's own
  {
    id: "UCRKlO0XkDH9VI6ziF2agdSg",
    handle: "@TimJanepat",
    name: "Tim Janepat",
    mode: "auto",
    defaultCategory: "tools",
  },

  // Curated AI / automation / business creators
  {
    id: "UC3i3qKQ5aR_guegQj5bhOMw",
    handle: "@zinhoautomates",
    name: "Zinho Automates",
    mode: "auto",
    defaultCategory: "automation",
  },
  {
    id: "UCbo-KbSjJDG6JWQ_MTZ_rNA",
    handle: "@nicksaraev",
    name: "Nick Saraev",
    mode: "auto",
    defaultCategory: "automation",
  },
  {
    id: "UC4JX40jDee_tINbkjycV4Sg",
    handle: "@TechWithTim",
    name: "Tech With Tim",
    mode: "auto",
    defaultCategory: "tools",
  },
  {
    id: "UCxVxcTULO9cFU6SB9qVaisQ",
    handle: "@Itssssss_Jack",
    name: "Jack Roberts",
    mode: "auto",
    defaultCategory: "tools",
  },
  {
    id: "UCgscS8mBsQZ5sFRkJIFWD7Q",
    handle: "@RoboNuggets",
    name: "Jay E | RoboNuggets",
    mode: "auto",
    defaultCategory: "automation",
  },
  {
    id: "UC_RovKmk0OCbuZjA8f08opw",
    handle: "@futurepedia_io",
    name: "Futurepedia",
    mode: "auto",
    defaultCategory: "tools",
  },
  {
    id: "UCjc1vfduI7BhVMXBLJLDjmA",
    handle: "@BrockMesarich",
    name: "Brock Mesarich",
    mode: "auto",
    defaultCategory: "basics",
  },
  {
    id: "UC2b2wgxm0vFjQfJJ0iRcFRw",
    handle: "@AI-GPTWorkshop",
    name: "AI Workshop",
    mode: "auto",
    defaultCategory: "chatgpt",
  },
  {
    id: "UCoOae5nYA7VqaXzerajD0lg",
    handle: "@aliabdaal",
    name: "Ali Abdaal",
    mode: "auto",
    defaultCategory: "creator",
  },
  {
    id: "UCZ2UamYbfBiUJN6zABwOQtg",
    handle: "@matt-j-penny",
    name: "Matt Penny | Applied AI",
    mode: "auto",
    defaultCategory: "business",
  },
  {
    id: "UCz80JEs56coMRDd5OzYe_lw",
    handle: "@suryakunju",
    name: "AI with Surya",
    mode: "auto",
    defaultCategory: "basics",
  },
  {
    id: "UCHhYXsLBEVVnbvsq57n1MTQ",
    handle: "@aiadvantage",
    name: "The AI Advantage",
    mode: "auto",
    defaultCategory: "tools",
  },
];
