# 🚀 Grid Nexus Quick Restoration Checklist

## ⚡ **IMMEDIATE ACTION ITEMS**

### ✅ **Step 1: Verify Convex Database** (5 minutes)

**Action**: Open your Convex Dashboard
- Go to: https://dashboard.convex.dev
- Select your Grid Nexus project
- Click on "Data" → "content" table

**What to Check**:
```
[ ] How many records are in the content table?
[ ] What values are in the "status" column?
[ ] Are there "publishedAt" timestamps?
[ ] Do articles have titles and bodies?
```

**Expected**: 
- Status should be: `"published"` (not `"draft"` or anything else)
- publishedAt should be: `1707782400000` (a timestamp number)

---

### ✅ **Step 2: Check Article Status** (2 minutes)

**If articles have status = "draft"**:

1. Go to Convex Dashboard → Functions
2. Run this mutation:
```javascript
api.admin.publishAllDrafts()
```

**If articles are missing publishedAt dates**:

1. In Convex Dashboard → Functions
2. Run this mutation:
```javascript
api.admin.fixPublishedDates()
```

---

### ✅ **Step 3: Verify Frontend is Querying Data** (5 minutes)

**Action**: Open your website in browser
- Press F12 to open DevTools
- Go to Console tab
- Look for errors

**Common Errors & Fixes**:

❌ **Error**: `useQuery is not a function`
✅ **Fix**: Check ConvexProvider is wrapping your app

❌ **Error**: `api.content.getPublishedContent is not a function`
✅ **Fix**: Deploy new Convex functions with `npx convex deploy`

❌ **Error**: `Cannot read property 'map' of undefined`
✅ **Fix**: Add loading state check in component

---

### ✅ **Step 4: Check Homepage Component** (3 minutes)

**Your homepage should look like this**:

```typescript
// app/page.tsx or pages/index.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HomePage() {
  const articles = useQuery(api.content.getPublishedContent);
  
  // ✅ MUST HAVE: Loading state
  if (articles === undefined) {
    return <div>Loading...</div>;
  }
  
  // ✅ MUST HAVE: Empty state
  if (!articles || articles.length === 0) {
    return <div>No articles found</div>;
  }
  
  // ✅ MUST HAVE: Render articles
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}
```

---

### ✅ **Step 5: Deploy Updated Functions** (2 minutes)

**Action**: Deploy the new Convex functions

```bash
# Copy the files
cp convex-content-queries.ts ./convex/content.ts
cp convex-admin-mutations.ts ./convex/admin.ts

# Deploy to Convex
npx convex deploy
```

---

## 🔧 **COMMON ISSUES & SOLUTIONS**

### Issue #1: "No articles showing on homepage"

**Root Causes**:
- ❌ Articles have status = "draft"
- ❌ Articles missing publishedAt
- ❌ Frontend not querying data
- ❌ Query using wrong index

**Solution**:
```javascript
// In Convex Dashboard, run:
api.admin.publishAllDrafts()
api.admin.fixPublishedDates()

// Then refresh your website
```

---

### Issue #2: "Loading spinner shows forever"

**Root Causes**:
- ❌ Convex not connected
- ❌ Wrong API endpoint
- ❌ Query function not deployed

**Solution**:
```bash
# Check Convex connection
npx convex dev

# Deploy functions
npx convex deploy

# Check environment variables
# Make sure .env.local has:
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

---

### Issue #3: "Error in browser console"

**Check these**:
```
[ ] Is ConvexProvider in _app.tsx or layout.tsx?
[ ] Is NEXT_PUBLIC_CONVEX_URL set correctly?
[ ] Did you run 'npx convex deploy'?
[ ] Are functions named correctly in convex/_generated/api?
```

---

### Issue #4: "Database is empty"

**Solution**: Create sample content

```javascript
// In Convex Dashboard → Functions, run:
api.admin.seedSampleContent({ count: 10 })

// This creates 10 sample articles for testing
```

---

## 📊 **VERIFICATION CHECKLIST**

After each fix, verify:

```
[ ] Convex Dashboard shows articles in content table
[ ] Articles have status = "published"
[ ] Articles have publishedAt timestamps
[ ] Browser console shows no errors
[ ] Articles appear on homepage
[ ] Article pages load correctly
```

---

## 🎯 **QUICK COMMANDS REFERENCE**

```bash
# Start Convex development server
npx convex dev

# Deploy Convex functions
npx convex deploy

# Open Convex dashboard
npx convex dashboard

# Install dependencies
npm install convex

# Initialize Convex (if needed)
npx convex init

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 🔍 **DEBUGGING IN BROWSER**

### Chrome/Edge DevTools (F12):

**Console Tab**: Look for errors
```javascript
// Add this to your component to debug:
console.log("Articles:", articles);
console.log("Articles length:", articles?.length);
```

**Network Tab**: Check API calls
```
1. Refresh page
2. Look for convex.cloud requests
3. Check if they return 200 status
4. Look at response data
```

**React DevTools**: Check component state
```
1. Install React DevTools extension
2. Find your HomePage component
3. Check the hooks
4. Verify useQuery is returning data
```

---

## 📝 **DATA STRUCTURE VERIFICATION**

Your articles should look like this in Convex:

```javascript
{
  _id: "j97h2x4...",
  _creationTime: 1707782400000,
  
  // Required fields
  title: "Article Title",
  slug: "article-title",
  body: "Article content...",
  status: "published",           // ⚠️ MUST BE "published"
  publishedAt: 1707782400000,    // ⚠️ MUST BE A NUMBER
  
  // Optional but recommended
  summary: "Article summary",
  featuredImageUrl: "https://...",
  authorId: "user_123",
  
  // Flags
  isFeatured: false,
  isBreaking: false,
  isPremium: false,
  
  // Metadata
  viewCount: 0,
  wordCount: 500,
  estimatedReadingTimeMinutes: 3
}
```

---

## 🎨 **FRONTEND COMPONENT TEMPLATE**

Copy this template for your homepage:

```typescript
// app/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HomePage() {
  // Fetch data
  const articles = useQuery(api.content.getPublishedContent, { limit: 20 });
  const featured = useQuery(api.content.getFeaturedContent, { limit: 5 });
  const breaking = useQuery(api.content.getBreakingNews, { limit: 3 });
  
  // Loading state
  if (articles === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Empty state
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
        <p className="text-gray-600">Check the Convex dashboard to add content</p>
      </div>
    );
  }
  
  // Success state
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breaking News */}
      {breaking && breaking.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Breaking News</h2>
          <div className="grid gap-4">
            {breaking.map(article => (
              <ArticleCard key={article._id} article={article} variant="breaking" />
            ))}
          </div>
        </section>
      )}
      
      {/* Featured Articles */}
      {featured && featured.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(article => (
              <ArticleCard key={article._id} article={article} variant="featured" />
            ))}
          </div>
        </section>
      )}
      
      {/* Latest Articles */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}

// Simple ArticleCard component
function ArticleCard({ article, variant = "default" }) {
  return (
    <a href={`/articles/${article.slug}`} className="block">
      <article className="border rounded-lg p-4 hover:shadow-lg transition">
        {article.featuredImageUrl && (
          <img 
            src={article.featuredImageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}
        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-2">{article.summary}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
          <span>{article.estimatedReadingTimeMinutes} min read</span>
        </div>
      </article>
    </a>
  );
}
```

---

## ✅ **SUCCESS INDICATORS**

You'll know it's working when:

```
✓ Convex Dashboard shows published articles
✓ Browser console has no errors
✓ Articles appear on homepage
✓ Clicking articles shows full content
✓ All images load correctly
✓ Navigation works smoothly
```

---

## 🆘 **STILL NOT WORKING?**

If you've tried everything above:

1. **Share these with support**:
   - Screenshot of Convex Dashboard (content table)
   - Browser console errors
   - Your homepage component code
   - Network tab showing API requests

2. **Emergency Reset**:
   ```bash
   # Nuclear option - start fresh
   rm -rf .next
   rm -rf node_modules
   npm install
   npx convex deploy
   npm run dev
   ```

3. **Create test content**:
   ```javascript
   // In Convex Dashboard, run:
   api.admin.seedSampleContent({ count: 10 })
   ```

---

**Remember**: The most common issue is articles having `status: "draft"` instead of `status: "published"`. Fix this first!

**Quick Fix**: Run `api.admin.publishAllDrafts()` in Convex Dashboard → Functions
