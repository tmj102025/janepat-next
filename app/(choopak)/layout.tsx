import type { Metadata, Viewport } from "next";
import "../globals.css";
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

export default function ChoopakRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="choopak-root antialiased">
      <body className="min-h-full bg-[#fffdf7] text-stone-900 font-sans">{children}</body>
    </html>
  );
}
