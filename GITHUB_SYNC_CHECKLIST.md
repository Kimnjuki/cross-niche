# GitHub & Deployment Sync Checklist

**Why changes aren’t visible on GitHub**  
All recent work (platform analysis, Nexus features, view toggles, Top Story hero, Latest Updates, Convex migration, etc.) exists only **locally**. Nothing has been committed or pushed to `origin`, so GitHub and any deployment (Coolify, Vercel, etc.) are still on the old code.

---

## Step 1: Confirm remote

```bash
git remote -v
```

You should see `origin` pointing to your GitHub repo (e.g. `https://github.com/youruser/cross-niche-intelligence.git` or `git@github.com:...`). If not, add it:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

## Step 2: Stage changes

**Option A – Stage everything (including CSV exports)**  
Use this if you want the repo to include CSV data for import/backup.

```bash
git add -A
```

**Option B – Stage code and docs only (no CSV data)**  
Use this if CSVs are large or sensitive and you prefer not to store them in the repo.

```bash
git add src/ public/ convex/ chrome-extension/ scripts/ supabase/
git add *.md index.html nginx.conf package.json package-lock.json components.json
git add .dockerignore .gitignore eslint.config.js postcss.config.js tailwind.config.ts tsconfig*.json vite.config.ts
```

Then check what’s staged:

```bash
git status
```

---

## Step 3: Commit

```bash
git commit -m "Platform analysis: Top Story hero, Latest Updates, design system, nav search, view toggles, Nexus features, Convex migration, SEO/audit docs"
```

Or a shorter message:

```bash
git commit -m "Sync: competitor layout, Nexus 001-005, Convex import, design system, checklists"
```

---

## Step 4: Push to GitHub

```bash
git push -u origin master
```

If your default branch is `main`:

```bash
git branch -M main
git push -u origin main
```

If push is rejected (e.g. remote has new commits), pull first then push:

```bash
git pull origin master --rebase
git push origin master
```

---

## Step 5: Deployment (Coolify / Vercel / etc.)

After the code is on GitHub:

1. **Coolify**  
   Trigger a redeploy of the app (e.g. “Redeploy” or “Build”) so it pulls the latest commit from GitHub.

2. **Vercel / Netlify**  
   Usually auto-deploy on push to the connected branch. If not, use “Redeploy” in the dashboard.

3. **Manual deploy**  
   On the server: `git pull origin master` (or `main`), then `npm install && npm run build` (or your build command).

---

## Quick one-shot (after reviewing)

```bash
git add -A
git status
git commit -m "Sync: platform analysis layout, Nexus features, Convex, design system, checklists"
git push origin master
```

Then trigger a redeploy in your hosting panel so the live site (thegridnexus.com) uses the new code.

---

## Coolify-specific: Fix env var typo (if deployment failed)

If the build log shows:

```text
/artifacts/build-time.env: line 5: CONVEX_SITE_URL.=https://...: No such file or directory
```

the env variable name has a **trailing dot**. In Coolify:

1. Open your application → **Environment Variables**.
2. Find the variable named **`CONVEX_SITE_URL.`** (with a dot).
3. Rename it to **`CONVEX_SITE_URL`** (no dot) and save.
4. Redeploy.
