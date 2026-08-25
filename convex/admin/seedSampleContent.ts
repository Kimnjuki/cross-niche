import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const seedSampleContent = mutation({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 10;
    const now = Date.now();
    
    const sampleArticles = [
      {
        title: "Breaking: Major Security Vulnerability Discovered",
        slug: "major-security-vulnerability-discovered",
        status: "published",
        publishedAt: now,
        contentType: "news" as any,
        summary: "Critical security vulnerability affects millions of devices",
        body: "Full article content here...",
        author: "Security Team",
        isBreaking: true,
        isFeatured: true,
      },
      {
        title: "Next-Gen Gaming Console Performance Analysis",
        slug: "next-gen-gaming-console-performance",
        status: "published", 
        publishedAt: now - (24 * 60 * 60 * 1000),
        contentType: "review" as any,
        summary: "In-depth performance review of latest gaming hardware",
        body: "Full review content here...",
        author: "Gaming Team",
        isFeatured: false,
      },
      {
        title: "Complete Guide to Cloud Security",
        slug: "complete-guide-to-cloud-security",
        status: "published",
        publishedAt: now - (2 * 24 * 60 * 60 * 1000),
        contentType: "guide" as any,
        summary: "Step-by-step guide to securing your cloud infrastructure",
        body: "Full guide content here...",
        author: "Tech Team",
        isFeatured: false,
      },
    ];
    
    let created = 0;
    for (let i = 0; i < Math.min(count, sampleArticles.length); i++) {
      await ctx.db.insert("content", sampleArticles[i] as any);
      created++;
    }
    
    console.log(`Seeded ${created} sample articles`);
    return { created };
  },
});
