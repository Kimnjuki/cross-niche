# Coolify / Traefik Labels — Cloudflare FLEXIBLE Mode (corrected)

**Date:** 2026-09-09
**Applies to:** thegridnexus.com deployment on Coolify (Traefik proxy)
**Cloudflare SSL/TLS mode:** **Flexible** (confirmed) → Cloudflare terminates TLS at the edge and connects to the origin over plain HTTP on port 80.

---

## Why these labels matter

The labels below control Coolify's Traefik router. The **current live labels** force every
port-80 request to `https://` via the `redirect-to-https` middleware. With Cloudflare
**Flexible**, *every* real request (even `https://`) is forwarded to this origin as plain HTTP
on port 80 — so Traefik 302-redirects `https://thegridnexus.com/` back to itself → infinite
loop (`ERR_TOO_MANY_REDIRECTS`).

After this change, Cloudflare-proxied requests (recognized by the `CF-Ray` header the app's
nginx checks) are served content directly. Only direct-origin plain-HTTP clients get a
single-hop 301 from nginx.

---

## 1. Current (BROKEN) labels — REMOVE `redirect-to-https`

```properties
traefik.enable=true
traefik.http.middlewares.gzip.compress=true
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https   # ← DELETE this line
traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.entryPoints=http
traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.middlewares=redirect-to-https   # ← change to gzip
traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.rule=Host(`thegridnexus.com`) && PathPrefix(`/`)
traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.service=http-0-x2njvj4owio2rehys3l97m81
traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.entryPoints=http
traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.middlewares=redirect-to-https   # ← change to gzip
traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.rule=Host(`www.thegridnexus.com`) && PathPrefix(`/`)
traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.service=http-1-x2njvj4owio2rehys3l97m81
```

## 2. CORRECTED labels — paste these (http routers use `gzip`, no https-redirect)

```properties
traefik.enable=true
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

> The `https-0` / `https-1` routers (entryPoint `https`, LetsEncrypt certresolver) can stay
> unchanged — they only serve direct-HTTPS origin access, and the app nginx serves them
> without redirecting. Keep the `redirect-to-https` middleware definition **deleted** so it
> can't be re-applied by accident.

---

## 3. How the full Flexible flow works after this change

```
Browser ──https──▶ Cloudflare ──http:80 + CF-Ray + X-Forwarded-Proto: http──▶ Traefik (gzip) ──▶ nginx
   nginx: CF-Ray present ⇒ NO redirect ⇒ serve index.html  →  200 OK (site loads)
```

| Case | nginx decision (CF-Ray guard) | Result |
|---|---|---|
| `https://thegridnexus.com/` via CF | CF-Ray present → no redirect → serve | ✅ 200 |
| `https://www.thegridnexus.com/` via CF | still www block → 301 → non-www | ✅ single canonical hop |
| `http://thegridnexus.com/` via CF | CF-Ray present → serve | ✅ 200 |
| Direct origin `:80` (no CF-Ray) | guard → 301 → `https://thegridnexus.com` | ✅ single hop |
| Direct origin `:443` via Traefik https router | `X-Forwarded-Proto: https` → serve | ✅ 200 |

---

## 4. After applying

1. **Cold-redeploy** the app container (so it picks up the repo `nginx.conf` — CF-Ray guard,
   no 443 listener).
2. Apply the corrected labels above in Coolify → project → deployment → **Advanced**.
3. **Purge Cloudflare cache** (zone thegridnexus.com).
4. Verify:
   - `curl -sI https://thegridnexus.com/` → `200`, no `location:`
   - `curl -sI https://www.thegridnexus.com/` → single `301` → non-www → `200`
   - Open in an incognito browser — no "too many redirects".