# Article Page Fixes – Technical Analysis Report Alignment

**Report date:** January 30, 2026  
**Site:** https://thegridnexus.com  
**Backend:** Convex | **Deploy:** Coolify (Docker + Nginx)

This doc maps the Technical Analysis & Debugging Report (Jan 30, 2026) recommendations to the codebase so the article page never crashes on undefined `article.id`.

---

## Critical fix: never access `article.id` before data is ready

### Report: “Add null/undefined checks before accessing article.id”

**Implemented in:** `src/pages/Article.tsx`

1. **Loading** – Convex query still in flight:
   - `if (isLoading) return <ArticleSkeleton />;`
   - No use of `article` until loading is false.

2. **Not found** – Query returned null or slug/id not in DB or mock:
   - `if (article === undefined || article === null) return <ArticleNotFound />;`
   - “Article Not Found” + “Go Home” link.

3. **Safe path** – Only after both checks do we use `article.niche`, `article.id`, etc.

### Report: “Implement loading states for all Convex queries”

- **Article page:** `useContentBySlug(id)` → `isLoading` → `<ArticleSkeleton />`.
- **Content hooks:** `useContent.ts` returns `{ data, isLoading }`; demo mode returns mock data without waiting.
- **Convex content.ts:** `listPublished`, `getBySlug`, `listByFeedSlug`, `listTrending` wrapped in try/catch and return `[]` or `null` on error so the client never throws.

### Report: “Add error boundary around article components”

- **Global:** `src/components/ErrorBoundary.tsx` wraps the app in `main.tsx`.
- **Convex errors:** When the error message includes `CONVEX`, the fallback UI shows a “Load with demo data” button so the site can run without Convex.

---

## Data layer: defensive mappers and Convex

### Report: “Convex query returns null instead of undefined for not found”

- **Convex:** `convex/content.ts` – `getBySlug` returns `null` on error or not found; handlers use try/catch and return `[]` or `null`.
- **Frontend:** `mapContentToArticle(content)` returns `Article | null` when `content` is falsy; `mapContentToArticles` filters out nulls so callers always get `Article[]` or explicit null handling.

### Report: “Ensure proper index in Convex schema”

- **Schema:** `convex/schema.ts` – `content` table has `by_slug` and `by_status_published_at`; no change needed for the article crash fix.

---

## Code checklist (from report)

| Item | Status | Location |
|------|--------|----------|
| All `useQuery` calls have loading state checks | Yes | Article: `isLoading` → skeleton; hooks return `isLoading` |
| All `useQuery` calls have null/not-found checks | Yes | Article: `!article` → not found; hooks use mock when Convex disabled |
| Error boundaries wrap main components | Yes | `ErrorBoundary` in `main.tsx`; Convex fallback UI |
| Convex schema has proper indexes | Yes | `convex/schema.ts` – `by_slug`, `by_status_published_at` |
| Article routes pass correct parameter types | Yes | Route `/article/:id`; `useContentBySlug(id \|\| '')`; slug or id both resolved |
| 404 page for missing articles | Yes | “Article Not Found” + Go Home in `Article.tsx` |
| Loading spinners/skeletons | Yes | `ArticleSkeleton.tsx` used when `isLoading` |
| User-friendly error messages | Yes | ErrorBoundary + “Load with demo data” for Convex errors |

---

## Debugging (report Step 3)

- **Dev-only log:** In `Article.tsx`, when `import.meta.env.DEV` is true, we log `{ slugOrId: id, hasArticle: !!article, articleId: article?.id }` so you can confirm the param and that `article` is set before any use.
- **Error details in production:** Add `?error=1` to the URL and reload to see the error message in the ErrorBoundary fallback.

---

## Quick reference: article data flow

1. **URL:** `/article/:id` (id can be slug or Convex id).
2. **Data:** `useContentBySlug(id)` → Convex `getBySlug` or mock lookup by `(a.slug \|\| a.id) === id`.
3. **Fallback:** If Convex returns null and not loading, we use `mockArticles.find(a => (a.slug \|\| a.id) === id)`.
4. **Render:** Only after `!isLoading` and `article != null` do we render content that uses `article.id` or any `article.*`.

---

## Files touched for this fix

- `src/pages/Article.tsx` – Loading/not-found gate, ArticleSkeleton, dev log.
- `src/components/articles/ArticleSkeleton.tsx` – New skeleton for article page.
- `src/lib/contentMapper.ts` – `mapContentToArticle` / `mapContentToArticles` / `articleToContentItem` defensive (null in → null or filtered array out).
- `src/hooks/useUserBehavior.ts` – `useReadingTracker(article)` accepts `undefined` and no-ops.
- `src/components/nexus/NexusScrollBridge.tsx` – CrossSectionRecommendation guards `recommended` and `recommended.id`/`slug`.
- `convex/content.ts` – try/catch in listPublished, getBySlug, listByFeedSlug, listTrending; attachFeedAndNiches returns null on error.
