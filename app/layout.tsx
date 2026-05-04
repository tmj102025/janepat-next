import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { jsonLdScriptProps, organizationSchema, personSchema, websiteSchema } from "@/lib/schema";
import { ConditionalChrome } from "@/components/ConditionalChrome";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({
    title: `${SITE.name} — AI Expert ภาษาไทย | ChatGPT, Claude, AI Marketing`,
    description: SITE.description,
    path: "/",
  }),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="h-full antialiased">
      <head>
        <script {...jsonLdScriptProps(personSchema())} />
        <script {...jsonLdScriptProps(organizationSchema())} />
        <script {...jsonLdScriptProps(websiteSchema())} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
