#!/usr/bin/env node
/**
 * Strip self-promo CTA tails from existing janepat_posts.
 * Cuts from the first CTA-starter phrase (in the last 50% of content) to end.
 *
 * Run: node scripts/strip-cta-paragraphs.mjs            # dry-run (default)
 *      node scripts/strip-cta-paragraphs.mjs --apply    # actually update
 */
import PocketBase from "pocketbase";

const PB_URL = "https://db.aiceo.im";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL ?? "dop9th@gmail.com";
const ADMIN_PASS = process.env.PB_ADMIN_PASSWORD ?? "AiCEO2026";
const APPLY = process.argv.includes("--apply");

// CTA-starter patterns — phrases that introduce a "go read other articles" CTA.
// Order matters: more-specific first.
const STARTERS = [
  /\*\*อ่านบทความ/,              // markdown bold list header
  />\s*สนใจอ่านบทความ/,           // blockquote starter
  /หากคุณสนใจเรื่อง[\s\S]{0,400}?(บทความ|janepat\.com)/,
  /หากคุณต้องการเรียนรู้เพิ่มเติม[\s\S]{0,400}?(บทความ|janepat\.com)/,
  /หากคุณ[\s\S]{0,300}?(อ่านบทความ|ใน\s*janepat\.com)/,
  /ผมแนะนำให้อ่านบทความ/,
  /ผมเคยเขียนบทความ/,
  /ลองอ่านบทความ/,
  /อยากลองทำเพิ่มเติม\s*\?/,
  /สนใจอ่านบทความ/,
  /อ่านบทความอื่น/,
  /ติดตามบทความอื่น/,
  // Inline reference like "...อีกหลายเรื่องที่ janepat.com..." — catch anything mentioning janepat.com mid-tail
  /[ก-๙]+\s*ที่\s*janepat\.com/i,
  /(?:ความรู้|บทความ|เนื้อหา)[\s\S]{0,150}?janepat\.com/i,
];

function findCutIndex(md) {
  // Only consider matches in the last 50% of content (closing region)
  const minIdx = Math.floor(md.length * 0.5);
  let earliest = -1;
  for (const re of STARTERS) {
    const m = md.match(re);
    if (m && m.index >= minIdx) {
      if (earliest === -1 || m.index < earliest) earliest = m.index;
    }
  }
  return earliest;
}

/**
 * Strip from the CTA match position to end. Then iteratively remove orphan
 * markdown markers from the tail (e.g. dangling `* **` left after cutting
 * the bullet body).
 */
function stripCta(md) {
  const cut = findCutIndex(md);
  if (cut === -1) return null;

  let result = md.slice(0, cut).replace(/[ \t]+$/, "");

  // Pop orphan marker-only trailing lines (max 5 iterations)
  const ORPHAN_LINE = /^[ \t]*(?:\*\*[ \t]*|[*\-+][ \t]*\*\*[ \t]*|[*\-+][ \t]*|>[ \t]*|[ \t]*)$/;
  for (let i = 0; i < 5; i++) {
    const lines = result.split("\n");
    const last = lines[lines.length - 1];
    if (lines.length > 1 && ORPHAN_LINE.test(last)) {
      lines.pop();
      result = lines.join("\n").replace(/[ \t]+$/, "");
    } else {
      break;
    }
  }

  return result.replace(/\s+$/, "");
}

async function main() {
  const pb = new PocketBase(PB_URL);
  try {
    await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  } catch {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  }
  console.log(`✓ Authenticated. Mode: ${APPLY ? "APPLY" : "DRY-RUN"}\n`);

  const list = await pb.collection("janepat_posts").getList(1, 200);
  let totalScanned = 0;
  let totalChanged = 0;

  for (const r of list.items) {
    totalScanned++;
    const original = r.content_md ?? "";
    const cleaned = stripCta(original);
    if (cleaned === null || cleaned === original) continue;

    totalChanged++;
    const removed = original.length - cleaned.length;
    console.log(`--- ${r.slug} (-${removed} chars) ---`);
    console.log(`REMOVED TAIL:`);
    console.log(original.slice(cleaned.length).trim());
    console.log(`\nNEW ENDING:`);
    console.log(cleaned.slice(-300));
    console.log("\n");

    if (APPLY) {
      try {
        await pb.collection("janepat_posts").update(r.id, { content_md: cleaned });
        console.log(`  ✓ updated ${r.slug}\n`);
      } catch (e) {
        console.error(`  ! update failed: ${e.message}\n`);
      }
    }
  }

  console.log(`==========================================`);
  console.log(`Scanned: ${totalScanned}  Changed: ${totalChanged}`);
  if (!APPLY && totalChanged > 0) {
    console.log(`\n→ Re-run with --apply to actually update`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
