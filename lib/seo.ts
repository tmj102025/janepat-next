import type { Metadata } from "next";
import { SITE } from "./site";

type SeoInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
};

export function buildMetadata(input: SeoInput): Metadata {
  const title = input.title.includes(SITE.brand) ? input.title : `${input.title} | ${SITE.brand}`;
  const description = input.description ?? SITE.description;
  const url = input.path ? `${SITE.url}${input.path}` : SITE.url;
  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : `${SITE.url}${input.image}`
    : `${SITE.url}${SITE.defaultOgImage}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type === "article" ? "article" : "website",
      url,
      title,
      description,
      siteName: SITE.brand,
      locale: SITE.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.publishedTime && { publishedTime: input.publishedTime }),
      ...(input.modifiedTime && { modifiedTime: input.modifiedTime }),
      ...(input.tags && { tags: input.tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@timjanepat",
    },
    authors: [{ name: SITE.author.name, url: SITE.url }],
    creator: SITE.author.name,
    publisher: SITE.author.name,
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    other: {
      "geo.region": SITE.geo.region,
      "geo.placename": SITE.geo.placename,
      "geo.position": SITE.geo.position,
      ICBM: SITE.geo.icbm,
    },
  };
}
