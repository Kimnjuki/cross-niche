# The Grid Nexus — Site Won't Open: Diagnosis & Fix Checklist

**Date:** 2026-09-09 (updated with origin/DNS findings)
**Domain:** `https://thegridnexus.com` / `https://www.thegridnexus.com`
**Symptom:** The platform never opens in a browser (`ERR_TOO_MANY_REDIRECTS` — page shows "This page isn't working / redirected you too many times").

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

## 3. VERIFICATION (done in Docker nginx with the fixed config — all PASS)

| # | Test (simulates production path) | Result |
|---|------|--------|
| nginx syntax | `docker exec … nginx -t` | ✅ `syntax is ok` |
| **T1 — CF Flexible + Traefik** (root `/`, `CF-Ray` present, `X-Forwarded-Proto: http` — the OLD active loop) | nginx + `CF-Ray: 123abc` + `XFP: http` | ✅ **200** / 0 redirects |
| **T2 — CF Full/Full-strict + Traefik** (`CF-Ray` present, `XFP: https`) | nginx + `CF-Ray` + `XFP: https` | ✅ **200** / 0 redirects |
| **T5 — deep path** `/security` (CF-Ray + XFP http) | nginx + headers | ✅ **200** / 0 redirects |
| **T6 — deep path** `/sitemap.xml` (CF-Ray + XFP http) | nginx + headers | ✅ **200** / 0 redirects |
| **T3 — direct plain HTTP** (no CF-Ray, no XFP) | nginx without headers | ✅ **301** → `https://thegridnexus.com/` (single hop) |
| **T4 — www + CF-Ray + XFP http** | nginx `Host: www.thegridnexus.com` | ✅ **301** → non-www (canonical, one hop) |
| Body served | T1 response returns `<!doctype html>…` | ✅ |
| Built assets | 9/9 JS/CSS refs exist in `dist/index.html` | ✅ |
| robots.txt / sitemaps | `dist/robots.txt`, `sitemap-index.xml` present & valid | ✅ |

---

## 4. DEPLOYMENT CHECKLIST — REQUIRED (make the fix live)

> The repo fix is **committed but not deployed**. The live origin still runs the OLD nginx image **and** the Coolify Traefik `redirect-to-https` middleware.

- [ ] **1. Redeploy the app from this repo** (Dockerfile copies the fixed `nginx.conf` → `/etc/nginx/conf.d/default.conf`; it has NO `listen 443`, so the stale `:443` redirecting nginx disappears). Confirm `nginx -t` passes in build logs.
- [ ] **2. Fix the Coolify Traefik labels** (the confirmed active loop) — in Coolify → project → deployment/domain settings → **Advanced** (docker-compose/traefik labels), change for BOTH hosts:

  - Remove `traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https`
    → or simply stop referencing it. Use gzip (or no middleware) on the http routers:
    ```
    traefik.http.middlewares.gzip.compress=true
    traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.entryPoints=http
    traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.middlewares=gzip
    traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.rule=Host(`thegridnexus.com`) && PathPrefix(`/`)
    traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.service=http-0-x2njvj4owio2rehys3l97m81
    traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.entryPoints=http
    traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.middlewares=gzip
    traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.rule=Host(`www.thegridnexus.com`) && PathPrefix(`/`)
    traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.service=http-1-x2njvj4owio2rehys3l97m81
    ```
    (Keep the `https-0`/`https-1` routers as-is — they terminate LetsEncrypt TLS for direct origin access; the app nginx's CF-Ray guard makes them safe.)

- [ ] **3. Cloudflare SSL/TLS mode — choose one supported configuration:**
  - **Option A (recommended, works with unchanged CF settings):** keep **Flexible**. Cloudflare → origin `:80` → Traefik (no redirect) → app nginx (CF-Ray present ⇒ serves content). ✅
  - **Option B (more secure, optional):** set **Full** or **Full (strict)**. Cloudflare → origin `:443` → Traefik `https-0` router (LetsEncrypt) → app nginx (`X-Forwarded-Proto: https` ⇒ serves content). ✅ Requires Traefik to own origin `:443` (no stale nginx bound to it) — satisfied by step 1.
  - **Do NOT** leave Flexible + the `redirect-to-https` middleware — that is the current broken state (req. steps 1+2 fix it).
- [ ] **4. Purge Cloudflare cache** for `thegridnexus.com` and `www.thegridnexus.com`.
- [ ] **5. Smoke-test (after deploy):**
  - `curl -sI https://thegridnexus.com/` → `200` (no `location:`)
  - `curl -sI https://thegridnexus.com/security` → `200`
  - `curl -sI https://www.thegridnexus.com/` → single `301` → non-www → `200`
  - `curl -sI http://thegridnexus.com/` → `200` (CF strips edge HTTP; or single `301` → `https`) — no infinite chain
- [ ] **6. Open in a browser (incognito):** `/`, `/tech`, `/security`, `/gaming`, `/article/…` all load.

---

## 5. PREVENTIVE / HARDENING CHECKLIST (recommended)

- [ ] **Pin the origin fingerprints:** after redeploy, `curl -sk https://<origin>/` no longer returns a redirecting nginx; `http://<origin>/` with `CF-Ray` + `XFP: http` returns `200`.
- [ ] **Confirm no Cloudflare Redirect Rule / Page Rule** additionally redirects `https://thegridnexus.com/*` (a CF-side self-redirect would loop regardless of origin).
- [ ] **HSTS:** keep `Strict-Transport-Security` only on the HTTPS path that actually terminates TLS; if switching CF modes, re-test headers.
- [ ] **Add a regression test** to `scripts/` (curl assertions from §4) so every release fails CI if a self-referencing 301/302 appears.
- [ ] **Consolidate redirect logic:** host-canonical (www→non-www) + scheme (http→https) belong in ONE layer (nginx). Keep middlewares to gzip only.
- [ ] Remove `next.config.js` / `vercel.json` redirect rules if the site is truly Docker/Coolify-hosted (stale rules mislead future debugging).

---

## 6. SIGNATURE SNIPPET (for dashboards / future incidents)

```
ERR_TOO_MANY_REDIRECTS + 3xx whose Location equals the requested URL
+ Server: cloudflare + Coolify Traefik on :80 with
  traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
+ stale app nginx on :443 with `listen 443 ssl` + `return 301 https://…`
⇒ With Cloudflare Flexible, every edge-HTTPS request lands on origin :80 and
  Traefik 302-redirects it back to the same https URL forever.
Fix:
  1) deploy repo nginx.conf (CF-Ray guard, no 443 listener)
  2) Coolify labels: remove redirect-to-https from http routers (gzip only)
  3) Cloudflare: Flexible (or switch to Full/Full-strict once Traefik owns 443)
```