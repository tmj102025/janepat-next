#!/usr/bin/env node
/**
 * Delete all current janepat_posts so cron regenerates with new prompt.
 * Run: node scripts/clean-pb-posts.mjs
 */
import PocketBase from "pocketbase";

const PB_URL = "https://db.aiceo.im";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL ?? "dop9th@gmail.com";
const ADMIN_PASS = process.env.PB_ADMIN_PASSWORD ?? "AiCEO2026";

async function main() {
  const pb = new PocketBase(PB_URL);
  try {
    await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  } catch {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  }
  console.log("✓ Authenticated");

  const list = await pb.collection("janepat_posts").getList(1, 200);
  console.log(`Found ${list.items.length} posts to delete`);

  for (const r of list.items) {
    try {
      await pb.collection("janepat_posts").delete(r.id);
      console.log(`  ✗ deleted: ${r.slug}`);
    } catch (e) {
      console.error(`  ! failed ${r.slug}: ${e.message}`);
    }
  }
  console.log("Done.");
}

main();
