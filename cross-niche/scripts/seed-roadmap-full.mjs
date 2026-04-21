import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const inputPath = path.resolve(ROOT, "roadmap-articles-2026-full.json");
const targetTsPath = path.resolve(ROOT, "convex", "roadmapArticles2026.ts");

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    cwd: ROOT,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(inputPath)) {
  console.error(`Missing input file: ${inputPath}`);
  console.error("Create roadmap-articles-2026-full.json in the repository root, then rerun.");
  process.exit(1);
}

if (!process.env.CONVEX_DEPLOY_KEY) {
  console.error("CONVEX_DEPLOY_KEY is required for deploy and seed.");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
let data;
try {
  data = JSON.parse(raw);
} catch (error) {
  console.error("Invalid JSON in roadmap-articles-2026-full.json");
  console.error(error);
  process.exit(1);
}

if (!Array.isArray(data) || data.length === 0) {
  console.error("Input JSON must be a non-empty array.");
  process.exit(1);
}

for (const [index, item] of data.entries()) {
  if (!item?.slug || !item?.title || !item?.body) {
    console.error(`Invalid entry at index ${index}: each item must include slug, title, and body.`);
    process.exit(1);
  }
}

const tsContent =
  "export const roadmapArticles2026 = " + JSON.stringify(data, null, 2) + ";\n";
fs.writeFileSync(targetTsPath, tsContent, "utf8");
console.log(`Updated ${path.relative(ROOT, targetTsPath)} with ${data.length} articles.`);

console.log("Deploying Convex functions...");
run("npx", ["convex", "deploy", "--yes", "--typecheck", "disable"]);

console.log("Running roadmap seed mutation...");
run("npx", ["convex", "run", "seed:seedRoadmapArticles2026"]);

console.log("Done. Roadmap full-content seed completed.");
