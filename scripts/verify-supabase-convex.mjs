#!/usr/bin/env node
/**
 * Verify Supabase and Convex data match (counts + key checks).
 * Run: npm run verify:convex
 *       npm run verify:convex -- --convex-only   (skip Supabase; use when Supabase is unreachable)
 * Requires: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY in .env; CONVEX_URL or VITE_CONVEX_URL in .env.local.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// npm may not pass -- after -- to script on some setups; support env too
const CONVEX_ONLY = process.argv.includes("--convex-only") || process.env.VERIFY_CONVEX_ONLY === "1";

// Load .env.local and .env
function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(ROOT, name);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) {
        const key = m[1];
        const val = m[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    });
  }
  // Normalize Convex URL from Vite var
  if (process.env.VITE_CONVEX_URL && !process.env.CONVEX_URL)
    process.env.CONVEX_URL = process.env.VITE_CONVEX_URL;
}
loadEnv();

let convexClient = null;
let convexApi = null;

async function getConvexClient() {
  if (convexClient) return convexClient;
  const url = process.env.CONVEX_URL;
  if (!url) throw new Error("CONVEX_URL or VITE_CONVEX_URL not set. Run 'npx convex dev' and ensure .env.local has VITE_CONVEX_URL.");
  const { ConvexHttpClient } = await import("convex/browser");
  const apiPath = pathToFileURL(path.join(ROOT, "convex", "_generated", "api.js")).href;
  const { api } = await import(apiPath);
  convexApi = api;
  convexClient = new ConvexHttpClient(url);
  return convexClient;
}

function isNetworkError(msg) {
  const m = (msg ?? "").toLowerCase();
  return m.includes("fetch failed") || m.includes("econnrefused") || m.includes("enotfound") || m.includes("network") || m.includes("typeerror");
}

async function supabaseCount(supabase, table) {
  try {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) {
      if (isNetworkError(error.message)) {
        throw new Error(
          `SUPABASE_UNREACHABLE: ${error.message}\n  Supabase could not be reached (network/firewall). Use --convex-only to verify Convex data only.`
        );
      }
      console.warn(`  Supabase ${table}: ${error.message} (treating as 0)`);
      return 0;
    }
    return count ?? 0;
  } catch (err) {
    if (err?.message?.includes("SUPABASE_UNREACHABLE")) throw err;
    const msg = err?.message ?? String(err);
    if (isNetworkError(msg)) {
      throw new Error(
        `SUPABASE_UNREACHABLE: ${msg}\n  Supabase could not be reached (network/firewall). Use --convex-only to verify Convex data only.`
      );
    }
    throw err;
  }
}

const TABLE_MAP = [
  ["niches", "niches"],
  ["tags", "tags"],
  ["users", "users"],
  ["content", "content"],
  ["content_niches", "contentNiches"],
  ["content_tags", "contentTags"],
  ["content_tables", "contentTables"],
];

async function main() {
  if (CONVEX_ONLY) {
    await runConvexOnly();
    return;
  }
  console.log("Verifying Supabase vs Convex data...\n");

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");
    process.exit(1);
  }
  try {
    const u = new URL(supabaseUrl);
    console.log(`Supabase: ${u.origin} (check network if fetch fails)\n`);
  } catch {
    console.log("Supabase URL set.\n");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey);

  const client = await getConvexClient();
  const api = convexApi;

  let allCountsMatch = true;
  let supabaseUnreachable = false;

  // ─── Counts ─────────────────────────────────────────────────────────────
  console.log("Table counts:");
  console.log("─".repeat(60));

  const convexCounts = await client.query(api.verify.getTableCounts, {});

  for (const [supabaseTable, convexKey] of TABLE_MAP) {
    let supabaseCountVal;
    try {
      supabaseCountVal = await supabaseCount(supabase, supabaseTable);
    } catch (err) {
      if (err?.message?.includes("SUPABASE_UNREACHABLE")) {
        console.error("\n" + err.message);
        console.error("\nRun Convex-only verification (no Supabase):\n  npm run verify:convex-only\n");
        process.exit(1);
      }
      throw err;
    }
    const convexCountVal = convexCounts[convexKey] ?? 0;
    const match = supabaseCountVal === convexCountVal;
    if (!match) allCountsMatch = false;
    const status = match ? "✓" : "✗ MISMATCH";
    console.log(`  ${supabaseTable.padEnd(20)} Supabase: ${String(supabaseCountVal).padStart(5)}  Convex: ${String(convexCountVal).padStart(5)}  ${status}`);
  }

  console.log("─".repeat(60));

  // ─── Spot-check: content slugs ───────────────────────────────────────────
  console.log("\nSpot-check: content slugs");
  const convexSlugs = await client.query(api.verify.getContentSlugs, {});
  const convexSlugSet = new Set(convexSlugs.map((r) => r.slug));

  let supabaseSlugSet = new Set();
  try {
    const { data: supabaseContent } = await supabase.from("content").select("slug");
    supabaseSlugSet = new Set((supabaseContent ?? []).map((r) => r.slug));
  } catch (err) {
    if ((err?.message ?? "").includes("fetch failed")) supabaseUnreachable = true;
    else throw err;
  }

  const onlyInSupabase = [...supabaseSlugSet].filter((s) => !convexSlugSet.has(s));
  const onlyInConvex = [...convexSlugSet].filter((s) => !supabaseSlugSet.has(s));
  const slugsMatch = onlyInSupabase.length === 0 && onlyInConvex.length === 0;

  if (slugsMatch) {
    console.log(`  Content slugs: ✓ ${supabaseSlugSet.size} slugs match.`);
  } else {
    allCountsMatch = false;
    if (onlyInSupabase.length) console.log(`  Only in Supabase (${onlyInSupabase.length}):`, onlyInSupabase.slice(0, 5).join(", "), onlyInSupabase.length > 5 ? "..." : "");
    if (onlyInConvex.length) console.log(`  Only in Convex (${onlyInConvex.length}):`, onlyInConvex.slice(0, 5).join(", "), onlyInConvex.length > 5 ? "..." : "");
  }

  // ─── Spot-check: niches (id + name) ────────────────────────────────────
  console.log("\nSpot-check: niches (idNum, name)");
  const convexNiches = await client.query(api.verify.getNicheKeys, {});
  const convexNicheKeySet = new Set(convexNiches.map((r) => `${r.idNum}:${r.name}`));

  let supabaseNicheKeySet = new Set();
  try {
    const { data: supabaseNiches } = await supabase.from("niches").select("id, name");
    supabaseNicheKeySet = new Set((supabaseNiches ?? []).map((r) => `${r.id}:${r.name}`));
  } catch (err) {
    if ((err?.message ?? "").includes("fetch failed")) supabaseUnreachable = true;
    else throw err;
  }

  const nichesMatch = convexNicheKeySet.size === supabaseNicheKeySet.size &&
    [...convexNicheKeySet].every((k) => supabaseNicheKeySet.has(k));
  if (nichesMatch) {
    console.log(`  Niches: ✓ ${convexNicheKeySet.size} (idNum, name) pairs match.`);
  } else {
    allCountsMatch = false;
    console.log(`  Niches: ✗ Supabase ${supabaseNicheKeySet.size} vs Convex ${convexNicheKeySet.size} or key mismatch.`);
  }

  // ─── Spot-check: tags (slug + name) ───────────────────────────────────────
  console.log("\nSpot-check: tags (slug, name)");
  const convexTags = await client.query(api.verify.getTagKeys, {});
  const convexTagKeySet = new Set(convexTags.map((r) => `${r.slug}:${r.name}`));

  let supabaseTagKeySet = new Set();
  try {
    const { data: supabaseTags } = await supabase.from("tags").select("slug, name");
    supabaseTagKeySet = new Set((supabaseTags ?? []).map((r) => `${r.slug}:${r.name}`));
  } catch (err) {
    if ((err?.message ?? "").includes("fetch failed")) supabaseUnreachable = true;
    else throw err;
  }

  const tagsMatch = convexTagKeySet.size === supabaseTagKeySet.size &&
    [...convexTagKeySet].every((k) => supabaseTagKeySet.has(k));
  if (tagsMatch) {
    console.log(`  Tags: ✓ ${convexTagKeySet.size} (slug, name) pairs match.`);
  } else {
    allCountsMatch = false;
    console.log(`  Tags: ✗ Supabase ${supabaseTagKeySet.size} vs Convex ${convexTagKeySet.size} or key mismatch.`);
  }

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(60));
  if (allCountsMatch && slugsMatch && nichesMatch && tagsMatch) {
    console.log("Result: ALL CHECKS PASSED — data matches. Safe to switch to Convex on Coolify.");
    process.exit(0);
  } else {
    console.log("Result: MISMATCHES FOUND — fix discrepancies before switching off Supabase.");
    process.exit(1);
  }
}

async function runConvexOnly() {
  console.log("Verifying Convex data only (Supabase skipped).\n");

  const client = await getConvexClient();
  const api = convexApi;

  const counts = await client.query(api.verify.getTableCounts, {});

  console.log("Convex table counts:");
  console.log("─".repeat(50));
  for (const [, convexKey] of TABLE_MAP) {
    const val = counts[convexKey] ?? 0;
    console.log(`  ${convexKey.padEnd(20)} ${val}`);
  }
  console.log("─".repeat(50));

  const slugs = await client.query(api.verify.getContentSlugs, {});
  const niches = await client.query(api.verify.getNicheKeys, {});
  const tags = await client.query(api.verify.getTagKeys, {});

  console.log(`\nContent slugs: ${slugs.length}`);
  console.log(`Niches (idNum, name): ${niches.length}`);
  console.log(`Tags (slug, name): ${tags.length}`);

  console.log("\n" + "═".repeat(50));
  console.log("Result: Convex data summary complete.");
  console.log("To compare with Supabase, run without --convex-only when Supabase is reachable.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
