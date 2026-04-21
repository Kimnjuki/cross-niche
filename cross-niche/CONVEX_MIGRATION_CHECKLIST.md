# Supabase → Convex Migration Checklist

**Platform:** thegridnexus.com (live)  
**Goal:** Migrate database from Supabase to Convex without downtime or data loss.

Use this as a step-by-step guideline. Check off each item as you complete it.

---

## Phase 0: Pre-migration (Do not skip)

### 0.1 Backup & verify current state

- [ ] **Export full Supabase data**
  - Supabase Dashboard → Table Editor → each table → Export as CSV, or
  - Use `pg_dump` if you have DB URL:  
    `pg_dump $DATABASE_URL --data-only --inserts -f supabase_backup_YYYYMMDD.sql`
- [ ] **Document row counts** (for post-migration verification)
  - [ ] `content`: _____ rows
  - [ ] `users`: _____ rows
  - [ ] `comments`: _____ rows
  - [ ] `content_niches`: _____ rows
  - [ ] `content_tags`: _____ rows
  - [ ] `content_feeds` / `feeds`: _____ rows (if present)
  - [ ] `user_bookmarks`: _____ rows (if present)
  - [ ] `niches`: _____ rows
  - [ ] `tags`: _____ rows
  - [ ] `media`: _____ rows
  - [ ] `content_tables`: _____ rows
- [ ] **List all env vars** that point to Supabase (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) and keep a copy.
- [ ] **Decide auth strategy** (choose one and note it):
  - **Option A – Keep Supabase Auth only:** Use Convex only for data (content, comments, bookmarks). Auth stays on Supabase; Convex stores `userId` as string (Supabase user id). Simpler, faster migration.
  - **Option B – Migrate auth to Convex Auth:** Replace Supabase Auth with Convex Auth. Requires migrating users and sessions; more work, single backend later.
  - **Recommended for “no impact”:** Option A first; migrate auth later if desired.

---

## Phase 1: Convex project setup

### 1.1 Install and init Convex

- [ ] Install Convex:  
  `npm install convex`
- [ ] Log in (if not already):  
  `npx convex login`
- [ ] Init Convex in the repo (from project root):  
  `npx convex init`
  - This creates `convex/` and adds `convex dev` / `convex deploy` scripts.
- [ ] Add to `package.json` scripts (if not added by init):
  - `"convex:dev": "convex dev"`
  - `"convex:deploy": "convex deploy"`

### 1.2 Create Convex schema

- [ ] Ensure `convex/schema.ts` exists and matches the schema in **Appendix A** (or paste from there).
- [ ] Run `npx convex dev` and confirm schema pushes with no errors.
- [ ] In Convex Dashboard, confirm tables exist: `content`, `users`, `niches`, `tags`, `feeds`, `contentNiches`, `contentTags`, `contentFeeds`, `comments`, `userBookmarks`, `media`, `contentTables`.

### 1.3 Convex env (production URL)

- [ ] In Convex Dashboard → Settings → Environment Variables, add any vars your Convex functions need (e.g. for future server-side calls). None required for basic migration.
- [ ] Note your Convex deployment URL (e.g. `https://xxx.convex.cloud`) for the frontend.

---

## Phase 2: Data migration (Supabase → Convex)

### 2.1 Migration order (respect foreign keys)

Migrate in this order so references exist:

1. **Reference/lookup tables (no FKs to your app data)**
   - [ ] `niches` → Convex `niches`
   - [ ] `tags` → Convex `tags`
   - [ ] `feeds` → Convex `feeds` (if you use feeds)
2. **Users** (content and comments reference users)
   - [ ] `users` → Convex `users`  
   - Store Supabase `id` (UUID) in `userId` or a dedicated `supabaseId` field so you can map from Supabase Auth.
3. **Content**
   - [ ] `content` → Convex `content`  
   - Keep a mapping: Supabase `content.id` (UUID) → Convex `content._id` (and/or store `legacyId: uuid` on Convex content for URL redirects).
4. **Junction / child tables**
   - [ ] `content_niches` → Convex `contentNiches` (use Convex content id + niche id)
   - [ ] `content_tags` → Convex `contentTags`
   - [ ] `content_feeds` → Convex `contentFeeds` (if used)
   - [ ] `media` → Convex `media`
   - [ ] `content_tables` → Convex `contentTables`
5. **User-generated**
   - [ ] `comments` → Convex `comments`
   - [ ] `user_bookmarks` → Convex `userBookmarks`

### 2.2 How to run the migration

- [ ] **Option A – Script (recommended)**  
  Create a one-off Node script (e.g. `scripts/migrate-supabase-to-convex.ts`):
  - Use `@supabase/supabase-js` to read from Supabase (e.g. `supabase.from('content').select('*')`).
  - Use `fetch` to Convex HTTP actions, or Convex client/server `ctx.runMutation(...)` to insert data.
  - Run in order: niches, tags, feeds → users → content (and build id map) → contentNiches, contentTags, contentFeeds, media, contentTables → comments → userBookmarks.
- [ ] **Option B – Convex dashboard**  
  For very small datasets, you can paste JSON into Convex Dashboard → Data and import (manual).
- [ ] **Option C – CSV import**  
  If Convex supports CSV import in Dashboard, export from Supabase as CSV, map columns to Convex schema, then import.

### 2.3 Post-migration data check

- [ ] Compare row counts: Convex table counts vs Phase 0 counts.
- [ ] Spot-check: 5–10 content items; same title, slug, body, published_at.
- [ ] Spot-check: comments and bookmarks for a few users.

---

## Phase 3: Frontend integration (switch from Supabase to Convex)

### 3.1 Wire Convex in the app

- [ ] Wrap app with Convex provider (e.g. in `main.tsx` or `App.tsx`):
  ```ts
  import { ConvexProvider, ConvexReactClient } from "convex/react";
  const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
  // <ConvexProvider client={convex}> ... </ConvexProvider>
  ```
- [ ] Add env var: `VITE_CONVEX_URL` (from Convex Dashboard → URL).

### 3.2 Implement Convex queries/mutations

- [ ] **Content**
  - [ ] Add `convex/content.ts`: queries for list (published), by slug, by feed, trending (see Appendix B for examples).
  - [ ] Replace `usePublishedContent` usage: either keep the hook name and implement it with `useQuery(api.content.list)` or add a thin wrapper around Convex `useQuery`.
  - [ ] Replace `useContentBySlug`, `useContentByFeed`, `useTrendingContent`, `useFeeds`, `useNiches` with Convex equivalents.
- [ ] **Comments**
  - [ ] Add `convex/comments.ts`: list by contentId, add comment, (optional) edit/delete.
  - [ ] Replace Supabase comment reads/writes with Convex in the comments UI.
- [ ] **Bookmarks**
  - [ ] Add `convex/userBookmarks.ts` (or under `users.ts`): get bookmarks for current user, add/remove bookmark.
  - [ ] In `AuthContext` (or wherever you store user), load bookmarks from Convex using the same Supabase user id (if Option A).

### 3.3 Auth (if keeping Supabase Auth – Option A)

- [ ] Keep Supabase Auth for login/signup/session (no change to login UI).
- [ ] When calling Convex mutations that need “current user”, pass the Supabase user id (e.g. from `supabase.auth.getUser()`) as `userId` so Convex can associate bookmarks/comments with that id.
- [ ] Convex does not validate this user; it trusts the client. For production you can later add a Convex HTTP action that validates Supabase JWT and returns userId, then have the client call that first.

### 3.4 Remove or feature-flag Supabase data layer

- [ ] Replace all Supabase content/comment/bookmark calls with Convex in:
  - [ ] `src/hooks/useContent.ts`
  - [ ] `src/contexts/AuthContext.tsx` (bookmarks only if using Convex bookmarks)
  - [ ] `src/lib/insertArticles.ts`
  - [ ] `src/lib/fixExistingContent.ts`, `diagnoseAndFixContent.ts`, `comprehensiveContentFix.ts`, `autoFixAndPublish.ts`
  - [ ] `src/components/admin/ContentEditor.tsx`
  - [ ] `src/pages/Bookmarks.tsx`
  - [ ] Any other file that uses `supabase.from('content')`, `from('comments')`, `from('user_bookmarks')`, etc.
- [ ] Keep Supabase client only for auth (if Option A): `supabase.auth.getSession()`, `signIn`, `signUp`, etc.
- [ ] Add a single “data source” flag if you want: e.g. `USE_CONVEX = true` so you can switch back to Supabase during testing (optional).

### 3.5 URL and slug handling

- [ ] Article URLs: keep `/article/:idOrSlug`. If you use Convex `_id`, either:
  - Use slug in URL and resolve slug → document in Convex (recommended), or
  - Store `legacyId` (Supabase uuid) and redirect `/article/<uuid>` → `/article/<slug>` once.
- [ ] Sitemap: ensure sitemap generator uses the same URLs (slug or legacy id) that your app uses.

---

## Phase 4: Testing and cutover

### 4.1 Local / staging

- [ ] Run app locally with `VITE_CONVEX_URL` pointing to your Convex dev deployment.
- [ ] Verify: homepage loads, article list and by-slug load, feed filters work.
- [ ] Verify: comments load and submit.
- [ ] Verify: bookmarks add/remove and persist for logged-in user.
- [ ] Verify: admin/content editor (if used) can load and save content via Convex.
- [ ] Verify: no Supabase errors in console for content/comments/bookmarks (only auth calls may remain).

### 4.2 Production cutover

- [ ] Deploy Convex production: `npx convex deploy --prod` (or your prod workflow).
- [ ] Run data migration **once** against production Supabase → production Convex (or do this before cutover and then only sync new rows if any).
- [ ] Set production env: `VITE_CONVEX_URL` = production Convex URL.
- [ ] Deploy frontend (Vite build) with Convex URL.
- [ ] Smoke test on thegridnexus.com: homepage, 2–3 articles, one comment, bookmarks.
- [ ] Monitor Convex Dashboard for errors and latency.

### 4.3 Rollback plan (if something goes wrong)

- [ ] Keep Supabase project and data intact for at least 1–2 weeks.
- [ ] To rollback: set `USE_CONVEX = false` (if you added the flag) or revert the frontend to the previous build that still used Supabase for data; redeploy. No DB rollback needed on Supabase if you didn’t delete data.

---

## Phase 5: Cleanup (after 1–2 weeks stable)

- [ ] Remove Supabase data layer code (all `supabase.from(...)` except auth).
- [ ] Optionally migrate auth to Convex Auth (or Clerk) and then remove Supabase entirely.
- [ ] Remove Supabase env vars except those still used for auth (if any).
- [ ] Update docs (README, runbooks) to state “Database: Convex”.

---

## Appendix A: Convex schema (`convex/schema.ts`)

The file `convex/schema.ts` in this repo defines tables equivalent to your Supabase schema:

| Convex table       | Supabase table     | Notes |
|--------------------|--------------------|--------|
| **niches**         | niches             | `idNum` = Supabase smallint id (1, 2, 3). Index `by_id_num`. |
| **tags**           | tags               | Convex `_id` used; contentTags.tagId = `v.id("tags")`. |
| **feeds**          | feeds              | Convex `_id` used; contentFeeds.feedId = `v.id("feeds")`. Build feed id map during migration. |
| **users**          | users              | Optional. `supabaseUserId` stores auth.users.id. |
| **content**        | content            | `authorId` = string (Supabase user UUID). `publishedAt` = number (ms). `legacyId` = Supabase content UUID for redirects. |
| **contentNiches**  | content_niches     | `contentId` = `v.id("content")`, `nicheId` = number (matches niches.idNum). |
| **contentTags**    | content_tags       | `contentId`, `tagId` = Convex ids. Map tag id during migration. |
| **contentFeeds**   | content_feeds      | `contentId`, `feedId` = Convex ids. Map feed id during migration. |
| **comments**       | comments           | `userId` = string (Supabase user id), `contentId` = `v.id("content")`. |
| **userBookmarks**  | user_bookmarks     | `userId` = string (Supabase user id), `contentId` = `v.id("content")`. |
| **media**          | media              | `contentId` = `v.id("content")`. |
| **contentTables**  | content_tables     | `contentId` = `v.id("content")`, `tableData` = JSON. |

**Migration id mapping:** When migrating, build maps: Supabase `content.id` (UUID) → Convex `content._id`; Supabase `tags.id` (int) → Convex `tags._id`; Supabase `feeds.id` (int) → Convex `feeds._id`. Then insert contentNiches, contentTags, contentFeeds, comments, userBookmarks, media, contentTables using those Convex ids.

---

## Appendix B: Example Convex queries (stubs)

- **List published content:**  
  `query("content:list", { limit })` → filter `status === "published"`, order by `publishedAt` desc.
- **By slug:**  
  `query("content:getBySlug", { slug })` → single doc.
- **By feed:**  
  Use `contentFeeds` + `content` (join in query or two-step).
- **Comments for article:**  
  `query("comments:listByContent", { contentId })`.
- **Bookmarks for user:**  
  `query("userBookmarks:list", { userId })`.

Implement these in `convex/content.ts`, `convex/comments.ts`, `convex/userBookmarks.ts` and call them from your hooks.

---

## Quick reference – files to touch

| Area            | Files |
|-----------------|--------|
| Schema          | `convex/schema.ts` |
| Queries/Mutations | `convex/content.ts`, `convex/comments.ts`, `convex/userBookmarks.ts`, `convex/feeds.ts`, `convex/niches.ts` |
| App provider    | `src/main.tsx` or `src/App.tsx` |
| Content hooks    | `src/hooks/useContent.ts` |
| Auth + bookmarks | `src/contexts/AuthContext.tsx` |
| Comments UI      | Component(s) that render/post comments |
| Admin / insert   | `src/lib/insertArticles.ts`, `src/lib/fixExistingContent.ts`, etc. |
| Bookmarks page   | `src/pages/Bookmarks.tsx` |
| Env              | `.env` / `.env.production`: `VITE_CONVEX_URL` |

---

**End of checklist.** Proceed in order; do not skip Phase 0 backup and Phase 4 testing before production cutover.
