import { SITE } from "./site";

export function jsonLdScriptProps(data: unknown) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.author.fullName,
    alternateName: SITE.author.name,
    url: SITE.url,
    image: `${SITE.url}${SITE.author.avatar}`,
    jobTitle: SITE.author.role,
    description: SITE.author.bio,
    sameAs: [
      SITE.social.youtube,
      SITE.social.facebook,
      SITE.social.instagram,
      SITE.social.x,
      SITE.social.linkedin,
      SITE.social.tiktok,
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Generative AI",
      "ChatGPT",
      "Claude AI",
      "Gemini",
      "AI Marketing",
      "AI Automation",
      "Prompt Engineering",
      "Digital Marketing",
      "Content Creation",
      "Large Language Models",
      "n8n",
      "AI for Business",
    ],
    // removed external worksFor reference
    knowsLanguage: ["th", "en"],
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.brand,
    url: SITE.url,
    logo: `${SITE.url}/images/logo.png`,
    founder: { "@id": `${SITE.url}/#person` },
    sameAs: [
      SITE.social.youtube,
      SITE.social.facebook,
      SITE.social.instagram,
      SITE.social.x,
      SITE.social.linkedin,
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.brand,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type ArticleSchemaInput = {
  url: string;
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
  tags?: string[];
};

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image ? [input.image] : [`${SITE.url}${SITE.defaultOgImage}`],
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: SITE.language,
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    articleSection: input.category,
    keywords: input.tags?.join(", "),
    // Speakable — voice/AI assistants will read these selectors aloud
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".tldr"],
    },
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function howToSchema(input: {
  name: string;
  description?: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** CollectionPage — for /blog, /videos listing pages */
export function collectionPageSchema(input: {
  url: string;
  name: string;
  description: string;
  numberOfItems?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${input.url}#collection`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": `${SITE.url}/#organization` },
    ...(input.numberOfItems && { numberOfItems: input.numberOfItems }),
  };
}

/** ItemList — listing of articles or videos */
export function itemListSchema(input: {
  url: string;
  items: Array<{ url: string; name: string; image?: string; position?: number }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${input.url}#itemlist`,
    itemListElement: input.items.map((it, idx) => ({
      "@type": "ListItem",
      position: it.position ?? idx + 1,
      url: it.url,
      name: it.name,
      ...(it.image && { image: it.image }),
    })),
  };
}

/** VideoObject — for individual videos in the videos grid */
export function videoObjectSchema(input: {
  videoId: string;
  name: string;
  description?: string;
  thumbnail: string;
  uploadDate: string;
  durationSec?: number;
}) {
  const url = `https://www.youtube.com/watch?v=${input.videoId}`;
  const isoDuration = input.durationSec
    ? `PT${Math.floor(input.durationSec / 60)}M${input.durationSec % 60}S`
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description ?? input.name,
    thumbnailUrl: input.thumbnail,
    uploadDate: input.uploadDate,
    contentUrl: url,
    embedUrl: `https://www.youtube.com/embed/${input.videoId}`,
    publisher: { "@id": `${SITE.url}/#organization` },
    creator: { "@id": `${SITE.url}/#person` },
    inLanguage: SITE.language,
    ...(isoDuration && { duration: isoDuration }),
  };
}

/** Service schema — for /services in-house training page */
export function serviceSchema(input: {
  name: string;
  description: string;
  url: string;
  serviceType?: string[];
  priceRangeFrom?: number;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    provider: { "@id": `${SITE.url}/#person` },
    areaServed: { "@type": "Country", name: "Thailand" },
    inLanguage: SITE.language,
    ...(input.serviceType && { serviceType: input.serviceType }),
    ...(input.priceRangeFrom && {
      offers: {
        "@type": "Offer",
        priceCurrency: input.priceCurrency ?? "THB",
        price: input.priceRangeFrom,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: input.priceRangeFrom,
          priceCurrency: input.priceCurrency ?? "THB",
          minPrice: input.priceRangeFrom,
        },
      },
    }),
  };
}

/** Speakable — tells voice/AI assistants which parts of article to read aloud */
export function speakableSchema(cssSelectors: string[] = ["h1", ".tldr", ".speakable"]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  };
}

/** WebPage — generic schema for static pages (about, contact) */
export function webPageSchema(input: {
  url: string;
  name: string;
  description: string;
  type?: "AboutPage" | "ContactPage" | "WebPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": `${SITE.url}/#organization` },
    about: { "@id": `${SITE.url}/#person` },
  };
}
