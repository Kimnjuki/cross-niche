# Deployment Checklist – Changes Not Reflected / Articles Not Appearing

Use this checklist when:
- Code changes don't appear on the live site
- Articles added yesterday (or recently) don't show on the homepage
- Environment variables may be misconfigured

---

## 1. Repository & Git Sync

| # | Check | How to verify | Fix if failed |
|---|-------|---------------|---------------|
| 1.1 | **Correct remote** | `git remote -v` | Should show `https://github.com/Kimnjuki/cross-niche.git` |
| 1.2 | **Changes committed** | `git status` | No uncommitted changes for deployable files |
| 1.3 | **Changes pushed** | `git log origin/master -1` vs `git log -1` | Local HEAD = remote HEAD |
| 1.4 | **Coolify uses same repo** | Coolify → Source → Repository | Must be `Kimnjuki/cross-niche` (or your fork) |

**Action:** If you have uncommitted changes:
```bash
git add .
git commit -m "Your descriptive message"
git push origin master
```

---

## 2. Coolify Build & Deploy

| # | Check | How to verify | Fix if failed |
|---|-------|---------------|---------------|
| 2.1 | **Commit SHA matches** | Coolify deployment log vs GitHub Commits | Coolify log shows same SHA as latest GitHub commit |
| 2.2 | **Build not skipped** | Deployment log | Should NOT say "Build step skipped" |
| 2.3 | **Force rebuild** | Coolify → Deployments → Force Rebuild | Use after pushing new code |
| 2.4 | **Browser cache** | Hard refresh: `Ctrl+F5` or Incognito | Old cached JS may still show |

**Action:** In Coolify → Source → **Update to latest commit** → Deployments → **Force Rebuild** (or Deploy without cache).

---

## 3. Environment Variables

### 3.1 Frontend Build (Coolify Build Time Variables)

| Key | Required | Example | Where |
|-----|----------|---------|-------|
| `VITE_CONVEX_URL` | **Yes** | `https://intent-akita-728.convex.cloud` | Coolify → Build Time Variables |

**Critical:** Must match the Convex deployment the site should use. Get it from [Convex Dashboard](https://dashboard.convex.dev) → your project → Settings → **Deployment URL**.

**Wrong:** `VITE_CONVEX_URL==https://...` (double equals)  
**Correct:** Key `VITE_CONVEX_URL`, value `https://....convex.cloud`

### 3.2 Convex Backend (Convex Dashboard)

| Key | Used by | Where |
|-----|---------|-------|
| `NEWSAPI_API_KEY` | newsIngestor (content table) | Convex → Settings → Environment Variables |
| `NEWS_API_KEY` or `NEWSAPI_API_KEY` | ingest (articles table) | Convex → Settings → Environment Variables |
| `GNEWS_API_KEY` | ingest (articles table) | Convex → Settings → Environment Variables |

**Note:** `.env.example` has `NEWS_API_KEY` and `GNEWS_API_KEY` for local dev. For production, they must be set in **Convex Dashboard**, not in Coolify.

### 3.3 Deployment URL Consistency

| Location | Current value | Must match |
|---------|---------------|------------|
| `.env.example` | `intent-akita-728.convex.cloud` | Coolify `VITE_CONVEX_URL` |
| Convex Dashboard | Your deployment (e.g. intent-akita-728) | Same as above |

**If you have multiple Convex deployments (dev vs prod):** Ensure Coolify uses the deployment where you add content and run migrations.

---

## 4. Why Articles Don't Appear on Homepage

### 4.1 Two Different Data Sources

The homepage uses **two** content sources:

| Section | Data source | Table | Ingestion |
|---------|-------------|-------|-----------|
| **Main feed** (Breaking News, Latest, Latest by category, etc.) | `content.listPublished` | `content` | `newsIngestor` → `content.upsertIngestedContent` |
| **Live Wire** | `articles.getLatestFeed` + `content.listIngestedNews` | `articles` + `content` | `ingest` → `articles.saveArticle` + `newsIngestor` |

**Articles added via `ingest.runIngestionPublic`** go to the **`articles`** table only. They appear in **Live Wire** only, not in the main feed (Breaking News, Latest, etc.).

**Articles added via `newsIngestor.runNewsIngestion`** go to the **`content`** table with `status: "published"`. They appear in the **main feed** and in Live Wire (via `listIngestedNews`).

### 4.2 Checklist: Articles in Main Feed

| # | Check | Fix |
|---|-------|-----|
| 4.1 | Convex deployed | Run `npx convex deploy` (select production when prompted) |
| 4.2 | `VITE_CONVEX_URL` set in Coolify | Add as Build Time Variable, redeploy |
| 4.3 | No demo mode banner | If you see "Demo mode: showing sample data", Convex URL is missing at build |
| 4.4 | Content in correct deployment | Run mutations/ingestion on the **same** deployment as `VITE_CONVEX_URL` |
| 4.5 | Content has `status: "published"` or `"new"` | Check Convex Data → content table |
| 4.6 | Content has `publishedAt` (number, ms) | Required for sorting by date |
| 4.7 | Run news ingestion | Convex Dashboard → Functions → `newsIngestor` → `runNewsIngestion` → Run |

### 4.3 Quick Diagnostic

Add `?debug=content` to the homepage URL. You should see:
- `Convex disabled: false`
- `published: <number>` (count of published articles)

If `disabled: true` or `published: 0`, follow sections 3 and 4.2.

---

## 5. Convex Functions Deployed

| Function | Purpose |
|----------|---------|
| `content.listPublished` | Main feed articles |
| `content.getBySlug` | Single article page |
| `content.listByFeedSlug` | Tech/Security/Gaming sections |
| `content.listIngestedNews` | Live Wire (content table) |
| `articles.getLatestFeed` | Live Wire (articles table) |

**Action:** Run `npx convex deploy` and confirm in Convex Dashboard → Functions that these exist.

---

## 6. Summary: "Articles Added Yesterday Not Showing"

1. **Deployment mismatch** – Content added to Convex deployment A, but Coolify uses deployment B. Fix: Use same deployment everywhere.
2. **Wrong table** – Ingest uses `articles` table; main feed uses `content` table. Fix: Run `newsIngestor.runNewsIngestion` for main feed content.
3. **Convex not connected** – `VITE_CONVEX_URL` not set in Coolify. Fix: Add Build Time Variable, Force Rebuild.
4. **Code not deployed** – Changes only in Cursor, not pushed to GitHub. Fix: Commit, push, Force Rebuild in Coolify.
5. **Build skipped** – Coolify reused old build. Fix: Force Rebuild.

---

## 7. Pipeline / Terminal Commands (VITE_CONVEX_URL)

| Command | Purpose |
|---------|---------|
| `npm run dev:convex` | Local dev with `VITE_CONVEX_URL=https://intent-akita-728.convex.cloud` |
| `npm run build:convex` | Production build with Convex URL set |
| Coolify Build Time Variable | Set `VITE_CONVEX_URL` = `https://intent-akita-728.convex.cloud` |

---

## 8. Recommended Order of Operations

1. Commit and push all changes to GitHub
2. In Coolify: Update to latest commit → Force Rebuild
3. Verify `VITE_CONVEX_URL` in Coolify Build Time Variables
4. Run `npx convex deploy` for backend
5. Run `newsIngestor.runNewsIngestion` in Convex Dashboard (for main feed)
6. Hard refresh or open site in Incognito
