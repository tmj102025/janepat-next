import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { jsonLdScriptProps, organizationSchema, personSchema, websiteSchema } from "@/lib/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({
    title: `${SITE.name} — AI Expert ภาษาไทย | ChatGPT, Claude, AI Marketing`,
    description: SITE.description,
    path: "/",
  }),
};

export const viewport: Viewport = {
  themeColor: "#faf9f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="h-full antialiased">
      <head>
        <link rel="preload" href="/fonts/LINESeedSansTH_Rg.ttf" as="font" type="font/ttf" crossOrigin="" />
        <link rel="preload" href="/fonts/LINESeedSansTH_Bd.ttf" as="font" type="font/ttf" crossOrigin="" />
        <link rel="preload" href="/fonts/LINESeedSansTH_He.ttf" as="font" type="font/ttf" crossOrigin="" />
        <script {...jsonLdScriptProps(personSchema())} />
        <script {...jsonLdScriptProps(organizationSchema())} />
        <script {...jsonLdScriptProps(websiteSchema())} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf9f5] text-[#3d3d3a]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
