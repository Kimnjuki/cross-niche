// One-time mutation to remove "same image for every article" repetition
// by re-assigning featuredImageUrl deterministically from themed pools.
//
// Run via:
//   npx convex run diversifyFeaturedImages:diversifyFeaturedImages
//
// Note: This targets only rows that still use known repeated defaults.

import { mutation } from "./_generated/server";

function hashToIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % Math.max(1, length);
}

function pickDeterministicImage(images: string[], seed: string | undefined): string {
  if (images.length === 0) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop";
  }
  const safeSeed = seed ?? "";
  if (!safeSeed) return images[0];
  return images[hashToIndex(safeSeed, images.length)];
}

const REPEATED_TECH_PHOTO_ID = "photo-1518770660439-4636190af475";
const REPEATED_SECURITY_PHOTO_ID = "photo-1550751827-4bd374c3f58b";
const REPEATED_GAMING_PHOTO_ID = "photo-1552820728-8b83bb6b773f";

const TECH_POOL_NO_DEFAULT: string[] = [
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1606147870837-bfcbcd909acd?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=2000&auto=format&fit=crop",
];

const SECURITY_POOL_NO_DEFAULT: string[] = [
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1569025591-a3c16d4c5f5f?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
];

const GAMING_POOL_NO_DEFAULT: string[] = [
  "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=630&fit=crop",
];

function poolForContentType(contentType: unknown): string[] {
  const ct = (contentType ?? "").toString().toLowerCase();
  if (ct === "security" || ct === "cybersecurity") return SECURITY_POOL_NO_DEFAULT;
  if (ct === "gaming" || ct === "games") return GAMING_POOL_NO_DEFAULT;
  return TECH_POOL_NO_DEFAULT;
}

export const diversifyFeaturedImages = mutation({
  args: {},
  handler: async (ctx) => {
    // Only touch recent content; feed pages pull from the newest subset anyway.
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(300);

    let patched = 0;
    const touched: Array<{ slug: string; from: string; to: string }> = [];

    for (const doc of docs) {
      if (doc.isDeleted === true) continue;
      if (!doc.featuredImageUrl) continue;

      const featured = doc.featuredImageUrl as string;
      const isRepeatedTech = featured.includes(REPEATED_TECH_PHOTO_ID);
      const isRepeatedSecurity = featured.includes(REPEATED_SECURITY_PHOTO_ID);
      const isRepeatedGaming = featured.includes(REPEATED_GAMING_PHOTO_ID);

      if (!isRepeatedTech && !isRepeatedSecurity && !isRepeatedGaming) continue;

      const pool = poolForContentType(doc.contentType);
      const next = pickDeterministicImage(pool, doc.slug ?? String(doc._id));

      if (next && next !== featured) {
        await ctx.db.patch(doc._id, { featuredImageUrl: next });
        patched++;
        touched.push({ slug: doc.slug ?? String(doc._id), from: featured, to: next });
      }
    }

    return { patched, touchedCount: touched.length, touched };
  },
});

