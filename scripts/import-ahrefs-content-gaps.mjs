#!/usr/bin/env node
/**
 * Import Ahrefs content gap data into Convex `contentGaps`.
 *
 * Usage:
 *   node scripts/import-ahrefs-content-gaps.mjs path/to/gaps.json
 *
 * gaps.json format:
 * [
 *   {
 *     "keyword": "gaming performance optimization",
 *     "searchVolume": 4400,
 *     "keywordDifficulty": 28,
 *     "competitorCount": 7,
 *     "priority": 44 - 56,
 *     "status": "identified",
 *     "targetRank": 5
 *   }
 * ]
 */

try {
  await import("dotenv/config");
} catch {
  // optional
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/import-ahrefs-content-gaps.mjs path/to/gaps.json");
  process.exit(1);
}

const resolvedPath = path.resolve(__dirname, "..", filePath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

const CONVEX_URL =
  process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error("VITE_CONVEX_URL/CONVEX_URL is required to import gaps.");
  process.exit(1);
}

const raw = fs.readFileSync(resolvedPath, "utf-8");
let data;

try {
  data = JSON.parse(raw);
} catch (err) {
  console.error("Failed to parse JSON:", err.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error("Expected JSON array of gap objects.");
  process.exit(1);
}

async function main() {
  console.log(`Importing ${data.length} content gaps into Convex...`);
  const client = new ConvexHttpClient(CONVEX_URL);

  const items = data.map((item) => ({
    keyword: String(item.keyword),
    searchVolume: Number(item.searchVolume ?? 0),
    keywordDifficulty: Number(item.keywordDifficulty ?? 0),
    competitorCount: Number(item.competitorCount ?? 0),
    priority: Number(item.priority ?? 0),
    status: item.status ?? "identified",
    targetRank:
      typeof item.targetRank === "number" ? item.targetRank : undefined,
  }));

  await client.mutation(api.seoOptimization.bulkUpsertContentGaps, {
    items,
  });

  console.log("✅ Content gaps import complete.");
}

main().catch((err) => {
  console.error("Error importing content gaps:", err);
  process.exit(1);
});

