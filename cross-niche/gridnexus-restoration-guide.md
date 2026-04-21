# Grid Nexus Platform Restoration Guide

## 🔍 Issue Analysis: Articles Not Appearing

Based on the Convex schema and restoration plan, here are the most likely causes and solutions:

---

## 🚨 Critical Issues Identified

### Issue 1: Content Not Querying Properly
**Problem**: Articles exist in database but aren't being fetched correctly
**Root Cause**: Query filters or status checks may be incorrect

### Issue 2: Status Field Mismatch
**Problem**: Content may have wrong status value
**Root Cause**: Schema expects `status: "published"` but data may have different values

### Issue 3: PublishedAt Field Issues
**Problem**: Articles aren't showing because publishedAt is null or future-dated
**Root Cause**: Content creation/import didn't set publishedAt correctly

### Issue 4: Index Problems
**Problem**: Queries using wrong indexes
**Root Cause**: Code queries by index that doesn't exist or is misconfigured

---

## 🔧 Immediate Fixes Required

### Fix 1: Check Convex Queries

**File to check**: `convex/content.ts` or similar query files

```typescript
// WRONG - This won't work if filtering by wrong status
export const getPublishedContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "draft")) // ❌ WRONG!
      .collect();
  },
});

// CORRECT - Filter by published status and sort by date
export const getPublishedContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(50);
  },
});
```

### Fix 2: Verify Data in Convex Dashboard

**Steps**:
1. Go to your Convex Dashboard
2. Navigate to the `content` table
3. Check if articles exist
4. Verify their `status` field values
5. Check `publishedAt` timestamps

**Expected Data Structure**:
```javascript
{
  _id: "...",
  title: "Article Title",
  slug: "article-slug",
  body: "Article content...",
  status: "published", // ✅ Must be "published"
  publishedAt: 1707782400000, // ✅ Must be a valid timestamp
  featuredImageUrl: "https://...",
  summary: "Article summary",
  // ... other fields
}
```

### Fix 3: Update Status of Existing Articles

**Convex Function to Create** (`convex/admin.ts`):
```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Fix all draft articles to published
export const publishAllDrafts = mutation({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "draft"))
      .collect();

    const now = Date.now();
    
    for (const draft of drafts) {
      await ctx.db.patch(draft._id, {
        status: "published",
        publishedAt: draft.publishedAt || now,
      });
    }

    return { updated: drafts.length };
  },
});

// Fix null publishedAt dates
export const fixPublishedDates = mutation({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    const now = Date.now();
    let fixed = 0;

    for (const item of content) {
      if (!item.publishedAt) {
        await ctx.db.patch(item._id, {
          publishedAt: now - (1000 * 60 * 60 * 24 * fixed), // Stagger dates
        });
        fixed++;
      }
    }

    return { fixed };
  },
});
```

---

## 🎯 Frontend Component Fixes

### Fix 4: Check Your Articles List Component

**Common Issues**:

```typescript
// ❌ WRONG - Not handling loading state
function ArticlesList() {
  const articles = useQuery(api.content.getPublishedContent);
  
  return articles.map(article => (
    <ArticleCard key={article._id} article={article} />
  ));
}

// ✅ CORRECT - Handle all states
function ArticlesList() {
  const articles = useQuery(api.content.getPublishedContent);
  
  if (articles === undefined) {
    return <LoadingSpinner />;
  }
  
  if (!articles || articles.length === 0) {
    return <EmptyState message="No articles found" />;
  }
  
  return (
    <div className="articles-grid">
      {articles.map(article => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}
```

### Fix 5: Check Homepage Data Loading

**File**: `app/page.tsx` or `pages/index.tsx`

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HomePage() {
  // Get latest articles
  const articles = useQuery(api.content.getPublishedContent);
  const featured = useQuery(api.content.getFeaturedContent);
  const breaking = useQuery(api.content.getBreakingNews);

  // Debug logging
  console.log("Articles:", articles?.length || 0);
  console.log("Featured:", featured?.length || 0);
  console.log("Breaking:", breaking?.length || 0);

  return (
    <main>
      <HeroSection breaking={breaking} />
      <FeaturedSection articles={featured} />
      <LatestArticles articles={articles} />
    </main>
  );
}
```

---

## 📊 Complete Convex Functions Set

### Required Query Functions (`convex/content.ts`):

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all published content sorted by date
export const getPublishedContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
  },
});

// Get featured articles
export const getFeaturedContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content")
      .withIndex("by_is_featured", (q) => 
        q.eq("isFeatured", true)
      )
      .order("desc")
      .take(10);
  },
});

// Get breaking news
export const getBreakingNews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content")
      .withIndex("by_is_breaking", (q) => 
        q.eq("isBreaking", true)
      )
      .order("desc")
      .take(5);
  },
});

// Get content by slug
export const getContentBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get content by feed
export const getContentByFeed = query({
  args: { 
    feedSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // First get the feed
    const feed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", args.feedSlug))
      .first();
    
    if (!feed) return [];
    
    // Get content IDs for this feed
    const contentFeeds = await ctx.db
      .query("contentFeeds")
      .withIndex("by_feed", (q) => q.eq("feedId", feed._id))
      .collect();
    
    const contentIds = contentFeeds.map(cf => cf.contentId);
    
    // Get the actual content
    const content = await Promise.all(
      contentIds.map(id => ctx.db.get(id))
    );
    
    // Filter published and sort by date
    return content
      .filter(c => c && c.status === "published" && c.publishedAt)
      .sort((a, b) => (b!.publishedAt || 0) - (a!.publishedAt || 0))
      .slice(0, limit);
  },
});
```

---

## 🔄 Data Migration Script

### Create Sample Content (if database is empty):

```typescript
// convex/seed.ts
import { mutation } from "./_generated/server";

export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Create sample articles
    const articles = [
      {
        title: "Breaking: Major AI Breakthrough Announced",
        slug: "ai-breakthrough-2026",
        body: "# Major AI Breakthrough\n\nResearchers have announced a significant breakthrough...",
        summary: "Researchers announce major AI advancement",
        status: "published",
        publishedAt: now,
        isBreaking: true,
        isFeatured: true,
        featuredImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      },
      {
        title: "Cybersecurity Alert: New Threat Detected",
        slug: "cybersecurity-alert-2026",
        body: "# Cybersecurity Alert\n\nSecurity researchers have identified...",
        summary: "New cybersecurity threat identified",
        status: "published",
        publishedAt: now - 3600000,
        isFeatured: true,
        featuredImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      },
      {
        title: "Gaming Industry Report: 2026 Trends",
        slug: "gaming-trends-2026",
        body: "# Gaming Industry Trends\n\nThe gaming industry continues to evolve...",
        summary: "Analysis of 2026 gaming industry trends",
        status: "published",
        publishedAt: now - 7200000,
        featuredImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      },
    ];
    
    for (const article of articles) {
      await ctx.db.insert("content", article);
    }
    
    return { created: articles.length };
  },
});
```

---

## ✅ Step-by-Step Restoration Process

### Step 1: Verify Database Connection
```bash
# Check if Convex is properly connected
npx convex dev
```

### Step 2: Check Data in Dashboard
1. Open Convex Dashboard
2. Go to `content` table
3. Check if records exist
4. Note the `status` and `publishedAt` values

### Step 3: Run Data Fixes (if needed)
```bash
# In Convex dashboard, run these mutations:
# 1. Fix status fields
# 2. Fix publishedAt dates
# 3. Or seed new content if empty
```

### Step 4: Update Query Functions
- Copy the correct query functions from above
- Deploy to Convex: `npx convex deploy`

### Step 5: Update Frontend Components
- Add proper loading states
- Add error handling
- Add debug logging

### Step 6: Clear Cache & Test
```bash
# Clear Next.js cache
rm -rf .next
npm run build
npm run dev
```

### Step 7: Verify in Browser
1. Open DevTools Console
2. Check for errors
3. Verify data is loading
4. Check Network tab for API calls

---

## 🐛 Debugging Checklist

### Frontend Debugging:
- [ ] Check browser console for errors
- [ ] Verify Convex queries are being called
- [ ] Check if data is undefined vs empty array
- [ ] Verify proper loading states are shown
- [ ] Check if article cards are rendering
- [ ] Inspect React component tree

### Backend Debugging:
- [ ] Verify Convex deployment is active
- [ ] Check if queries are defined in schema
- [ ] Verify indexes are being used correctly
- [ ] Check if data exists in tables
- [ ] Verify field names match schema
- [ ] Check publishedAt timestamps are valid

### Data Debugging:
- [ ] All articles have `status: "published"`
- [ ] All articles have valid `publishedAt` timestamps
- [ ] Slugs are unique and valid
- [ ] Required fields are not null
- [ ] Relationships (tags, feeds) are correct

---

## 🚀 Performance Optimization

### After restoration, optimize:

1. **Add Pagination**:
```typescript
export const getPublishedContentPaginated = query({
  args: { 
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    // Implement cursor-based pagination
  },
});
```

2. **Add Caching**:
```typescript
// Use React Query or SWR for client-side caching
import { useQuery } from '@tanstack/react-query';
```

3. **Optimize Images**:
- Use Next.js Image component
- Implement lazy loading
- Use WebP format

---

## 📝 Next Steps After Restoration

1. **Content Migration**: Import all legacy content
2. **SEO Setup**: Add meta tags and sitemap
3. **Analytics**: Set up tracking
4. **Monitoring**: Add error tracking (Sentry)
5. **Testing**: Add E2E tests
6. **Performance**: Run Lighthouse audit

---

## 🔗 Helpful Resources

- **Convex Docs**: https://docs.convex.dev/
- **Next.js Docs**: https://nextjs.org/docs
- **Debugging Guide**: Check browser DevTools → Console & Network tabs

---

## 💡 Common Gotchas

1. **Status field must be exactly "published"** (case-sensitive)
2. **publishedAt must be a number** (timestamp in milliseconds)
3. **Queries must use correct index names** from schema
4. **Loading states are required** (data is undefined while loading)
5. **Convex requires deployment** after schema/function changes

---

## 🆘 Emergency Contact Checklist

If articles still don't appear after all fixes:

1. Share browser console errors
2. Share Convex dashboard screenshots
3. Share query function code
4. Share component rendering code
5. Share network request responses

---

**This guide should resolve the "articles not appearing" issue. Start with Step 1 and work through systematically.**
