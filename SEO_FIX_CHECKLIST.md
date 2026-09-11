# SEO/Audit Fix Checklist
Generated from thegridnexus.com_pages_20260901.csv

## P0 - Fix Immediately
- [x] ~~Fix canonicalization issues on article pages with "Canonical to other page"~~ — FIXED 2026-09-09 (`nginx.conf`: article static files now served via `try_files $uri $uri/index.html` — no more directory-index 301 loop; canonical URLs return 200)
- [x] ~~Add missing canonical tags to pages showing `-`~~ — FIXED for articles (`<link rel="canonical">` emitted in static article HTML)
- [x] ~~Fix HTTP to HTTPS redirect chains (302 responses on http:// URLs)~~ — FIXED 2026-09-09 (CF Flexible→870 loop resolved: Cloudflare Full + nginx CF-Ray guard + Traefik http routers no longer force-redirect)
- [x] ~~Ensure article pages are included in sitemap~~ — sitemaps list canonical `https://thegridnexus.com/article/<slug>`

## P1 - Fix This Week
- [ ] Improve ILR on low-scoring pages (/ai-pulse, article pages)
- [ ] Add missing incoming internal links to article pages (orphan rescue)
- [ ] Add schema.org JSON-LD to pages missing it
- [ ] Fix Open Graph tags on pages missing them

## P2 - Fix This Month
- [ ] Reduce JS/CSS size on heavy pages
- [ ] Improve page load times for slow pages
- [ ] Add hreflang tags where needed
- [ ] Fix any remaining validation issues

## Verification Steps
- [ ] Re-crawl after the nginx.conf fix is deployed (Coolify redeploy required)
- [ ] Verify canonical article URLs return 200 (no redirects)
- [ ] Verify trailing-slash / http:// / www variants each return a single 301 to canonical (no loops)
- [ ] Check sitemap includes all article pages (canonical form)
- [ ] Verify no 302 chains remain

## Fix Log — 2026-09-11 (nginx edge layer, commit round 2)

- [x] **P1-3 (edge portion): scheme-downgrade redirect chains eliminated** — added `absolute_redirect off;` so every nginx 301/rewrite emits a RELATIVE `Location:` (e.g. `Location: /article/x`). Browsers resolve it against the current https edge scheme. Previously every redirect emitted `Location: http://...` (because `$scheme` is http behind Cloudflare Flexible / TLS-terminating proxy), producing https→http→https chains.
- [x] **Root cause of malformed crawler URLs found & fixed**: legacy rewrite `^/p/?(.*)$` → `/article/$1` had an OPTIONAL slash, so it swallowed every path starting with `/p`: `/podcasts` → `/article/odcasts`, `/pulse/nexus-pulse` → `/article/ulse/nexus-pulse`. The existing band-aid rewrites (`/article/odcasts → /podcasts`) then created a **ping-pong 301 loop** on real routes. Slashes are now required (`^/p/(.*)$`, `^/post/(.*)$`, `^/2026/(.*)$`); `/podcasts` and `/pulse/nexus-pulse` return 200 directly. Band-aid rewrites kept (single-hop cleanup of already-crawled malformed URLs).
- [x] **P0-3 (edge portion): single canonical article pattern enforced** — `~ ^/(tech|security|gaming)/([^/]+)/?$` now 301s niche-prefixed article URLs to `/article/<slug>` in ONE hop; `/gaming/security` and `/gaming/security-guides` are excluded (real pages, 200).
- [x] Validated in Docker (11/11 pass): canonical article 200/0 redirects; full `/security/<slug>` chain resolves to 200 in exactly 1 redirect; direct plain-HTTP clients still get single-hop 301 → https (CF-Ray guard intact); `nginx -t` syntax ok.
- [ ] **REDEPLOY REQUIRED** — Coolify must rebuild the image (Rolling Update / Force Rebuild if it says "Build step skipped") for these nginx fixes to go live.
