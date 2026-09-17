/**
 * Redirect registry (SEO remediation P0-04 / P0-06).
 *
 * Backs the `redirects` table added to convex/schema.ts. The insert mutation
 * flattens chains and rejects loops at write time, so the live redirect map can
 * never grow the "72 redirect chains / 3 loops" failures the audits reported.
 *
 * Deploy-time source of truth: vercel.json `redirects` (see
 * scripts/sync_redirects_to_vercel.ts). This table is the queryable, auditable
 * registry that sync script reads from and admins manage.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Guard against pathological graphs; real redirect maps are flat. */
export const MAX_REDIRECT_HOPS = 10;

/** Normalise a path: leading slash, no trailing slash (except root), lowercase. */
export function normalizePath(input: string): string {
  let p = String(input ?? "").trim();
  if (!p) return "";
  if (!p.startsWith("/")) p = `/${p}`;
  // Strip query/fragment — redirect keys are path-only.
  p = p.split(/[?#]/)[0];
  if (p.length > 1 && p.endsWith("/")) p = p.replace(/\/+$/, "");
  return p.toLowerCase();
}

export const insertRedirect = mutation({
  args: {
    fromPath: v.string(),
    toPath: v.string(),
    statusCode: v.union(v.literal(301), v.literal(302), v.literal(308)),
    reason: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fromPath = normalizePath(args.fromPath);
    let target = normalizePath(args.toPath);

    if (!fromPath || fromPath === "/") {
      throw new Error(`insertRedirect: invalid source path "${args.fromPath}"`);
    }
    if (!target || target === "/") {
      throw new Error(`insertRedirect: invalid destination path "${args.toPath}"`);
    }
    if (fromPath === target) {
      throw new Error(`insertRedirect: self-loop rejected (${fromPath} → ${fromPath})`);
    }

    // Walk the existing graph from the destination to its final target and
    // store the redirect pointing straight at the end of the chain. This is
    // what guarantees "no redirect chain is longer than one hop".
    const seen = new Set<string>([fromPath]);
    let hops = 0;
    while (hops < MAX_REDIRECT_HOPS) {
      if (seen.has(target)) {
        throw new Error(
          `insertRedirect: loop detected — ${fromPath} → ${args.toPath} → ${target} cycles back through a redirect source`
        );
      }
      seen.add(target);
      const next = await ctx.db
        .query("redirects")
        .withIndex("by_from_path", (q) => q.eq("fromPath", target))
        .first();
      if (!next) break;
      target = next.toPath;
      hops += 1;
    }
    if (hops >= MAX_REDIRECT_HOPS) {
      throw new Error(
        `insertRedirect: chain deeper than ${MAX_REDIRECT_HOPS} hops from "${args.toPath}" — refusing to insert`
      );
    }

    const now = Date.now();
    const doc = {
      fromPath,
      toPath: target,
      statusCode: args.statusCode,
      reason: args.reason,
      createdAt: now,
      createdBy: args.createdBy,
    };

    // Upsert: one rule per source path.
    const existing = await ctx.db
      .query("redirects")
      .withIndex("by_from_path", (q) => q.eq("fromPath", fromPath))
      .first();
    if (existing) {
      await ctx.db.replace(existing._id, doc);
    } else {
      await ctx.db.insert("redirects", doc);
    }

    return { fromPath, toPath: target, flattenedHops: hops, replaced: !!existing };
  },
});

export const removeRedirect = mutation({
  args: { fromPath: v.string() },
  handler: async (ctx, args) => {
    const fromPath = normalizePath(args.fromPath);
    const existing = await ctx.db
      .query("redirects")
      .withIndex("by_from_path", (q) => q.eq("fromPath", fromPath))
      .first();
    if (!existing) return { removed: false };
    await ctx.db.delete(existing._id);
    return { removed: true, fromPath };
  },
});

/** Full redirect map, sorted for the sync script. */
export const listRedirects = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("redirects").collect();
    return rows
      .map((r) => ({ fromPath: r.fromPath, toPath: r.toPath, statusCode: r.statusCode, reason: r.reason ?? null }))
      .sort((a, b) => a.fromPath.localeCompare(b.fromPath));
  },
});

/**
 * Resolve a path through the map (read-only). Returns the final destination and
 * hop count; `null` when no redirect applies.
 */
export const resolvePath = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    let current = normalizePath(args.path);
    const first = await ctx.db
      .query("redirects")
      .withIndex("by_from_path", (q) => q.eq("fromPath", current))
      .first();
    if (!first) return null;

    let statusCode = first.statusCode;
    let hops = 0;
    while (hops < MAX_REDIRECT_HOPS) {
      const next = await ctx.db
        .query("redirects")
        .withIndex("by_from_path", (q) => q.eq("fromPath", current))
        .first();
      if (!next) break;
      current = next.toPath;
      statusCode = next.statusCode;
      hops += 1;
    }
    return { fromPath: normalizePath(args.path), toPath: current, statusCode, hops };
  },
});

/**
 * Integrity check: every stored destination must be a terminal path (never
 * itself a redirect source). Should always return an empty array because
 * insertRedirect flattens at write time — this is the regression net.
 */
export const verifyNoChains = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("redirects").collect();
    const sources = new Set(rows.map((r) => r.fromPath));
    return rows
      .filter((r) => sources.has(r.toPath) || r.fromPath === r.toPath)
      .map((r) => ({ fromPath: r.fromPath, toPath: r.toPath, problem: r.fromPath === r.toPath ? "self-loop" : "chain" }));
  },
});
