#!/usr/bin/env node
import PocketBase from "pocketbase";

const PB_URL = process.env.POCKETBASE_URL || "https://db.aiceo.im";
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "dop9th@gmail.com";
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "AiCEO2026";

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

const COLLECTIONS = [
  {
    name: "janepat_categories",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "slug", type: "text", required: true },
      { name: "name_th", type: "text", required: true },
      { name: "name_en", type: "text" },
      { name: "description", type: "text", required: true },
      { name: "pillar_intro_md", type: "editor" },
      { name: "seo_title", type: "text" },
      { name: "seo_description", type: "text" },
      { name: "cover", type: "url" },
      { name: "order", type: "number" },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_janepat_categories_slug ON janepat_categories (slug)"],
  },
  {
    name: "janepat_posts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "slug", type: "text", required: true },
      { name: "title_th", type: "text", required: true },
      { name: "title_en", type: "text" },
      { name: "excerpt", type: "text", required: true, max: 500 },
      { name: "content_md", type: "editor", required: true },
      { name: "cover", type: "url" },
      { name: "category", type: "text", required: true },
      { name: "tags", type: "json", maxSize: 5000 },
      { name: "author", type: "text" },
      { name: "published", type: "bool" },
      { name: "featured", type: "bool" },
      { name: "reading_minutes", type: "number" },
      { name: "seo_title", type: "text" },
      { name: "seo_description", type: "text" },
      { name: "faq_jsonld", type: "json", maxSize: 50000 },
      { name: "howto_jsonld", type: "json", maxSize: 50000 },
      { name: "citations", type: "json", maxSize: 10000 },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_janepat_posts_slug ON janepat_posts (slug)"],
  },
  {
    name: "janepat_services",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "slug", type: "text", required: true },
      { name: "title", type: "text", required: true },
      { name: "description", type: "text", required: true, max: 2000 },
      { name: "deliverables", type: "json", maxSize: 5000 },
      { name: "pricing_note", type: "text" },
      { name: "icon", type: "text" },
      { name: "order", type: "number" },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_janepat_services_slug ON janepat_services (slug)"],
  },
  {
    name: "janepat_leads",
    type: "base",
    listRule: null,
    viewRule: null,
    createRule: "",
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true },
      { name: "email", type: "email", required: true },
      { name: "phone", type: "text" },
      { name: "type", type: "select", values: ["brand_deal", "consulting", "training", "general"], maxSelect: 1 },
      { name: "project_brief", type: "text", max: 5000 },
      { name: "source", type: "text" },
      { name: "page_path", type: "text" },
      { name: "responded", type: "bool" },
    ],
  },
];

async function main() {
  console.log(`→ Connecting to ${PB_URL}`);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`✓ Authenticated as admin`);

  const existing = await pb.collections.getFullList();
  const existingByName = new Map(existing.map((c) => [c.name, c]));

  for (const col of COLLECTIONS) {
    const existed = existingByName.get(col.name);
    if (existed) {
      console.log(`↻ ${col.name} already exists — deleting first to ensure clean schema`);
      await pb.collections.delete(existed.id);
    }
    console.log(`+ Creating ${col.name}...`);
    await pb.collections.create(col);
    console.log(`✓ ${col.name} created`);
  }

  console.log(`\nFinal state:`);
  const all = await pb.collections.getFullList();
  for (const c of all.filter((c) => c.name.startsWith("janepat_"))) {
    const userFields = (c.fields ?? []).filter((f) => !f.system);
    console.log(`  - ${c.name}: ${userFields.length} fields`);
    for (const f of userFields) {
      console.log(`      · ${f.name} (${f.type}${f.required ? ", required" : ""})`);
    }
  }
}

main().catch((err) => {
  console.error("✗ Setup failed:", err.message ?? err);
  if (err.response) console.error(JSON.stringify(err.response, null, 2));
  process.exit(1);
});
