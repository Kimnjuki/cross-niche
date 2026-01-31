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

**Changes not appearing after redeploy?** The app now runs in **demo mode** when `VITE_CONVEX_URL` is not set: the full UI (including Grid Nexus layout) and sample data are shown so you always see your latest code. To get **live data** from Convex, set `VITE_CONVEX_URL` as a Build Time Variable (see below) and redeploy. You will no longer see a "Setup required" block; you will see a thin amber "Demo mode" banner at the top until Convex is configured.

## Docker build uses Node (not Bun)

The Dockerfile uses **Node 22** and **npm** with `package-lock.json`. Do not switch the image to Bun or use `bun.lockb` in Docker, or you may hit:

- `Outdated lockfile version: failed to parse lockfile: 'bun.lockb'`
- `No version matching "^4.20.0" found for specifier "rollup"`

## Convex connection and why changes may not appear

1. **Code not on GitHub** – Coolify builds from your Git repo. Commit and push from Cursor, then in Coolify use **Source → Update to latest commit** and **Force Rebuild**.
2. **Build skipped** – If the commit SHA did not change, Coolify may skip the build. Use **Force Rebuild** so a full Vite build runs.
3. **Convex not set** – If `VITE_CONVEX_URL` is missing at build time, the app still loads in **demo mode** (sample data + full UI). Set it as a Build Time Variable to connect to your Convex deployment and get live data.
4. **Browser cache** – After deploy, open the site in **Incognito** or hard refresh (`Ctrl+F5` / `Cmd+Shift+R`).

## Build-time variables in Coolify

Set these as **Build Time Variables** (not runtime). Use a **single** `=` between key and value.

| Key | Example value |
|-----|----------------|
| `VITE_CONVEX_URL` | `https://canny-mule-83.convex.cloud` (use your **Deployment URL** from Convex dashboard, not the HTTP Actions URL) |

**Important:** In Coolify, the value must be exactly the URL with **no double equals**. Wrong: `VITE_CONVEX_URL==https://...`. Correct: key `VITE_CONVEX_URL`, value `https://canny-mule-83.convex.cloud`. Use the **Deployment URL** (`.convex.cloud`), not the HTTP Actions URL (`.convex.site`). Get it from the [Convex dashboard](https://dashboard.convex.dev) (your project → Settings → Deployment URL).

Optional:

- `VITE_APP_URL` — e.g. `https://thegridnexus.com`
- Supabase vars if you still use auth/bookmarks: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)

## Docker build warnings (SecretsUsedInArgOrEnv)

If the deployment log shows:

**`SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "production_deploy_key")`**

Coolify injects `production_deploy_key` and other build args into the Dockerfile at build time. This repo’s Dockerfile does **not** define or reference `production_deploy_key`; Coolify adds it. The warning is informational. To reduce or avoid it:

- **Do not** add any secret values (API keys, deploy keys) to the Dockerfile in this repo.
- Configure **Build Time Variables** only in Coolify (e.g. `VITE_CONVEX_URL`). Use Coolify’s secret management (e.g. secret files or env files) for sensitive values if your Coolify version supports it, so secrets are not passed as ARG/ENV.

The app will still build and run; the warning does not block deployment.

## After changing the Dockerfile

Commit and push the Node-based Dockerfile (and this note) to your repo so Coolify uses it on the next deploy.
