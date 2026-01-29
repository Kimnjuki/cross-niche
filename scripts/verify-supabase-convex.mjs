#!/usr/bin/env node
/**
 * Verify Convex data (table counts and key checks).
 * Run: npm run verify:convex  or  npm run verify:convex-only
 * Requires: CONVEX_URL or VITE_CONVEX_URL in .env.local
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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
  console.log("Verifying Convex data...\n");

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
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
