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

### Why it loops in EVERY Cloudflare SSL mode

- The origin has **TWO independent, unconditional `http→https`-style redirects**:
  1. **Port 80 — proxy middleware layer** (Traefik/Coolify; plain `404 page not found` + reason-phrase bodies): every HTTP request → `302/307 https://…` regardless of `X-Forwarded-Proto`. With Cloudflare **Flexible**, an original *HTTPS* request is forwarded as HTTP to `:80`, so it gets redirected back to the same HTTPS URL → infinite loop.
  2. **Port 443 — stale nginx** (`nginx/1.30.4`, from the old SSL-era `nginx.conf` that had `listen 443 ssl` + `return 301 https://thegridnexus.com$request_uri`): even an *already-HTTPS* request is `301`'d back to itself. So **Full/Full-strict** CF modes also loop.
- The deployed container is NOT running the current repo `nginx.conf` (which has no 443 listener and gates the `:80` redirect on `X-Forwarded-Proto`). It is running an **old build**.

---

## 2. FIX APPLIED (in this repo — commit 80024df)

Edited **`nginx.conf`** in this repo: removed the unconditional HTTP→HTTPS block and made the upgrade conditional on `X-Forwarded-Proto`, so it only redirects when the original client request was actually HTTP:

```nginx
server {
    listen 80 default_server;
    server_name thegridnexus.com _;
    root /usr/share/nginx/html;
    index index.html;

    # Only upgrade to HTTPS when the request did NOT already arrive via HTTPS.
    if ($http_x_forwarded_proto != "https") {
        return 301 https://thegridnexus.com$request_uri;
    }
    # ...rest unchanged (gzip, headers, alias rewrites, SPA try_files)...
}
```

- The `www → non-www` 301 block is unchanged and remains a single host-based hop.
- HTTPS-forwarded (`X-Forwarded-Proto: https`) requests now fall through and serve the SPA (`try_files $uri /index.html`).
- This repo's `nginx.conf` has **no `listen 443`** — TLS is meant to terminate at Coolify/Traefik or Cloudflare.

---

## 3. VERIFICATION (done in Docker nginx with the fixed config — all PASS)

| # | Test | Result |
|---|------|--------|
| nginx syntax | `docker exec … nginx -t` | ✅ `syntax is ok` |
| HTTPS-forwarded root `/` (the old loop) | nginx + `X-Forwarded-Proto: https` | ✅ `200` / `0` redirects |
| HTTPS-forwarded deep path `/sitemap.xml` | nginx + `X-Forwarded-Proto: https` | ✅ `200` / `0` redirects |
| Plain HTTP (no proxy header) | nginx without header | ✅ `301` → `https://thegridnexus.com/` (single hop) |
| `www` host (HTTPS-forwarded) | nginx `Host: www.thegridnexus.com` | ✅ `301` → non-www (canonical, one hop) |
| Served body | `/` returns `<!doctype html>…` | ✅ |
| Built assets | 9/9 JS/CSS refs exist in `dist/index.html` | ✅ |
| robots.txt / sitemaps | `dist/robots.txt`, `sitemap-index.xml` present & valid | ✅ |

---

## 4. DEPLOYMENT CHECKLIST — REQUIRED (make the fix live)

> The repo fix is **committed but not deployed**. The live origin still serves the OLD nginx.conf (stale image) + an unconditional proxy redirect on `:80`.

- [ ] **Redeploy the app container** from this repo (this Dockerfile copies the fixed `nginx.conf` → `/etc/nginx/conf.d/default.conf`). Confirm `nginx -t` passes in build logs. ← *the nginx on `:443` must disappear / stop redirecting*
- [ ] **Remove or disable any unconditional HTTP→HTTPS redirect middleware/rule** for `thegridnexus.com` / `www.thegridnexus.com` in the hosting proxy (Coolify domain settings / Traefik rule / IBM Cloud LB) — the `:80` layer must NOT 302/307 every request; it must pass `X-Forwarded-Proto` through to the app nginx.
- [ ] **Align Cloudflare SSL/TLS mode** (one of the two supported combos):
  - **Option A (recommended, simplest):** Cloudflare **Flexible** + this repo's nginx (listens only on `:80`, gates redirect on `X-Forwarded-Proto`).
  - **Option B:** Cloudflare **Full (strict)** with a Cloudflare Origin certificate on the origin `:443` and a corrected `:443` server block that **serves content instead of redirecting** (never `return 301 https://thegridnexus.com…` from a `listen 443` block for `thegridnexus.com`).
  - **Do NOT** leave Flexible + proxy-layer redirect + stale 443 nginx — that is the current broken state.
- [ ] **Purge Cloudflare cache** for `thegridnexus.com` and `www.thegridnexus.com`.
- [ ] Smoke-test (after deploy):
  - `curl -sI https://thegridnexus.com/` → `200` (no `location:`)
  - `curl -sI https://thegridnexus.com/security` → `200`
  - `curl -sI https://www.thegridnexus.com/` → single `301` → non-www → `200`
  - `curl -sI http://thegridnexus.com/` → single `301` → `https://…` → `200`
- [ ] Open in a browser (incognito): `/`, `/tech`, `/security`, `/gaming`, `/article/…` all load.

---

## 5. PREVENTIVE / HARDENING CHECKLIST (recommended)

- [ ] **Pin the origin fingerprints:** after redeploy verify `openssl s_client -connect <origin>:443` no longer serves a redirecting vhost, and `:80` respects `X-Forwarded-Proto: https` (returns 200).
- [ ] **Confirm no Cloudflare Redirect Rule / Page Rule** additionally redirects `https://thegridnexus.com/*` (a CF-side self-redirect would loop regardless of origin).
- [ ] **HSTS:** keep `Strict-Transport-Security` only on the HTTPS path that actually terminates TLS; if switching CF modes, re-test headers.
- [ ] **Add a regression test** to `scripts/` (curl assertions from §4) so every release fails CI if a self-referencing 301/302 appears.
- [ ] **Consolidate redirect logic:** keep host-canonical (www→non-www) + scheme (http→https) redirects in ONE layer. Current stack (CF + Traefik/Coolify middleware + nginx) had two extra layers, which is precisely how the loop slipped in.
- [ ] Remove `next.config.js` / `vercel.json` redirect rules if the site is truly Docker/Coolify-hosted (stale rules mislead future debugging).

---

## 6. SIGNATURE SNIPPET (for dashboards / future incidents)

```
ERR_TOO_MANY_REDIRECTS + 3xx whose Location equals the requested URL
+ Server: cloudflare + origin answers on BOTH :80 and :443 with unconditional
  redirects to https://thegridnexus.com (proxy middleware on :80, stale
  nginx with `listen 443 ssl` + `return 301` on :443)
⇒ No Cloudflare SSL mode (Flexible / Full / Full-strict) can break the cycle.
  Fix = deploy repo nginx.conf (no 443 listener, X-Forwarded-Proto guard on
  :80) AND remove the unconditional proxy-layer redirect.
```