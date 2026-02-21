#!/usr/bin/env node
/**
 * Import CSV tables (project root) into Convex.
 * Run: npm run import:csv
 * Requires: CONVEX_URL in .env.local (run "npx convex dev" in another terminal first).
 * CSV files expected in project root: niches_rows.csv, tags_rows.csv, users_rows.csv,
 * content_rows.csv, content_niches_rows.csv, content_tags_rows.csv, content_tables_rows.csv
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load Convex URL from .env.local (Convex dev writes VITE_CONVEX_URL for Vite) or .env
function loadEnvLocal() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(ROOT, name);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^(CONVEX_URL|VITE_CONVEX_URL)=(.*)$/);
      if (m) {
        const val = m[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env.CONVEX_URL) process.env.CONVEX_URL = val;
      }
    });
    if (process.env.CONVEX_URL) break;
  }
}
loadEnvLocal();

let convexClient = null;
let convexApi = null;

async function getConvexClient() {
  if (convexClient) return convexClient;
  const url = process.env.CONVEX_URL;
  if (!url) {
    throw new Error(
      "CONVEX_URL is not set. Run 'npx convex dev' once (it writes VITE_CONVEX_URL to .env.local); this script reads that as CONVEX_URL."
    );
  }
  const { ConvexHttpClient } = await import("convex/browser");
  // Use absolute path so Node resolves api.js reliably on Windows
  const apiPath = pathToFileURL(path.join(ROOT, "convex", "_generated", "api.js")).href;
  const { api } = await import(apiPath);
  convexApi = api;
  convexClient = new ConvexHttpClient(url);
  return convexClient;
}

/**
 * Parse CSV with quoted fields (handles commas and newlines inside quotes).
 * No external package required.
 */
function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const rows = [];
  let i = 0;
  const len = raw.length;

  function readRow() {
    const values = [];
    let field = "";
    while (i < len) {
      const ch = raw[i];
      if (ch === '"') {
        i++;
        while (i < len) {
          const c = raw[i];
          if (c === '"') {
            i++;
            if (raw[i] === '"') {
              field += '"';
              i++;
            } else {
              break;
            }
          } else {
            field += c;
            i++;
          }
        }
        continue;
      }
      if (ch === "," || ch === "\n" || ch === "\r") {
        values.push(field);
        field = "";
        if (ch === "\n") {
          i++;
          break;
        }
        if (ch === "\r") {
          i++;
          if (raw[i] === "\n") i++;
          break;
        }
        i++;
        continue;
      }
      field += ch;
      i++;
    }
    if (field.length > 0 || values.length > 0) values.push(field);
    return values.length ? values : null;
  }

  const header = readRow();
  if (!header) return [];
  while (i < len) {
    const values = readRow();
    if (!values) break;
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = values[idx] ?? "";
    });
    rows.push(obj);
  }
  return rows;
}

async function runConvex(mutationName, payload, captureStdout = false) {
  const client = await getConvexClient();
  const [mod, fn] = mutationName.split(":");
  if (!convexApi[mod]) {
    throw new Error(
      `Convex API has no module "${mod}". Run "npx convex dev" so your convex/import.ts is deployed, then try again.`
    );
  }
  const ref = convexApi[mod][fn];
  if (!ref) throw new Error(`Unknown mutation: ${mutationName}`);
  try {
    const result = await client.mutation(ref, payload);
    return captureStdout ? result : null;
  } catch (err) {
    const msg = err?.message ?? String(err);
    const details = err?.data ?? err?.cause ?? "";
    throw new Error(
      `Convex ${mutationName} failed: ${msg}${details ? ` (${JSON.stringify(details)})` : ""}`
    );
  }
}

function parseDate(v) {
  if (v == null || v === "") return undefined;
  const t = Date.parse(v);
  return Number.isNaN(t) ? undefined : t;
}

function parseNum(v) {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function parseBool(v) {
  if (v == null || v === "") return undefined;
  const s = String(v).toLowerCase();
  return s === "true" || s === "t" || s === "1" ? true : s === "false" || s === "f" || s === "0" ? false : undefined;
}

function parseJson(v) {
  if (v == null || v === "") return undefined;
  try {
    return JSON.parse(v);
  } catch {
    return undefined;
  }
}

async function main() {
  console.log("Importing CSVs from project root into Convex...\n");

  // 1. Niches
  const nichesPath = path.join(ROOT, "niches_rows.csv");
  if (!fs.existsSync(nichesPath)) {
    console.warn("Skip niches: niches_rows.csv not found.");
  } else {
    const rows = parseCSV(nichesPath);
    const items = rows.map((r) => ({
      idNum: parseNum(r.id) ?? 0,
      name: r.name ?? "",
      colorCode: r.color_code || undefined,
    }));
    console.log("Importing niches:", items.length);
    await runConvex("import:insertNichesBatch", { items });
    console.log("Niches done.\n");
  }

  // 2. Tags (we need id -> Convex _id map; Convex returns ids in order)
  const tagsPath = path.join(ROOT, "tags_rows.csv");
  let tagIdToConvexId = {};
  if (!fs.existsSync(tagsPath)) {
    console.warn("Skip tags: tags_rows.csv not found.");
  } else {
    const rows = parseCSV(tagsPath);
    const items = rows.map((r) => ({ name: r.name ?? "", slug: r.slug ?? "" }));
    console.log("Importing tags:", items.length);
    const result = await runConvex("import:insertTagsBatch", { items }, true);
    const ids = result?.ids ?? [];
    rows.forEach((r, i) => {
      const oldId = parseNum(r.id);
      if (oldId != null && ids[i]) tagIdToConvexId[oldId] = ids[i];
    });
    console.log("Tags done.\n");
  }

  // 3. Users
  const usersPath = path.join(ROOT, "users_rows.csv");
  if (!fs.existsSync(usersPath)) {
    console.warn("Skip users: users_rows.csv not found.");
  } else {
    const rows = parseCSV(usersPath);
    const items = rows.map((r) => ({
      supabaseUserId: r.id ?? "",
      username: r.username ?? "",
      email: r.email ?? "",
      role: r.role || undefined,
      isPremium: parseBool(r.is_premium),
      displayName: r.display_name || undefined,
      bio: r.bio || undefined,
      avatarUrl: r.avatar_url || undefined,
      socialLinks: parseJson(r.social_links),
    }));
    console.log("Importing users:", items.length);
    await runConvex("import:insertUsersBatch", { items });
    console.log("Users done.\n");
  }

  // 4. Content (in batches; build legacyId -> Convex id map from returned ids)
  const contentPath = path.join(ROOT, "content_rows.csv");
  const contentIdMap = {};
  if (!fs.existsSync(contentPath)) {
    console.warn("Skip content: content_rows.csv not found.");
  } else {
    const rows = parseCSV(contentPath);
    const BATCH = 5;
    for (let i = 0; i < rows.length; i += BATCH) {
      const chunk = rows.slice(i, i + BATCH);
      const items = chunk.map((r) => ({
        title: r.title ?? "",
        slug: r.slug ?? "",
        body: r.body ?? "",
        summary: r.summary || undefined,
        authorId: r.author_id || undefined,
        status: r.status ?? "draft",
        isPremium: parseBool(r.is_premium),
        securityScore: parseNum(r.security_score),
        publishedAt: parseDate(r.published_at),
        subtitle: r.subtitle || undefined,
        metaTitle: r.meta_title || undefined,
        focusKeyword: r.focus_keyword || undefined,
        wordCount: parseNum(r.word_count),
        estimatedReadingTimeMinutes: parseNum(r.estimated_reading_time_minutes),
        viewCount: parseNum(r.view_count),
        legacyId: r.id || undefined,
        featuredImageUrl: undefined,
        isFeatured: parseBool(r.is_featured),
        isBreaking: parseBool(r.is_breaking),
        contentType: r.content_type || undefined,
      }));
      const result = await runConvex("import:insertContentBatch", { items }, true);
      const ids = result?.ids ?? [];
      chunk.forEach((r, j) => {
        if (r.id && ids[j]) contentIdMap[r.id] = ids[j];
      });
      console.log("Content batch", Math.floor(i / BATCH) + 1, "/", Math.ceil(rows.length / BATCH));
    }
    console.log("Content done.\n");
  }

  // 5. Content Niches (content_id -> Convex content id, niche_id = number)
  const cnPath = path.join(ROOT, "content_niches_rows.csv");
  if (!fs.existsSync(cnPath)) {
    console.warn("Skip content_niches: content_niches_rows.csv not found.");
  } else {
    const rows = parseCSV(cnPath);
    const items = rows
      .filter((r) => contentIdMap[r.content_id])
      .map((r) => ({ contentId: contentIdMap[r.content_id], nicheId: parseNum(r.niche_id) ?? 0 }));
    if (items.length) {
      console.log("Importing content_niches:", items.length);
      await runConvex("import:insertContentNichesBatch", { items });
    }
    console.log("Content niches done.\n");
  }

  // 6. Content Tags (content_id -> Convex content id, tag_id -> Convex tag id)
  const ctPath = path.join(ROOT, "content_tags_rows.csv");
  if (!fs.existsSync(ctPath)) {
    console.warn("Skip content_tags: content_tags_rows.csv not found.");
  } else {
    const rows = parseCSV(ctPath);
    const items = rows
      .filter((r) => contentIdMap[r.content_id] && tagIdToConvexId[parseNum(r.tag_id)])
      .map((r) => ({
        contentId: contentIdMap[r.content_id],
        tagId: tagIdToConvexId[parseNum(r.tag_id)],
      }));
    if (items.length) {
      console.log("Importing content_tags:", items.length);
      await runConvex("import:insertContentTagsBatch", { items });
    }
    console.log("Content tags done.\n");
  }

  // 7. Content Tables
  const ctabPath = path.join(ROOT, "content_tables_rows.csv");
  if (!fs.existsSync(ctabPath)) {
    console.warn("Skip content_tables: content_tables_rows.csv not found.");
  } else {
    const rows = parseCSV(ctabPath);
    const items = rows
      .filter((r) => contentIdMap[r.content_id])
      .map((r) => ({
        contentId: contentIdMap[r.content_id],
        tableTitle: r.table_title || undefined,
        tableData: parseJson(r.table_data) ?? {},
        orderIndex: parseNum(r.order_index),
      }));
    if (items.length) {
      console.log("Importing content_tables:", items.length);
      await runConvex("import:insertContentTablesBatch", { items });
    }
    console.log("Content tables done.\n");
  }

  console.log("Import finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
