import PocketBase from "pocketbase";
import { SITE } from "./site";

let pbClient: PocketBase | null = null;

export function pb(): PocketBase {
  if (!pbClient) {
    pbClient = new PocketBase(SITE.pocketbase.url);
    pbClient.autoCancellation(false);
  }
  return pbClient;
}

export type PostRecord = {
  id: string;
  slug: string;
  title_th: string;
  title_en?: string;
  excerpt: string;
  content_md: string;
  cover?: string;
  category: string;
  tags?: string[];
  author?: string;
  published: boolean;
  featured?: boolean;
  reading_minutes?: number;
  seo_title?: string;
  seo_description?: string;
  faq_jsonld?: Array<{ q: string; a: string }>;
  howto_jsonld?: { name: string; steps: Array<{ name: string; text: string }> };
  citations?: Array<{ label: string; url: string }>;
  created: string;
  updated: string;
};

export type CategoryRecord = {
  id: string;
  slug: string;
  name_th: string;
  name_en?: string;
  description: string;
  pillar_intro_md?: string;
  seo_title?: string;
  seo_description?: string;
  cover?: string;
};

export type LeadRecord = {
  name: string;
  email: string;
  phone?: string;
  type: "brand_deal" | "consulting" | "training" | "general";
  project_brief?: string;
  source?: string;
  page_path?: string;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  deliverables: string[];
  pricing_note?: string;
  icon?: string;
  order?: number;
};

export async function listPublishedPosts(opts?: {
  category?: string;
  limit?: number;
  featured?: boolean;
}): Promise<PostRecord[]> {
  try {
    const filters = [`published = true`];
    if (opts?.category) filters.push(`category = "${opts.category}"`);
    if (opts?.featured) filters.push(`featured = true`);
    const result = await pb()
      .collection("janepat_posts")
      .getList<PostRecord>(1, opts?.limit ?? 50, {
        filter: filters.join(" && "),
        sort: "-created",
      });
    return result.items;
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostRecord | null> {
  try {
    return await pb()
      .collection("janepat_posts")
      .getFirstListItem<PostRecord>(`slug = "${slug}" && published = true`);
  } catch {
    return null;
  }
}

export async function listCategories(): Promise<CategoryRecord[]> {
  try {
    const result = await pb()
      .collection("janepat_categories")
      .getList<CategoryRecord>(1, 50, { sort: "name_th" });
    return result.items;
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  try {
    return await pb()
      .collection("janepat_categories")
      .getFirstListItem<CategoryRecord>(`slug = "${slug}"`);
  } catch {
    return null;
  }
}

export async function listServices(): Promise<ServiceRecord[]> {
  try {
    const result = await pb()
      .collection("janepat_services")
      .getList<ServiceRecord>(1, 20, { sort: "order" });
    return result.items;
  } catch {
    return [];
  }
}

export async function findPostByVideoId(videoId: string): Promise<PostRecord | null> {
  try {
    return await pb()
      .collection("janepat_posts")
      .getFirstListItem<PostRecord>(`slug ~ "${videoId}"`);
  } catch {
    return null;
  }
}

export async function createPost(post: Partial<PostRecord>): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const record = await pb().collection("janepat_posts").create(post);
    return { ok: true, id: record.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return { ok: false, error: message };
  }
}

export async function authAsAdmin(): Promise<void> {
  const email = process.env.PB_ADMIN_EMAIL;
  const password = process.env.PB_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD required");
  await pb().admins.authWithPassword(email, password);
}

export async function createLead(lead: LeadRecord): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const record = await pb().collection("janepat_leads").create(lead);
    return { ok: true, id: record.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return { ok: false, error: message };
  }
}
