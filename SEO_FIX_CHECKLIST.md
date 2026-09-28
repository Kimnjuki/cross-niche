# SEO/Audit Fix Checklist
Generated from thegridnexus.com_pages_20260901.csv

## P0 - Fix Immediately
- [x] ~~Fix canonicalization issues on article pages with "Canonical to other page"~~ — FIXED 2026-09-09 (`nginx.conf`: article static files now served via `try_files $uri $uri/index.html` — no more directory-index 301 loop; canonical URLs return 200)
- [x] ~~Add missing canonical tags to pages showing `-`~~ — FIXED for articles (`<link rel="canonical">` emitted in static article HTML)
- [x] ~~Fix HTTP to HTTPS redirect chains (302 responses on http:// URLs)~~ — FIXED 2026-09-09 (CF Flexible→870 loop resolved: Cloudflare Full + nginx CF-Ray guard + Traefik http routers no longer force-redirect)
- [x] ~~Ensure article pages are included in sitemap~~ — sitemaps list canonical `https://thegridnexus.com/article/<slug>`

## P1 - Fix This Week
- [ ] Improve ILR on low-scoring pages (/ai-pulse, article pages) — *content-level work needing live Search Console/Ahrefs data; structural prerequisites (JSON-LD, internal links, freshness) are now in place.*
- [x] ~~Add missing incoming internal links to article pages (orphan rescue)~~ — FIXED 2026-09-28: 76/101 articles, 12 author pages, 9 tool pages and 6 other indexable routes had ZERO inbound links. Fixes: (a) `buildRelatedLists()` coverage pass in `generate-static-articles.mjs` guarantees every article ≥1 inbound related-reading link; (b) `/editorial` shell lists all 12 author profiles; (c) `/tools` shell lists every indexable tool; (d) targeted hub links in `route-metadata.mjs` (`/news`→`/blog`, `/about`→`/roadmap`+`/nexus-studio`+`/mobile`, `/gaming`→`/research/state-of-gaming-security-2026`, `/explore`→`/nexus-intersection`). Result: **0 indexable orphans** — verify with `npm run audit:orphans`
- [x] ~~Add schema.org JSON-LD to pages missing it~~ — VERIFIED 2026-09-28: all 198 static pages (shells + articles) emit JSON-LD (`npm run audit:dist-meta` → 0 missing)
- [x] ~~Fix Open Graph tags on pages missing them~~ — VERIFIED 2026-09-28: all 198 static pages emit `og:title`/`og:description` + canonical + `<title>` (`npm run audit:dist-meta` → 0 missing)

## P2 - Fix This Month
- [ ] Reduce JS/CSS size on heavy pages
- [ ] Improve page load times for slow pages
- [x] ~~Add hreflang tags where needed~~ — DEFERRED by design: site is single-language (en-US); `SEOHead` supports hreflang once a localized locale ships.
- [x] ~~Fix any remaining validation issues~~ — `npm run validate:seo` 124/124 ✅, `npm run test:seo` 23/23 ✅, `npm run audit:consistency` 0 missing / 0 extra ✅ (2026-09-28). Note: `npm run lint` still reports 45 pre-existing errors in `src/` (React hooks deps, `require()` in vite.config.ts) unrelated to this SEO work.

## Verification Steps
- [ ] Re-crawl after the nginx.conf fix is deployed (Coolify redeploy required)
- [ ] Verify canonical article URLs return 200 (no redirects)
- [ ] Verify trailing-slash / http:// / www variants each return a single 301 to canonical (no loops)
- [x] ~~Check sitemap includes all article pages (canonical form)~~ — 101/101 in `sitemap-articles.xml`; `npm run audit:consistency` reports 0 missing / 0 extra vs prerender routes
- [ ] Verify no 302 chains remain

## Fix Log — 2026-09-11 (nginx edge layer, commit round 2)

- [x] **P1-3 (edge portion): scheme-downgrade redirect chains eliminated** — added `absolute_redirect off;` so every nginx 301/rewrite emits a RELATIVE `Location:` (e.g. `Location: /article/x`). Browsers resolve it against the current https edge scheme. Previously every redirect emitted `Location: http://...` (because `$scheme` is http behind Cloudflare Flexible / TLS-terminating proxy), producing https→http→https chains.
- [x] **Root cause of malformed crawler URLs found & fixed**: legacy rewrite `^/p/?(.*)$` → `/article/$1` had an OPTIONAL slash, so it swallowed every path starting with `/p`: `/podcasts` → `/article/odcasts`, `/pulse/nexus-pulse` → `/article/ulse/nexus-pulse`. The existing band-aid rewrites (`/article/odcasts → /podcasts`) then created a **ping-pong 301 loop** on real routes. Slashes are now required (`^/p/(.*)$`, `^/post/(.*)$`, `^/2026/(.*)$`); `/podcasts` and `/pulse/nexus-pulse` return 200 directly. Band-aid rewrites kept (single-hop cleanup of already-crawled malformed URLs).
- [x] **P0-3 (edge portion): single canonical article pattern enforced** — `~ ^/(tech|security|gaming)/([^/]+)/?$` now 301s niche-prefixed article URLs to `/article/<slug>` in ONE hop; `/gaming/security` and `/gaming/security-guides` are excluded (real pages, 200).
- [x] Validated in Docker (11/11 pass): canonical article 200/0 redirects; full `/security/<slug>` chain resolves to 200 in exactly 1 redirect; direct plain-HTTP clients still get single-hop 301 → https (CF-Ray guard intact); `nginx -t` syntax ok.
- [ ] **REDEPLOY REQUIRED** — Coolify must rebuild the image (Rolling Update / Force Rebuild if it says "Build step skipped") for these nginx fixes to go live.

## Fix Log — 2026-09-28 (route-metadata unification + orphan rescue)

- [x] **Single source of truth**: `scripts/lib/route-metadata.mjs` now feeds sitemaps, static shells, prerender routes, vite fallback, and tests. `getStaticPages()` in `generate-seo-sitemaps.mjs` derives from `INDEXABLE_ROUTES` + author profiles (stale hand-lists deleted).
- [x] **`robots.txt` `/auth` prefix bug fixed** — `/auth$` + `/auth/` are anchored so `/author/*` is no longer silently deindexed (explicit `Allow: /author/` added).
- [x] **Orphan rescue (P1)** — 0 indexable orphans (was ~101). See P1 entry above for the four fixes. New audits: `npm run audit:orphans`, `npm run audit:dist-meta`, `npm run audit:consistency`.
- [x] **Metadata coverage verified** — all 198 static pages emit JSON-LD, `og:title`, canonical and `<title>` (0 missing).
- [x] **News sitemap honesty** — empty `sitemap-news.xml` is no longer advertised in `sitemap-index.xml` (Google recommends not submitting empty sitemaps); `validate-site.mjs` checks are now conditional on entries; enforced by `test:seo` test 23.
- [x] **Validation green**: `validate:seo` 124/124, `test:seo` 23/23, `audit:consistency` 0/0, `type-check` clean, all edited scripts lint clean.
- [ ] **Remaining live-only verification**: Coolify redeploy, then canonical/trailing-slash/www variant spot checks and Ahrefs/GSC recrawl (Verification Steps above).
