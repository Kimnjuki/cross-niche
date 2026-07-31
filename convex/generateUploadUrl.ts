/**
 * generateUploadUrl.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a short-lived upload URL for Convex file storage.
 * Used by scripts/seed-ultimate-gaming-security-guide.ts to push the
 * 3 article images into thegridnexus.com Convex backend.
 *
 * Client flow:
 *   1. const uploadUrl = await ctx.storage.generateUploadUrl()   (this mutation)
 *   2. POST the file bytes to uploadUrl
 *   3. Read { storageId } from the JSON response
 *   4. ctx.storage.getUrl(storageId) → public CDN URL
 */

import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});