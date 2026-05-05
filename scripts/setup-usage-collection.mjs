#!/usr/bin/env node
/**
 * Create janepat_usage collection in Pocketbase to track LLM API usage.
 * Run: node scripts/setup-usage-collection.mjs
 */
import PocketBase from "pocketbase";

const PB_URL = "https://db.aiceo.im";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL ?? "dop9th@gmail.com";
const ADMIN_PASS = process.env.PB_ADMIN_PASSWORD ?? "AiCEO2026";

async function main() {
  const pb = new PocketBase(PB_URL);
  console.log(`→ Connecting to ${PB_URL}`);

  try {
    await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  } catch {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  }
  console.log("✓ Authenticated");

  const collection = {
    name: "janepat_usage",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "provider", type: "text", required: true },
      { name: "model", type: "text", required: true },
      { name: "input_tokens", type: "number", required: false },
      { name: "output_tokens", type: "number", required: false },
      { name: "cost_usd", type: "number", required: false },
      { name: "video_id", type: "text", required: false },
      { name: "channel", type: "text", required: false },
      { name: "status", type: "select", required: false, values: ["ok", "error"] },
    ],
  };

  try {
    const existing = await pb.collections.getOne("janepat_usage").catch(() => null);
    if (existing) {
      console.log("· janepat_usage already exists — skipping");
      return;
    }
    await pb.collections.create(collection);
    console.log("✓ janepat_usage created");
  } catch (err) {
    console.error("✗ Failed:", err?.response?.message ?? err.message);
    if (err?.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
    process.exit(1);
  }
}

main();
