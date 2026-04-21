/**
 * Verification queries for Supabase ↔ Convex migration check.
 * Used by scripts/verify-supabase-convex.mjs.
 */

import { query } from "./_generated/server";

export const getTableCounts = query({
  args: {},
  handler: async (ctx) => {
    const [niches, tags, users, content, contentNiches, contentTags, contentTables] =
      await Promise.all([
        ctx.db.query("niches").collect().then((r) => r.length),
        ctx.db.query("tags").collect().then((r) => r.length),
        ctx.db.query("users").collect().then((r) => r.length),
        ctx.db.query("content").collect().then((r) => r.length),
        ctx.db.query("contentNiches").collect().then((r) => r.length),
        ctx.db.query("contentTags").collect().then((r) => r.length),
        ctx.db.query("contentTables").collect().then((r) => r.length),
      ]);
    return {
      niches,
      tags,
      users,
      content,
      contentNiches,
      contentTags,
      contentTables,
    };
  },
});

/** Content slugs + legacyId for spot-check against Supabase content.id/slug */
export const getContentSlugs = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("content").collect();
    return rows.map((r) => ({ slug: r.slug, legacyId: r.legacyId ?? null }));
  },
});

/** Niche idNum + name for spot-check */
export const getNicheKeys = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("niches").collect();
    return rows.map((r) => ({ idNum: r.idNum, name: r.name }));
  },
});

/** Tag slug + name for spot-check */
export const getTagKeys = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("tags").collect();
    return rows.map((r) => ({ slug: r.slug, name: r.name }));
  },
});
