import type { Metadata, Viewport } from "next";
import "./choopak.css";

export const metadata: Metadata = {
  title: "Choopak Janeprakon — Digital Content Creator & Designer",
  description:
    "Choopak Janeprakon — Digital Content Creator & Designer. Video editing, graphic design และ Adobe Creative Suite. ดู showreel + ผลงานวิดีโอ + ประสบการณ์",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFDF7",
  width: "device-width",
  initialScale: 1,
};

export default function ChoopakLayout({ children }: { children: React.ReactNode }) {
  return <div className="choopak-root min-h-screen w-full bg-[#fffdf7] text-stone-900">{children}</div>;
}
