# The Grid Nexus — Site Won't Open: Diagnosis & Fix Checklist

**Date:** 2026-09-07
**Domain:** `https://thegridnexus.com` / `https://www.thegridnexus.com`
**Symptom:** The platform never opens in a browser (`ERR_TOO_MANY_REDIRECTS` — page shows "This page isn't working / redirected you too many times").

---

## 1. ROOT CAUSE (confirmed)

The site was stuck in an **infinite 301 redirect loop**.

| Check | Evidence |
|---|---|
| DNS resolves | `thegridnexus.com` → Cloudflare `104.21.63.78 / 172.67.170.72` (proxied) ✅ |
| TLS terminates at | Cloudflare edge (`Server: cloudflare`, `alt-svc: h3`) |
| Response for `https://thegridnexus.com/` | **`HTTP/1.1 301 Moved Permanently` → `location: https://thegridnexus.com/`** (points to ITSELF) ❌ |
| Response for `https://thegridnexus.com/sitemap.xml` | 301 → the **same** URL (loop on every path) ❌ |
| `curl -L` trace | `curl: (47) Maximum (50) redirects followed` — confirms loop |

### Why the loop happens

- The origin runs **nginx in Docker** (see `Dockerfile` + `nginx.conf`) and only listens on **port 80**.
- Cloudflare is set to **Flexible SSL mode**: it terminates TLS at the edge and forwards **every** request (including original HTTPS ones) to the origin as **plain HTTP on port 80**, setting header `X-Forwarded-Proto: https`.
- The old `nginx.conf` had an **unconditional** redirect block:

  ```nginx
  server {
      listen 80;
      server_name thegridnexus.com;
      return 301 https://thegridnexus.com$request_uri;   # fires EVERY time
  }
  ```

- Flow: Browser → `https://thegridnexus.com/` → Cloudflare → origin over HTTP:80 →
  nginx sees "HTTP", returns `301 → https://thegridnexus.com/` → browser follows → **repeat forever**.

---

## 2. FIX APPLIED (in this repo)

Edited **`nginx.conf`** — removed the unconditional HTTP→HTTPS block and made the upgrade conditional on
`X-Forwarded-Proto`, so it only redirects when the original client request was actually HTTP:

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

- The `www → non-www` 301 block is unchanged and remains a single hop (not a loop).
- HTTPS-forwarded (`X-Forwarded-Proto: https`) requests now fall through and serve the SPA (`try_files $uri /index.html`).

---

## 3. VERIFICATION (done — all PASS)

| # | Test | Result |
|---|------|--------|
| nginx syntax | `docker exec … nginx -t` | ✅ `syntax is ok` |
| HTTPS-forwarded root `/` (the old loop) | nginx + `X-Forwarded-Proto: https` | ✅ `200` / `0` redirects |
| HTTPS-forwarded deep path `/sitemap.xml` | nginx + `X-Forwarded-Proto: https` | ✅ `200` / `0` redirects |
| Plain HTTP (no proxy header) | nginx without header | ✅ `301` → `https://thegridnexus.com/` (single hop) |
| `www` host (HTTPS-forwarded) | nginx `Host: www.thegridnexus.com` | ✅ `301` → non-www (canonical, one hop) |
| Served body | `/` now returns `<!doctype html>…` | ✅ |
| Built assets | 9/9 JS/CSS refs in `dist/index.html` exist | ✅ |
| robots.txt / sitemaps | `dist/robots.txt`, `sitemap-index.xml` present & valid | ✅ |

---

## 4. DEPLOYMENT CHECKLIST (must do to make it live)

- [ ] **Commit** the `nginx.conf` change.
- [ ] **Rebuild** the Docker image (this Dockerfile copies `nginx.conf` → `/etc/nginx/conf.d/default.conf`).
- [ ] **Redeploy** the container (Coolify / whatever runs the origin) and confirm `nginx -t` passes in logs.
- [ ] **Purge Cloudflare cache** for `thegridnexus.com` (+ `www`), and verify outside/incognito.
- [ ] Smoke-test: `curl -sI https://thegridnexus.com/` → expect `HTTP/2 200` (no `location:` header).
- [ ] Smoke-test a deep URL: `curl -sI https://thegridnexus.com/security` → `200`.
- [ ] Smoke-test www: `curl -sI https://www.thegridnexus.com/` → `301` to non-www, then `200`.
- [ ] Smoke-test `http://thegridnexus.com/` → `301` → `https://thegridnexus.com/` → `200`.
- [ ] Open in a browser: site loads with no "too many redirects", `/`, `/tech`, `/security`, `/gaming`.

---

## 5. PREVENTIVE / HARDENING CHECKLIST (recommended)

- [ ] **Cloudflare SSL/TLS mode:** either keep **Flexible** (works now, thanks to the X-Forwarded-Proto guard) or ideally move to **Full (strict)** and add a `listen 443 ssl` origin server block with a Cloudflare Origin certificate. Full/strict is preferred for real end-to-end encryption.
- [ ] Confirm **no Cloudflare redirect Rule / Page Rule** also redirects `https://thegridnexus.com/*` (a CF-side self-redirect would loop regardless of nginx).
- [ ] Verify HSTS: with the current setup the `Strict-Transport-Security` header is served after the fix; if you switch to Full SSL keep it.
- [ ] Add a loop guard test to `scripts/` (curl assertions above) before each release.
- [ ] Confirm the `next.config.js` / `vercel.json` redirect rules match only if the deployment is actually Vercel-hosted (live origin is Docker/nginx; keep redirect logic in one place).

---

## 6. SIGNATURE SNIPPET (for dashboards / future incidents)

```
ERR_TOO_MANY_REDIRECTS + 301 whose Location equals the requested URL
+ Server: cloudflare + nginx origin listening only on :80
⇒ HTTP→HTTPS redirect at origin is unconditional while Cloudflare is in Flexible SSL.
```