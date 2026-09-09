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
