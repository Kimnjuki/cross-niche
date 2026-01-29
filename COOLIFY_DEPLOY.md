# Coolify deployment

## ⚠️ "Build step skipped" – why your changes don’t show up

If your deployment log says:

**`No configuration changed & image found (...) with the same Git Commit SHA. Build step skipped.`**

Coolify is reusing the **previous** build because the **Git commit SHA** hasn’t changed. Your new homepage (or any edits) may only exist in Cursor and were never committed and pushed to GitHub, so Coolify keeps serving the old image.

### 3-step fix

**1. Push your changes from Cursor**

Your new code must be on GitHub. In the terminal (Cursor or your machine):

```bash
git add .
git commit -m "Complete homepage overhaul"
git push origin master
```

*(Use your actual branch name if it’s not `master`, e.g. `main`.)*

**2. Force Coolify to use the latest commit**

- In Coolify → your application → **Source**
- Click **“Update to latest commit”** (or paste the newest commit SHA from GitHub)
- That way Coolify is building from the commit you just pushed

**3. Clear cache and rebuild**

- Go to **Deployments**
- Click the arrow next to **Deploy**
- Choose **“Force Rebuild”** (or “Deploy without cache”)
- In the log you should **not** see “Build step skipped”; you should see the full build (e.g. Vite building and creating `.js` / `.css` files). This repo uses **`npm run build`** (not `bun run build`) and usually takes 1–2 minutes.

### How to confirm it worked

- **SHA:** The deployment log should show a **new** commit SHA (different from the old one, e.g. not `f24cb42...`).
- **Build:** The log should show the Vite build step and the list of generated assets.
- **Site:** Open the site in **Incognito** (`Ctrl+Shift+N` / `Cmd+Shift+N`) so the browser isn’t serving a cached old version.

---

## When the site still shows the old version (Build Cache / Git Sync)

If Cursor and GitHub have your latest code but the live site is still old, use this checklist.

### 1. Force Rebuild (clear Docker cache)

Docker/Coolify cache layers (e.g. previous `npm run build`). After big changes (e.g. homepage overhaul), force a clean build:

- In Coolify → your application → **Deployments**
- Use **Rebuild (Force)** (or equivalent) instead of a normal **Deploy**
- This ignores cached layers and runs a full build on the latest code

### 2. Verify the commit SHA

At the top of the Coolify deployment log you’ll see something like:

`Importing Kimnjuki/cross-niche:master (commit sha f24cb42...)`

- Open GitHub → repo **Kimnjuki/cross-niche** → **Commits**
- Compare the **latest commit SHA** with the one in the Coolify log  
- If GitHub has a newer SHA, Coolify didn’t pull the latest push

**Fix:** Ensure the Coolify **webhook** is set up and firing, or use **Pull Latest** (or equivalent) in Coolify before deploying.

### 3. Vite outDir (must match Dockerfile)

The Dockerfile copies the build output from:

`COPY --from=build-stage /app/dist /usr/share/nginx/html`

So the Vite build **must** output to `dist`. In this repo:

- `vite.config.ts` has `build.outDir: "dist"` ✓  
- If you change `outDir` in Vite, update the Dockerfile `COPY` path to match.

### 4. Browser and Nginx caching

- **Hard refresh:** `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac) to bypass browser cache.
- **index.html:** This repo’s `nginx.conf` sets `Cache-Control: no-cache` for `index.html` so redeploys are visible without a long cache.

### All-in-sync workflow

| Step | Where | Purpose |
|------|--------|--------|
| Save All | Cursor | Writes all changes to disk |
| Commit & Push | Git / GitHub | Gets latest code to the cloud |
| Check SHA | Coolify log vs GitHub | Confirms Coolify is on the same commit |
| Rebuild (Force) | Coolify | Clears cache and builds from that commit |
| Hard refresh | Browser | Ensures you see the new build |

**Routing check:** The homepage is **`src/pages/Index.tsx`**. `App.tsx` imports it as `Index` and uses `<Route path="/" element={<Index />} />`. There is no `Home.tsx` in use for `/`.

---

## Homepage visibility after redeploy

The app is built so the homepage **always shows** after redeploy:

- **Error boundary** – If React or a script throws, you see “Something went wrong” with “Go to homepage” and “Reload” instead of a blank page.
- **Loading timeout** – If Convex is slow or not configured, the homepage shows mock content after ~2.5 seconds so the feed is never stuck on loading.
- **Init scripts** – Analytics and other inits are wrapped in try/catch so a failing script cannot block the app from rendering.

**If the homepage is blank:** set `VITE_CONVEX_URL` as a **Build Time Variable** in Coolify (see below). Use a single `=` (e.g. value `https://your-deployment.convex.site`). Then redeploy.

## Docker build uses Node (not Bun)

The Dockerfile uses **Node 22** and **npm** with `package-lock.json`. Do not switch the image to Bun or use `bun.lockb` in Docker, or you may hit:

- `Outdated lockfile version: failed to parse lockfile: 'bun.lockb'`
- `No version matching "^4.20.0" found for specifier "rollup"`

## Build-time variables in Coolify

Set these as **Build Time Variables** (not runtime). Use a **single** `=` between key and value.

| Key | Example value |
|-----|----------------|
| `VITE_CONVEX_URL` | `https://canny-mule-83.convex.site` |

**Important:** In Coolify, the value must be exactly the URL with **no double equals**. Wrong: `VITE_CONVEX_URL==https://...`. Correct: key `VITE_CONVEX_URL`, value `https://canny-mule-83.convex.site`.

Optional:

- `VITE_APP_URL` — e.g. `https://thegridnexus.com`
- Supabase vars if you still use auth/bookmarks: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)

## After changing the Dockerfile

Commit and push the Node-based Dockerfile (and this note) to your repo so Coolify uses it on the next deploy.
