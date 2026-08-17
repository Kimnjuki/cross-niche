/**
 * Phase 0 SEO hygiene runner for The Grid Nexus.
 *
 * Runs the critical Convex mutations and local checks required by the
 * GN-P0 backlog in sequence:
 *   - GN-P0-01: cleanPlaceholderContent
 *   - GN-P0-02: findDuplicateContent (report only)
 *   - GN-P0-03: scanBrokenInternalLinks
 *   - GN-P0-05: generate-seo-sitemaps.mjs
 *   - GN-P0-05: generate-prerender-routes.mjs
 *   - GN-P0-01 (CI): audit-placeholder-content.ts
 *
 * Usage:
 *   npm run convex:clean-placeholder
 *   npx convex run admin:findDuplicateContent
 *   npx convex run linkIntelligence:scanBrokenInternalLinks
 *   npm run generate:sitemaps
 *   npm run generate:placeholders
 *   npm run audit:placeholder
 */

import { execSync } from "child_process";

const steps = [
  { name: "cleanPlaceholderContent", cmd: "npx convex run admin:cleanPlaceholderContent" },
  { name: "findDuplicateContent", cmd: "npx convex run admin:findDuplicateContent" },
  { name: "scanBrokenInternalLinks", cmd: "npx convex run linkIntelligence:scanBrokenInternalLinks" },
  { name: "generateSitemaps", cmd: "node scripts/generate-seo-sitemaps.mjs" },
  { name: "generatePrerenderRoutes", cmd: "node scripts/generate-prerender-routes.mjs" },
  { name: "auditPlaceholder", cmd: "npx tsx scripts/audit-placeholder-content.ts" },
];

let failed = 0;
for (const step of steps) {
  console.log(`\n▶ ${step.name}`);
  try {
    execSync(step.cmd, { stdio: "inherit" });
  } catch (error) {
    console.error(`✗ ${step.name} failed`);
    failed++;
  }
}

console.log(`\n${failed === 0 ? '✓ All Phase 0 checks passed.' : `✗ ${failed} step(s) failed.`}`);
process.exit(failed > 0 ? 1 : 0);
