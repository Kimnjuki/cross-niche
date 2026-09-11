# The Grid Nexus — Ahrefs Audit Fix Checklist
Extracted from: Ahrefs audit, 26 Aug 2026
Source: thegridnexus.com_pages_20260901.csv + PDF summary

## Active Errors (non-zero counts)
- [x] **Redirect loop — 1 page** — FIXED 2026-09-09 (site-wide `.html`→loop was broken by CF/Traefik; article-URL loop fixed in `nginx.conf` by serving `dist/article/{slug}/index.html` via `try_files $uri $uri/index.html /index.html` instead of `$uri/` which triggered nginx's directory-index 301)
- [x] **3XX redirect in sitemap — 42 URLs** — FIXED 2026-09-09: article URLs now return 200 directly; sitemap contains only canonical `https://thegridnexus.com/article/<slug>` (no http://, no trailing slash, non-www)
- [x] **Canonical points to redirect — 38 pages** — FIXED: static article HTML emits `<link rel="canonical" href="https://thegridnexus.com/article/<slug>">` to a URL that now returns 200 with 0 redirects
- [x] **Duplicate pages without canonical — 104 pages** — RESOLVED for articles (canonical served in static HTML); see "Pages to re-verify" below
- [ ] Orphan pages (no incoming internal links) — 32 pages
- [ ] Re-crawl after deploy (pending live deploy of the nginx.conf fix)

## Pages to re-verify after redeploy
- Canonical no-slash article URLs (`/article/<slug>`) → must be **200 / 0 redirects**
- Trailing-slash article URLs (`/article/<slug>/`) → single 301 to canonical, no chain
- `http://` and `www` variants → single 301 to canonical, no chain
- Root + category pages → 200

## Execution Order
1. ~~Redirect loop~~ ✅ (fixed — CF Full + nginx CF-Ray guard + article `$uri/index.html`)
2. ~~Sitemap 3XX cleanup~~ ✅ (sitemaps already emit canonical URLs; article pages now 200)
3. ~~Canonical → redirect fixes~~ ✅
4. ~~Duplicate pages without canonical~~ ✅ for articles (re-crawl to confirm)
5. Orphan pages (internal linking strategy — add more article cross-links)

## Verification
- [ ] Re-run `npm run validate:seo` after each batch
- [ ] Re-crawl in Ahrefs after deploy
- [ ] Confirm 0 redirect-loop, 0 sitemap 3XX, 0 canonical→redirect

## 2026-09-11 update: fixed nginx ^/p/?(.*)$ over-broad legacy rewrite (caused /podcasts + /pulse ping-pong loops and malformed /article/odcasts, /article/ulse/* URLs) and added absolute_redirect off (relative Location = no scheme-downgrade chains). Edge 301s for niche-prefixed article URLs added. Docker-validated 11/11. Redeploy required.
