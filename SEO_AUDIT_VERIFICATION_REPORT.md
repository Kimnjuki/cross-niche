# The Grid Nexus — SEO Audit Verification Report

**Audit date:** 2026-11-18
**Scope:** Verification of the "Full SEO & Platform Audit" brief against the actual codebase and build output.
**Method:** Static analysis of source, configuration, and `dist/` output via [`scripts/audit-seo-current-state.mjs`](scripts/audit-seo-current-state.mjs:1).

---

## Executive summary

The audit brief describes a site with **unverified crawl infrastructure, mixed canonical hosts, truncated titles, and missing structured data**. Verification against the codebase shows a materially different picture.

**Most of the brief's priority technical findings are already resolved in this repository.** The canonical host is consistent, `robots.txt` and the XML sitemap are present and correctly wired, all 318 built pages self-canonicalise, titles and meta descriptions are unique, and Article / BreadcrumbList / FAQPage / HowTo JSON-LD are all implemented.

**Result: 0 blocking issues, 7 warnings, 23 passes.**

Reproduce with `npm run seo:audit` (exits non-zero on any blocking issue, so it is CI-ready).

The brief appears to have been written from an external crawl that could not reach the site's own files (it states robots.txt and sitemap.xml "could not be retrieved"). Several of its recommendations are therefore already implemented, and its remaining valid points are narrower than presented.

One genuine blocking issue was found and fixed during this audit: the `dist/` directory was a **partial build** missing 18 sitemap-submitted URLs. See [Finding 1](#1-blocking-resolved-partial-build-left-18-sitemap-urls-without-pages).

---

## Verification matrix

| # | Brief's claim | Verified status | Evidence |
|---|---|---|---|
| 1 | Canonical domain inconsistent (www + non-www in SERPs) | **Already resolved** | Non-www canonical in [index.html:58](index.html:58), [netlify.toml:7](netlify.toml:7), [nginx.conf:22](nginx.conf:22), [public/robots.txt:93](public/robots.txt:93), all sitemaps. Every `www` mention is a redirect *source*, never a destination. |
| 2 | robots.txt could not be retrieved | **Present and correct** | [public/robots.txt](public/robots.txt:1) — 38 Disallow, 2 Allow, `Sitemap:` directive on line 93. Author pages explicitly allowed for E-E-A-T. |
| 3 | sitemap.xml could not be retrieved | **Present and correct** | [public/sitemap.xml](public/sitemap.xml:1) 134 URLs, [public/sitemap-index.xml](public/sitemap-index.xml:1) declares both children, [public/sitemap-articles.xml](public/sitemap-articles.xml:1) 22 URLs. 0 off-canonical hosts, 0 trailing-slash duplicates. |
| 4 | Titles truncated / awkward ("Gaming Headset Privacy 2026: What Your \| The Grid Nexus") | **Not reproducible** | That exact title does not exist anywhere in the codebase. All 68 route titles are unique and ≤60 chars. |
| 5 | No page-level structured data | **Already implemented** | Article/NewsArticle, BreadcrumbList, FAQPage, HowTo, Organization, WebSite all present. |
| 6 | JavaScript may rewrite canonical away from HTML value | **Mitigated** | Prerendered shells self-canonicalise and strip the legacy injector ([generate-static-route-shells.mjs:281](scripts/generate-static-route-shells.mjs:281)). All 318 built pages verified self-referencing. |
| 7 | Duplicate-content risk from non-preferred URL variants | **Already resolved** | nginx has ~40 permanent redirects for aliases, misspellings, trailing slashes, and legacy paths. |
| 8 | Weak internal linking from articles | **Already resolved** | 118/118 built article pages link to a hub, a tool, a recovery/platform page, and 2+ related articles. |
| 9 | Core Web Vitals unaudited | **Partially valid** | Image handling is correct (lazy, `decoding="async"`, `fetchPriority`), but 15.9 MB of unoptimised raster assets is a real LCP risk. See [Finding 4](#4-warning-159-mb-of-unoptimised-cover-images). |
| 10 | Thin hub pages (Gaming Security, Security Grades, Threat Report, Checkup, Guides) | **Already resolved** | All exist as real landing pages with unique titles and 88–658 words of body copy. |
| 11 | Insufficient platform coverage | **Partially valid** | Steam, Xbox, PlayStation, Discord hubs exist (267–331 words). Nintendo, Epic, Roblox, Riot, Battle.net are absent. See [Finding 6](#6-warning-platform-cluster-gaps). |

---

## Findings

### 1. BLOCKING (resolved): Partial build left 18 sitemap URLs without pages

**Symptom:** `public/sitemap.xml` submitted 134 URLs, but `dist/` contained no page for 18 of them — including `/threats` and all 16 `/safety/*` verdict pages.

**Root cause:** The `dist/` directory was a stale, partial build. The `npm run build` chain includes `generate:safety-pages` and `generate:threat-page` ([package.json:11](package.json:11)), but neither had run against this `dist/`. The generators themselves are functional.

**Impact if shipped:** Google Search Console would report 18 "Submitted URL not found (404)" errors, and the entire "is this safe?" verdict cluster — the site's most differentiated asset — would be invisible.

**Resolution:** Ran `node scripts/generate-safety-pages.mjs` (17 pages) and `node scripts/generate-threat-page.mjs` (60 threats). Re-audit confirms **all 134 sitemap URLs now have a built page**.

**Follow-up required:** Ensure the deploy pipeline never publishes a `dist/` where the sitemap outruns the build. A CI check comparing sitemap `<loc>` entries against built files would catch this permanently.

---

### 2. WARNING: Empty news sitemap, undeclared in the index

[public/sitemap-news.xml](public/sitemap-news.xml:1) is a valid but **empty** `<urlset>` — zero URLs. It is also **not declared** in [public/sitemap-index.xml](public/sitemap-index.xml:1), so it is currently orphaned.

**Cause:** [`scripts/generate-news-sitemap.mjs`](scripts/generate-news-sitemap.mjs:5) only includes articles from the last 48 hours and requires a live Convex connection. With no recent publishes, it emits nothing.

**Assessment:** Low severity. An empty news sitemap is harmless, and Google News sitemaps only matter for a news-vertical strategy. **Recommendation:** either populate it on each publish, or remove the file and its netlify header to avoid a dangling artefact. Do not add it to the sitemap index while it is empty.

---

### 3. WARNING: 75 article titles exceed 60 characters

75 of 118 built article titles exceed the 60-character SERP truncation threshold, ranging 63–70 characters.

**Cause:** [`buildTitle()`](scripts/generate-static-articles.mjs:92) deliberately trades brand suffix for topic completeness. When `base.length + brand.length > 60`, it returns the untruncated base if it is ≤70 chars, else truncates at 65. The comment explains this was a deliberate fix — amputating titles to fit the brand was removing the words Google matches and searchers click.

**Assessment:** This is a **defensible trade-off, not a defect**. Google renders ~60 characters for desktop and ~50 for mobile, so titles in the 63–70 range will truncate. However, the truncation lands on low-value trailing words in most cases, and the alternative (cutting the topic) is worse for relevance.

**Recommendation:** Rather than shortening, add `metaTitle` overrides for the ~20 highest-impression articles so the most valuable queries get hand-tuned titles. Leave long-tail articles as-is.

---

### 4. WARNING: 15.9 MB of unoptimised cover images

Nine raster assets in `dist/assets/` exceed 400 KB, totalling 15.9 MB across 12 images:

| Asset | Size |
|---|---|
| `networking.jpg` | 3.0 MB |
| `cyber.jpg` | 2.6 MB |
| `network.jpg` | 2.2 MB |
| `tech.jpg` | 2.2 MB |
| `motherboard.jpg` | 1.4 MB |
| `abstract.jpg` | 1.4 MB |

These are actively served as article cover images via [`src/lib/placeholderImages.ts`](src/lib/placeholderImages.ts:11).

**Assessment:** This is the **most impactful remaining performance issue**. A 2.6 MB hero JPEG on a mobile connection is a near-certain LCP failure. The rendering code is already correct — `loading="lazy"`, `decoding="async"`, and `fetchPriority` are all in place — so the bottleneck is purely asset weight.

**Recommendation:** Convert these to WebP/AVIF at ~1200px width. The repo already has a working precedent: article images ship as `.webp` alongside `.png` (e.g. `mobile-gaming-security-hero.webp` at 48 KB vs 1,010 KB PNG — a 21× reduction). Applying the same treatment to the 12 theme images would cut ~15 MB to under 1 MB.

---

### 5. WARNING: 547 KB main JS chunk

One chunk (`index-*.js`) exceeds 500 KB. Total JS is 2.8 MB across 215 files, so the entry chunk is the outlier rather than the aggregate.

**Recommendation:** Inspect the chunk for accidentally-eager imports (heavy editors, charting libraries, PDF tooling). Route-level code splitting is already working — 215 chunks means most routes are isolated.

---

### 6. WARNING: Platform cluster gaps

Built and verified: Steam (331 words), Xbox (267), PlayStation (288), Discord (312).

**Missing:** Nintendo, Epic Games, Roblox, Riot, Battle.net, and mobile app stores. These are absent from both the build and the sitemap, so there is no 404 risk — but they represent genuine coverage gaps against the brief's hub-and-spoke model.

**Assessment:** The brief lists these as required clusters. Given the site's positioning ("the trust layer for gamers"), Roblox and Epic are the highest-value additions — Roblox for the child-player/parental-control angle, Epic for the free-game scam surface.

---

### 7. WARNING: Runtime meta injection still present in 5 source files

[`src/components/seo/SEOHead.tsx`](src/components/seo/SEOHead.tsx:186) still rewrites `document.title`, upserts meta tags, and reassigns `canonicalLink.href` in a `useEffect` (line 263). It also removes all existing JSON-LD scripts (line 275).

**Assessment:** This is the exact pattern Google warns about — client-side canonical rewriting. **However, verification shows it is currently safe:** all 318 built pages ship a correct self-referencing canonical in the initial HTML, and [`generate-static-route-shells.mjs`](scripts/generate-static-route-shells.mjs:281) strips the legacy runtime injector from prerendered shells.

**Residual risk:** The runtime path is still live for any route not covered by prerendering. If `SEOHead` ever computes a different canonical than the HTML (e.g. a cross-domain override, or a route missing from its map), Google would see the rewritten value.

**Recommendation:** Make `SEOHead` refuse to change a canonical that already exists in the served HTML — read the existing value first and only fill it when absent. This converts a latent risk into a structural guarantee.

---

### 8. INFO: 51 sitemap URLs missing `<lastmod>`

51 of 134 URLs in [public/sitemap.xml](public/sitemap.xml:1) have no `<lastmod>`. Optional per the sitemap protocol, but it is a freshness signal Google uses for crawl prioritisation.

**Recommendation:** Backfill from content `updatedAt` where available. Low priority.

---

## Prioritised fix list

### P0 — Do before next deploy
1. **Guarantee a complete build.** Add a CI step that fails when any `sitemap.xml` `<loc>` has no corresponding file in `dist/`. This is the failure mode that produced Finding 1 and it will recur silently.
2. **Compress the 12 theme images** to WebP at ~1200px. ~15 MB → <1 MB. Largest single CWV win available.

### P1 — Within 30 days
3. **Harden `SEOHead`** so it never overwrites an existing server-rendered canonical.
4. **Add `metaTitle` overrides** for the top ~20 articles by impressions to bring high-value titles under 60 chars.
5. **Resolve the news sitemap** — populate on publish or delete the artefact.

### P2 — Within 90 days
6. **Build the missing platform hubs:** Roblox and Epic first, then Nintendo, Riot, Battle.net, mobile app stores.
7. **Backfill `<lastmod>`** on the 51 sitemap URLs missing it.
8. **Investigate the 547 KB entry chunk** for eager imports that should be lazy.

### Not required (already done)
- Canonical host selection and 301 redirects — complete across netlify, nginx, and HTML.
- robots.txt and XML sitemap publication — complete and correctly cross-referenced.
- Unique titles and meta descriptions — complete for all 68 routes.
- JSON-LD for Organization, WebSite, Article, BreadcrumbList, FAQPage, HowTo — complete.
- Dedicated hub landing pages — complete for Gaming Security, Security Grades, Methodology, Checkup, Guides, Recovery.
- Article internal linking to hubs, tools, and recovery — complete on 118/118 pages.

---

## What the brief got right

The strategic analysis is sound and the codebase largely validates it:

- **The "trust layer for gamers" positioning is already implemented**, not just aspirational. Security grades, a threat console, a security checkup tool, recovery playbooks, and a 16-page "is it safe?" verdict database all exist as real, crawlable pages.
- **Topical dilution is the real risk.** The article corpus mixes gaming-security content with broad AI/enterprise/hardware coverage. The gaming-security hub is well-built; the problem is that general technology articles sit in the same index and compete for the same topical authority.
- **E-E-A-T infrastructure exists** — named authors with bio pages, an editorial-standards page, a corrections page, a methodology page, and a disclosure page are all built and crawlable.

The brief's 30/60/90 roadmap is reasonable, but its Days 1–30 "technical stabilization" phase is largely already complete in this repository. The highest-value remaining work is **asset compression (P0.2)** and **topical separation of gaming-security from general technology coverage**.

---

## Reproducing this audit

```bash
node scripts/audit-seo-current-state.mjs
```

Exits non-zero if any blocking issue is found. Checks: canonical host consistency, redirect coverage, robots.txt and sitemap wiring, sitemap hygiene, title/meta completeness and uniqueness, JSON-LD coverage, client-side meta injection, prerender coverage, built-output canonical verification, noindex directives, article internal linking, title quality, image and JS weight, asset caching, and sitemap-vs-build parity.