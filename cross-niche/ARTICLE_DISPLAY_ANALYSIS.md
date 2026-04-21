# Article Display & Homepage Content – In-Depth Analysis

This document explains how articles are loaded and rendered, and why newly added Convex content may not appear on the homepage or article page.

**Structured troubleshooting:** For a checklist-style guide (common issues, deployment steps, quick fixes), see **`CONVEX_ARTICLE_TROUBLESHOOTING.json`** in this repo.

---

## 1. Data flow overview

```
Convex DB (content, contentFeeds, contentNiches, feeds, niches)
    ↓
convex/content.ts (listPublished, listByFeedSlug, getBySlug)
    ↓
useContent hooks (usePublishedContent, useContentByFeed, useContentBySlug)
    ↓
SafeConvexProvider: if VITE_CONVEX_URL not set → Convex "disabled" → mock data only
    ↓
Index.tsx / Article.tsx (mapContentToArticles, mapContentToArticle)
    ↓
UI (MasterBentoHero, ArticleCard, article page)
```

---

## 2. When Convex is "disabled" – you only see mock data

**Where it’s decided:** `src/components/SafeConvexProvider.tsx`

- `disabled = true` when:
  - `VITE_CONVEX_URL` is not set or empty at **build time**, or
  - User has `?convex_fallback=1` or `sessionStorage.convexFallback = 1`.
- When **disabled**, **all** `useContent` hooks return **mock data** from `src/data/mockData.ts`:
  - `usePublishedContent` → mock articles (no Convex query).
  - `useContentByFeed('play')` → mock filtered by niche.
  - `useContentBySlug(slug)` → mock by slug/id.

So if Convex is disabled, **no Convex-inserted article will ever show**; only mock articles will.

**Fix:** Set `VITE_CONVEX_URL` as a **Build Time Variable** in Coolify (e.g. `https://canny-mule-83.convex.cloud`) and redeploy so the built app has the URL. For local dev, set it in `.env` or `.env.local`.

---

## 3. Homepage logic – when do Convex articles show?

**Where:** `src/pages/Index.tsx`

- `usePublishedContent(24)` → calls `api.content.listPublished({ limit: 24 })` when Convex is **enabled**.
- `hasConvexData = published && published.length > 0`.
- `useFallback = timedOut && !hasConvexData` (after 2.5s).
- **Articles used on the page:**
  - If `hasConvexData && !useFallback` → `articles = mapContentToArticles(published)` (Convex data).
  - Otherwise → `articles = mockArticles` (fallback).

So Convex articles show only when:

1. Convex is **not** disabled (see §2).
2. `api.content.listPublished` is **deployed** on the same Convex deployment the frontend uses.
3. The Convex DB has at least one **published** document in the `content` table.

If any of these fail, you get either mock data (or empty then mock after timeout).

---

## 4. Why "newly added" Convex content might not show

| Cause | What happens | What to do |
|-------|----------------|------------|
| **Convex disabled** | No Convex URL at build time → all hooks use mock data. | Set `VITE_CONVEX_URL` at build (Coolify / .env) and redeploy. |
| **content.ts not deployed** | Backend has no `content.listPublished` / `getBySlug` / `listByFeedSlug`. Frontend gets no data or errors. | Run `npx convex deploy` (and answer `y` to push to prod) so `convex/content.ts` is on the deployment your app uses. |
| **Mutation run on different deployment** | You ran `insertFeaturedArticle` on dev (e.g. intent-akita-728) but the site uses prod (canny-mule-83). | Run the mutation on the **same** deployment the site uses: Convex Dashboard → correct project/deployment → Functions → `insertFeaturedArticle` → Run. Or `npx convex run insertFeaturedArticle:insertFeaturedArticle '{}'` after selecting that deployment. |
| **Empty feeds/niches** | Article is in `content` but not in `contentFeeds` or `contentNiches`, or feeds/niches tables are empty. | Ensure `insertFeaturedArticle` creates/links the "play" feed and contentNiches (Gaming=3, Tech=1). Seed feeds/niches if needed. |
| **listPublished index / publishedAt** | Content is draft or has no `publishedAt`. | Use `status: "published"` and `publishedAt: Date.now()` (or a number in ms) when inserting. |
| **Article page 404** | URL is `/article/:id`; backend fetches by **slug** via `getBySlug(slug)`. | Link using **slug**: `/article/peak-viewers-arm-ambitions-vr-reality-check-2026`. If you use Convex `_id`, getBySlug won’t find it; use slug in links. |

---

## 5. Article page – how a single article is loaded

**Where:** `src/pages/Article.tsx`

- Route param: `id` from `/article/:id` (used as **slug** in the hook).
- `useContentBySlug(id || '')` → when Convex enabled: `api.content.getBySlug({ slug: id })`.
- Convex `getBySlug` in `convex/content.ts`: queries by **slug**, filters by `status === "published"`.
- So the URL **must** use the article’s **slug** (e.g. `peak-viewers-arm-ambitions-vr-reality-check-2026`), not the Convex `_id`, or the article won’t be found.

**Links:** `articleLink(article)` in Index and elsewhere uses `article.slug || article.id`. Convex content returns `slug` from the DB, so as long as you don’t overwrite that with `id` elsewhere, links will use slug and the article page will load.

---

## 6. Gaming section and "play" feed

- Homepage gaming block uses `useContentByFeed('play', 5)` → `api.content.listByFeedSlug({ feedSlug: 'play', limit: 5 })`.
- That query:
  - Finds the feed with `slug === 'play'`.
  - Loads `contentFeeds` for that feed.
  - Returns those content items (with `status === 'published'`).
- So the new article appears in the Gaming section only if:
  - There is a feed with slug `play`.
  - There is a row in `contentFeeds` linking that feed to the article’s `contentId`.

`convex/insertFeaturedArticle.ts` creates the "play" feed if missing and inserts into `contentFeeds`; run it on the **same** deployment the site uses.

---

## 7. Checklist – get Convex articles on the homepage

1. **Build has Convex URL**  
   Coolify (or your build): Build Time Variable `VITE_CONVEX_URL` = `https://<your-deployment>.convex.cloud`. Redeploy so the built JS contains this URL.

2. **Content and mutation are deployed**  
   Same Convex project/deployment the site uses (e.g. prod):
   - `npx convex deploy` and confirm push.
   - Ensure "Available functions" in dashboard or CLI includes `content:listPublished`, `content:getBySlug`, `content:listByFeedSlug`, and `insertFeaturedArticle:insertFeaturedArticle`.

3. **Mutation has been run on that deployment**  
   Convex Dashboard → Functions → `insertFeaturedArticle` → Run (no args). Or CLI: `npx convex run insertFeaturedArticle:insertFeaturedArticle '{}'` (with the correct deployment selected).

4. **No "Demo mode" banner**  
   If you see "Demo mode: showing sample data" at the top, Convex is disabled for that build; fix step 1.

5. **Optional: content diagnostics**  
   Add `?debug=content` on the homepage to see a small diagnostic (Convex URL, disabled?, published count). Use this to confirm Convex is connected and listPublished returns data.

---

## 8. Quick reference – important files

| File | Role |
|------|------|
| `src/components/SafeConvexProvider.tsx` | Sets Convex disabled when no URL / fallback; all hooks respect this. |
| `src/hooks/useContent.ts` | usePublishedContent, useContentByFeed, useContentBySlug; when disabled, return mock data. |
| `src/pages/Index.tsx` | Homepage: uses published + fallback logic; top story and gaming from Convex when hasConvexData. |
| `src/pages/Article.tsx` | Article page: useContentBySlug(id) — id must be the article **slug**. |
| `src/lib/contentMapper.ts` | Convex ContentItem → Article (niches, feed_slug, slug, etc.). |
| `convex/content.ts` | listPublished, listByFeedSlug, getBySlug; must be deployed. |
| `convex/insertFeaturedArticle.ts` | Inserts featured article + play feed + contentNiches; run once per deployment. |
