# The Grid Nexus — Site Won't Open: Diagnosis & Fix Checklist

**Date:** 2026-09-09 (origin :443 verified working — see status)
**Domain:** `https://thegridnexus.com` / `https://www.thegridnexus.com`
**Symptom:** The platform never opens in a browser (`ERR_TOO_MANY_REDIRECTS` — page shows "This page isn't working / redirected you too many times").

> ## ✅ CURRENT STATE (2026-09-09, re-verified directly against origin)
>
> | Layer | State | Verdict |
> |---|---|---|
> | Repo fixes (`nginx.conf` CF-Ray guard, no 443 listener) | committed + pushed (`21ce693`) | ✅ |
> | App deployed (fixed image `7b4f553a8a7b`) | **origin `:443` → `200 OK` on EVERY path** (`/`, `/security`, `/gaming`, `/tech`, `/sitemap.xml`, `/robots.txt`, `/health`) | ✅ |
> | `www` canonicalization | origin `:443` Host `www` → single `301 → https://thegridnexus.com` then 200 | ✅ |
> | Origin `:80` | still Traefik **`302 Found`** (`redirect-to-https` middleware active in Coolify) | ❌ |
> | Public `https://…` via Cloudflare | now **`200 OK`** (CF switched to Full → hits origin `:443`) | ✅ |

---

## 📄 2026-09-09 ADDENDUM — article-URL 301 loop (crawler report)

The SEO crawler showed every `/article/<slug>` returning `301`. Hop-by-hop trace exposed a loop:

```
https://…/article/foo       → 301 → http://…/article/foo/     (nginx directory-index adds slash; $scheme=http behind TLS proxy)
http://…/article/foo/       → 301 → https://…/article/foo/    (scheme upgrade)
https://…/article/foo/      → 301 → http://…/article/foo      (server-level trailing-slash stripper)
http://…/article/foo        → 301 → https://…/article/foo     (scheme upgrade) → repeat
```

**Root cause:** `location ^~ /article/ { try_files $uri $uri/ /index.html; }` — the static articles
are generated as `dist/article/{slug}/index.html`, so `$uri/` matched a real directory and nginx's
built-in index module issued `301 → /article/<slug>/`; the server-level
`rewrite ^/(.+)/$ /$1 permanent;` then stripped it → infinite loop.

**Fix (committed):** `try_files $uri $uri/index.html /index.html;` — serves the static article
directly (internal redirect, no directory 301). **Validated in Docker:** canonical
`/article/test-article` → **200 / 0 redirects**; trailing-slash → single canonical chain;
missing slug → SPA fallback 200; root/categories 200.
Sitemap + internal links already use the canonical no-slash HTTPS form; static article HTML
emits `<link rel="canonical">`.

⚠️ Requires a **Coolify redeploy** (new commit SHA) to go live.

---

## ⚡ HOW IT WAS OPENED (2026-09-09)

Cloudflare SSL mode was switched to **Full** (`https://thegridnexus.com/` → `200 OK` now), and the
trailing-scheme loop was eliminated by the CF-Ray guard. The only leftover redirect issues were the
article URLs (fixed above, pending redeploy).
> ## 🛠 ALTERNATIVE / PERMANENT FIX (Coolify Traefik :80)
> Change the two Coolify http-router `middlewares` labels from `redirect-to-https` → `gzip`
> (delete the `redirect-to-https` middleware definition). Full corrected block:
> **`COOLIFY_TRAEFIK_LABELS_FLEXIBLE.md`**. This removes the root cause entirely and lets you
> keep Flexible (or use Full). Either fix opens the site; doing **both** is belt-and-suspenders.

---

## 1. ROOT CAUSE (confirmed at every layer)

The site is stuck in an **infinite HTTPS redirect loop**. Requests can never land on a `200`.

| Check | Evidence | Status |
|---|---|---|
| DNS (zone export 2026-09-08) | `A thegridnexus.com` + `A www.thegridnexus.com` → `169.58.3.171` (IBM Cloud), `cf-proxied:true`, NS = Cloudflare | ✅ DNS fine |
| Public `https://thegridnexus.com/` | `HTTP 302/301` → `location: https://thegridnexus.com/` (points to ITSELF) | ❌ |
| `curl -L` trace | `curl: (47) Maximum (50) redirects followed` — loop, 50+ hops | ❌ |
| Origin `:80` (bypassing CF) | `302/307` → `https://thegridnexus.com/<path>` even when `X-Forwarded-Proto: https` is sent | ❌ |
| Origin `:443` (bypassing CF) | `301 Moved Permanently` → `https://thegridnexus.com/<path>` **for already-HTTPS requests** (`Server: nginx/1.30.4`, `Alt-Svc: h3`) | ❌ |
| CF SSL mode observed | Public response body `Found`/`Content-Length: 5` = origin `:80` relayed ⇒ **Cloudflare is in Flexible mode** (HTTP to origin) | ⚠️ |
| **Coolify Traefik labels (provided 2026-09-09)** | `traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https` + `http-0-*/http-1-*.middlewares=redirect-to-https` on **both** `thegridnexus.com` and `www` http routers | ❌ definitive |

### Why it loops in EVERY Cloudflare SSL mode

- The origin has **TWO independent, unconditional `http→https`-style redirects**:
  1. **Port 80 — Coolify Traefik proxy** (`traefik.http.middlewares.redirect-to-https` on the `http` entrypoint routers): every HTTP request → `302/307 https://…` **regardless of headers**. With Cloudflare **Flexible**, an original *HTTPS* request is forwarded as HTTP to `:80`, so Traefik redirects it back to the same HTTPS URL → infinite loop. **This is the active, confirmed loop.**
  2. **Port 443 — stale nginx** (`nginx/1.30.4`, from the old SSL-era `nginx.conf` that had `listen 443 ssl` + `return 301 https://thegridnexus.com$request_uri`): even an *already-HTTPS* request is `301`'d back to itself. So **Full/Full-strict** CF modes would ALSO loop until the app is redeployed from this repo.
- The deployed app container is NOT running the current repo `nginx.conf` — it is running an **old image** (with the `listen 443` SSL config).

---

## 2. FIX APPLIED (in this repo — commits 80024df + update 2026-09-09)

Edited **`nginx.conf`** — replaced the unconditional HTTP→HTTPS block with a **Cloudflare-aware guard**. Because Cloudflare lands every request on origin `:80` in Flexible mode AND Coolify's Traefik rewrites `X-Forwarded-Proto` to `http`, the proxy's **`CF-Ray` header** is the reliable "client is already HTTPS at the edge" signal:

```nginx
server {
    listen 80 default_server;
    server_name thegridnexus.com _;
    root /usr/share/nginx/html;
    index index.html;

    # CF-Ray is stamped by Cloudflare on EVERY proxied request (any SSL mode).
    # Only truly direct plain-HTTP clients (no CF-Ray) get the 301 upgrade.
    set $upgrade_to_https 0;
    if ($http_cf_ray = "") {
        set $upgrade_to_https 1;
    }
    if ($http_x_forwarded_proto = "https") {
        set $upgrade_to_https 0;
    }
    if ($upgrade_to_https = "1") {
        return 301 https://thegridnexus.com$request_uri;
    }
    # ...rest unchanged (gzip, headers, alias rewrites, SPA try_files)...
}
```

- The `www → non-www` 301 block (Block 1) is unchanged and remains a single host-based hop.
- This repo's `nginx.conf` has **no `listen 443`** — TLS terminates at Cloudflare/Coolify Traefik, not in the app nginx.

---

## 3. VERIFICATION (final — Docker nginx, Cloudflare FLEXIBLE matrix; all PASS 2026-09-09)

| # | Test (simulates the production Flexible path) | Result |
|---|------|--------|
| nginx syntax | `docker exec … nginx -t` | ✅ `syntax is ok` |
| **F1 — https://thegridnexus.com/** via CF Flexible + Traefik (`CF-Ray`, `XFP: http`) — **the old active loop** | nginx + `CF-Ray` + `XFP: http` | ✅ **200** / 0 redirects |
| **F2 — https://thegridnexus.com/security** (CF-Ray + XFP http) | nginx + headers | ✅ **200** / 0 redirects |
| **F3 — https://thegridnexus.com/sitemap.xml** (CF-Ray + XFP http) | nginx + headers | ✅ **200** / 0 redirects |
| **F4 — http://thegridnexus.com/** via CF (`CF-Ray`, XFP http) | nginx + headers | ✅ **200** / 0 redirects |
| **F5 — https://www.thegridnexus.com/** via CF | nginx `Host: www` + `CF-Ray` + XFP http | ✅ **301** → `https://thegridnexus.com/` (single canonical hop) |
| **F6 — direct origin `:80` plain HTTP** (no CF-Ray) | nginx without headers | ✅ **301** → `https://thegridnexus.com/` (single hop) |
| **F7 — direct origin via Traefik https router** (`XFP: https`, e.g. Full mode later) | nginx + `XFP: https` | ✅ **200** / 0 redirects |
| Body served | F1 returns `<!doctype html>…` | ✅ |
| Built assets | 9/9 JS/CSS refs exist in `dist/index.html` | ✅ |
| robots.txt / sitemaps | `dist/robots.txt`, `sitemap-index.xml` present & valid | ✅ |

---

## 4. DEPLOYMENT CHECKLIST — REQUIRED (make the fix live)

> Cloudflare SSL/TLS mode: **FLEXIBLE** (confirmed 2026-09-09) — everything below is aligned to it.
> The repo fix is committed **AND pushed** — GitHub `main` = `f8d64b7` (all 4 fix commits).
> ✅ Remaining: (1) trigger a NEW Coolify deployment so it builds from the new SHA (a redeploy of
> the same cached SHA will skip the build), and (2) fix the Coolify Traefik labels.

- [ ] **1. Redeploy from GitHub `main` = `f8d64b7`** — in Coolify trigger **"Deploy"** (or force rebuild) so it pulls the new commit and actually builds the image (Dockerfile copies the fixed `nginx.conf` → `/etc/nginx/conf.d/default.conf`; it has NO `listen 443` and a CF-Ray guard). Confirm `nginx -t` passes in build logs. If Coolify again says "Build step skipped", that means the old SHA is cached — re-push a marker commit or use **Rebuild** enforcement.
- [ ] **2. Fix the Coolify Traefik labels** — in Coolify → project → deployment → **Advanced**, replace the http-router middlewares from `redirect-to-https` to `gzip` (delete the `redirect-to-https` middleware definition). Full corrected block: see **`COOLIFY_TRAEFIK_LABELS_FLEXIBLE.md`**.
- [ ] **3. Cloudflare SSL/TLS mode = FLEXIBLE** ✅ already set — do NOT change it for now (it matches this nginx config). Optionally upgrade to **Full/Full-strict later** once Traefik owns origin `:443`.
- [ ] **4. Purge Cloudflare cache** for `thegridnexus.com` and `www.thegridnexus.com`.
- [ ] **5. Smoke-test (after deploy):**
  - `curl -sI https://thegridnexus.com/` → `200` (no `location:`)
  - `curl -sI https://thegridnexus.com/security` → `200`
  - `curl -sI https://www.thegridnexus.com/` → single `301` → non-www → `200`
  - `curl -sI http://thegridnexus.com/` → `200` (CF forwards it; CF-Ray present) — no infinite chain
- [ ] **6. Open in a browser (incognito):** `/`, `/tech`, `/security`, `/gaming`, `/article/…` all load.

---

## 5. PREVENTIVE / HARDENING CHECKLIST (recommended)

- [ ] **Pin the origin fingerprints:** after redeploy, `curl -sk https://<origin>/` no longer returns a redirecting nginx; `http://<origin>/` with `CF-Ray` + `XFP: http` returns `200`.
- [ ] **Confirm no Cloudflare Redirect Rule / Page Rule** additionally redirects `https://thegridnexus.com/*` (a CF-side self-redirect would loop regardless of origin).
- [ ] **HSTS (Flexible note):** the `Strict-Transport-Security` header from nginx passes through Cloudflare to the browser over the edge-HTTPS leg — keep it. On origin `:80` it is harmless. If you later upgrade to Full/Full-strict, re-test headers.
- [ ] **Optional future upgrade — Full/Full-strict:** only after verifying Traefik binds origin `:443` (its `https-0`/`https-1` LetsEncrypt routers) with **no** stale nginx on 443. nginx already handles `X-Forwarded-Proto: https` (test F7 passes).
- [ ] **Add a regression test** to `scripts/` (curl assertions from §4) so every release fails CI if a self-referencing 301/302 appears.
- [ ] **Consolidate redirect logic:** host-canonical (www→non-www) + scheme (http→https) belong in ONE layer (nginx). Keep Traefik middlewares to gzip only.
- [ ] Remove `next.config.js` / `vercel.json` redirect rules if the site is truly Docker/Coolify-hosted (stale rules mislead future debugging).

---

## 6. SIGNATURE SNIPPET (for dashboards / future incidents)

```
ERR_TOO_MANY_REDIRECTS + 3xx whose Location equals the requested URL
+ Server: cloudflare (Flexible) + Coolify Traefik on :80 with
  traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
+ stale app nginx on :443 with `listen 443 ssl` + `return 301 https://…`
⇒ With Cloudflare Flexible, every edge-HTTPS request lands on origin :80 and
  Traefik 302-redirects it back to the same https URL forever.
Fix (Cloudflare FLEXIBLE - CONFIRMED):
  1) deploy repo nginx.conf (CF-Ray guard, no 443 listener)
  2) Coolify labels: http routers use gzip (delete redirect-to-https middleware)
  3) Cloudflare mode: Flexible (already set) - purge cache after deploy
```