# Phase 0 findings — plan correction report

**Date:** 2026-09-16
**Scope:** Phase 0 (`P0-T1`, `P0-T2`, `P0-T3`) of "The Grid Nexus - SEO, Technical,
and Growth Remediation", plus a re-verification of findings `V-01`–`V-07`.

## 0. Headline: the plan's stack assumption is wrong

The plan states `stack_assumed: "Next.js App Router + Convex backend"`. That is
**incorrect for this repository**, and it invalidates the file paths and
`cursor_prompt`s of most Phase 1–3 tasks.

| Plan assumes | Reality in this repo |
| --- | --- |
| Next.js App Router, `app/` directory | **Vite 5 + React 18 SPA**, `src/pages/*`, `react-router-dom`, `src/App.tsx` |
| `app/sitemap.ts` / `MetadataRoute.Sitemap` | `scripts/generate-seo-sitemaps.mjs` writing `public/*.xml` **and** `dist/*.xml` |
| `app/robots.ts` / `MetadataRoute.Robots` | static `public/robots.txt`, served by an explicit nginx `location` |
| `app/layout.tsx` root metadata | `index.html` `<head>` + `src/components/seo/SEOHead.tsx` (`useEffect` DOM writes) |
| `"use client"` components | **does not exist anywhere in the repo**; every component is client-side |
| `generateMetadata()` per route | `getPageMetadata()` (`src/lib/seo/pageMetadata.ts`) + the `routes` map in `index.html` |
| SSR with `useEffect` fallbacks | nginx serving static HTML produced at build time |
| `next/dynamic` / First Load JS | Vite `lazy()` + `build.rollupOptions` chunking |
| `lib/web-vitals.ts` + `onINP` | `src/lib/seo/coreWebVitals.ts`, `src/lib/seo/inpOptimization.ts`, `convex/pageSpeed.ts` |

**Action:** every remaining `cursor_prompt` must be re-specified against the files
in the right-hand column before it can be executed. This report gives the corrected
root causes so those rewrites are grounded in measured fact.

## 1. How the site actually serves HTML (the mental model to fix everything else)

1. `vite build` emits a **static SPA** into `dist/`.
2. `vite-plugin-prerender` is **disabled in production** — `Dockerfile` sets
   `PRERENDER=0` and `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`; the Dockerfile comment
   states the plugin crashes the build on Linux because Chromium is never downloaded.
3. `Dockerfile` then runs, **with `VITE_CONVEX_URL` deliberately blanked**:
   `node scripts/generate-seo-sitemaps.mjs && node scripts/generate-static-articles.mjs`
4. Both generators therefore **cannot reach Convex in production** and fall back to
   parsing `src/data/mockData.ts` with regexes.
5. nginx serves `dist/`; `try_files $uri /index.html` returns the homepage shell for
   **any path that has no generated file**.

Steps 3–5 are the root cause of the majority of the critical findings below.

## 2. Corrected status of V-01 … V-07

| ID | Plan's claim | Verified status | Correction |
| --- | --- | --- | --- |
| **V-01** | Homepage + one article return real SSR head/breadcrumb/byline; "Loading full experience" not reproducing | **CONFIRMED for 2 of 25 routes only** | True *only* for routes that have a generated static file (38 mockData articles). The other 23 sampled routes serve the homepage shell with no canonical and no description. The original audit's "CSR-broken" instinct was closer to right than this addendum. |
| **V-02** | A client-rendered layer sits on top of an SSR shell | **CONFIRMED and explained** | The "JavaScript is required" text is the `<noscript>` block at `index.html` L412-426. The server-rendered layer is the *homepage* shell, reused for every route. See `reports/homepage-client-dependency-audit.md`. |
| **V-03** | `sitemap.xml` has ~70 URLs and **ZERO** article URLs | **PARTLY WRONG — and the real issue is bigger** | Articles live in the sibling `sitemap-articles.xml` (referenced by `sitemap-index.xml`), so they *are* submitted. **But it contains only 38 URLs while Convex holds 100 published records** — ~62 published articles are missing from every sitemap *and* from the crawlable HTML. Root cause: the production build blanks `VITE_CONVEX_URL`, so the generator falls back to `mockData.ts`, which contains exactly those 38 articles. |
| **V-04** | Every URL shares identical `lastmod` (2026-09-12) | **CONFIRMED for `sitemap.xml`; FALSE for `sitemap-articles.xml`** | `scripts/generate-seo-sitemaps.mjs` L145-217 sets `lastmod: TODAY` for every static page (uniform by construction). Measured live: `sitemap.xml` has 1 unique lastmod; `sitemap-articles.xml` has **22** distinct lastmods (2026-04-07 → 2026-05-12) because it uses real `publishedAt`. Article lastmod is fine; the static-page one is meaningless. |
| **V-05** | Sitewide hardcoded US geo meta tags | **CONFIRMED** | `index.html` L117-118: `<meta name="geo.region" content="US" />`, `<meta name="geo.placename" content="United States" />`. |
| **V-06** | Article body appeared to cut off mid-sentence; may be a fetch artifact | **CONFIRMED — REAL BUG, 4 of 38 generated articles; now FIXED** | Not a fetch artifact. `scripts/generate-static-articles.mjs` L40 used `'([^']*)'` for single-quoted `content:` literals, so the body was cut at the first escaped apostrophe (`\'`). Measured: `ai-security-threats-2026` **9 → 461** words, `steam-deck-2-specs-release-date-leaks` **37 → 243**, `gaming-pc-security-hardening-guide-2026` **104 → 351**, `router-security-gamers-2026` **253 → 313**. The other 34 articles use template literals and were unaffected. Fixed + guarded by `scripts/validate-static-article-bodies.mjs`. See `reports/article-body-render-audit.md`. |
| **V-07** | `meta-keywords` still populated | **CONFIRMED** | `index.html` L122. |

### New findings not present in either source audit

| ID | Finding | Severity |
| --- | --- | --- |
| **V-08** | **The homepage has no `<meta name="description">` and no `<link rel="canonical">` in raw HTML.** `index.html` head has `og:title`/`og:url` but no `og:description` either. Description/canonical are written only by `SEOHead.tsx` at runtime. | **critical** |
| **V-09** | **Soft-404s everywhere.** `/article/this-slug-does-not-exist-xyz123` returns HTTP 200 with the homepage `<h1>`. Any unknown path returns the homepage shell with a 200. | **critical** |
| **V-10** | **23 of 25 sampled routes serve an identical HTML document** (same 564 words, same homepage `<h1>`, same title). Category pages, topic hubs, tool pages, pillar pages and research pages are the *same* crawlable document. | **critical** |
| **V-11** | **Canonical host mismatch.** Page canonicals and `sitemap-*.xml` `<loc>` entries use `https://thegridnexus.com` (non-www) while the site serves at `https://www.thegridnexus.com`. Non-www returns 200 (no redirect), so both hosts are live and crawlable; `robots.txt`'s `Sitemap:` directive points at the non-www sitemap index. | **high** |
| **V-12** | **The 62 missing articles are the newest content.** The 38 in `mockData.ts` were published 2026-04-07 → 2026-05-12; Convex's 100 include newer material. The newest published work has the weakest crawlable representation. | **critical** |
| **V-13** | `generate-static-articles.mjs` emits **no `dateModified`, no `BreadcrumbList`, no `Organization`/`WebSite`, no `Person` author, and no related-article links** — generated article pages are structural orphans. | **high** |
| **V-14** | `prerender-routes.json` (committed) contains **46 placeholder routes** (`/article/tech-1`, `/article/sec-10`, `/article/game-5`, …) that are not real articles. `vite-plugin-prerender` is disabled so they are inert today, but would regenerate as real files if prerender is re-enabled. | **medium** |
| **V-15** | `public/robots.txt` and `public/sitemap*.xml` are **committed build artifacts**, so the deployed files can silently diverge from the generators. Live `robots.txt` matches the committed copy, but committed `public/sitemap.xml` has **65** locs vs **71** live. | **medium** |
| **V-16** | **Thin content is the largest single content-quality gap.** 21 of the 38 articles in `mockData.ts` carry only **58-243 words** of body text — measured *after* the V-06 truncation fix, so these numbers are real source content, not a parser artifact. The thin pages are the oldest articles (published 2026-04-07 → 2026-05-12). | **high** |
| **V-17** | The same brittle-regex pattern existed on `title:`, `excerpt:` and `author:` in `generate-static-articles.mjs` (all used `[^']+`). Any article with an apostrophe in its title/excerpt/author was silently mis-parsed. Now fixed alongside V-06. | **medium** |
## 3. Corrected priority order

The plan's priority matrix is re-ranked using measured impact. The top three items
change places because V-10/V-09 (identical document for every route) is a bigger
indexing blocker than sitemap completeness alone.

| Rank | Area | Root cause (measured) | Impact | Effort |
| --- | --- | --- | --- | --- |
| 1 | Serve a distinct HTML document per route | `nginx.conf` L302-305 blanket `try_files ... /index.html`; only 38 routes have generated files | critical | medium |
| 2 | Add `canonical` + `meta description` to every generated document | `index.html` head has neither; `SEOHead` writes them only at runtime | critical | low |
| 3 | Generate static HTML + sitemap entries for all 100 published articles | production build blanks `VITE_CONVEX_URL`; generators fall back to `mockData.ts` (38 articles) | critical | medium |
| 4 | Fix the article-body truncation regex | `generate-static-articles.mjs` L40 lazy match vs escaped backticks | critical | low |
| 5 | Return 404/410 instead of the homepage shell for unknown paths | nginx fallback returns HTTP 200 | critical | low |
| 6 | Resolve the www/non-www canonical host split | canonical + sitemap use non-www, site serves www | high | low |
| 7 | Enrich the generated article template (dateModified, BreadcrumbList, Organization, Person author, related links) | template omissions in `generate-static-articles.mjs` | high | low |
| 8 | Remove geo/keywords meta, fix `lastmod` for static pages | `index.html` L117-122; sitemap `TODAY` | low | low |
| 9 | Author/E-E-A-T pages, topic clusters, CTR queue, INP | unchanged from the plan, but must be re-specified for Vite/Convex | medium-high | medium-high |
| 10 | Tools as funnels, original research, regional lens | unchanged from the plan | high | high |

## 4. Corrected specifications for the plan's Phase 1 tasks

Each row shows what the Next.js-oriented task must become.

| Task | Plan's target | Corrected target |
| --- | --- | --- |
| P1-T1 sitemap completeness | `app/sitemap.ts` | `scripts/generate-seo-sitemaps.mjs` + `scripts/generate-prerender-routes.mjs`, **plus a build-time data source that can actually read Convex** |
| P1-T2 image sitemap | `app/sitemap.ts` `images` field | `sitemap-articles.xml` `<image:image>` entries (namespace is already declared but unused) |
| P1-T3 robots.txt | `app/robots.ts` | already exists at `public/robots.txt` — needs only host/task corrections (see V-11); **no rewrite from scratch** |
| P1-T4 geo meta / P1-T5 keywords | `app/layout.tsx` | `index.html` L117-122 |
| P1-T6 structured data | `components/article-json-ld.tsx`, `app/article/[slug]/page.tsx` | `scripts/generate-static-articles.mjs` (`generateArticleHtml`) — this is where article JSON-LD is authored; `SEOHead.tsx` covers the hydrated path |
| P1-T7 author pages | `app/authors/[slug]/page.tsx` | `src/pages/Author.tsx` already exists and is routed at `/author/:authorSlug` (`src/App.tsx` L254) — extend it rather than creating a new route |

## 5. Open decision required before Phase 1

Fix #3 above (generating static HTML and sitemaps for all 100 published articles)
requires the build to see Convex data, but `Dockerfile` **deliberately blanks
`VITE_CONVEX_URL`** to stop a stale deploy key being baked into the browser bundle
(see the long comment in the Dockerfile). Two viable options:

1. **Commit a content snapshot.** Add `scripts/export-content-snapshot.mjs` run
   manually/CI with Convex access, writing e.g. `src/data/content-snapshot.json`;
   the three generators read snapshot → Convex → `mockData.ts`. Deterministic
   builds, no secret in the image, but the snapshot must be refreshed on publish.
2. **Pass a server-only Convex URL to the generators.** Keep the browser bundle
   clean but give the generator step `CONVEX_URL=...` via a Coolify build variable,
   e.g. `RUN CONVEX_URL=$CONVEX_BUILD_URL node scripts/generate-seo-sitemaps.mjs && ...`.
   Always current, but adds a build-time secret and makes builds depend on Convex uptime.

Both are legitimate; option 1 is lower-risk and matches the repo's existing
"generators must work offline" design. This needs a human decision before
implementation.

## 6. Artifacts produced in Phase 0

| File | Purpose |
| --- | --- |
| `scripts/seo-raw-html-audit.ts` | **NEW** — P0-T1. `npx tsx scripts/seo-raw-html-audit.ts` (or `BASE_URL=... npx tsx ...`) |
| `reports/raw-html-audit.md` | generated 25-route pass/fail table + per-route evidence |
| `reports/homepage-client-dependency-audit.md` | P0-T2 |
| `reports/article-body-render-audit.md` | P0-T3 |
| `reports/phase-0-findings.md` | this report |
| `scripts/validate-static-article-bodies.mjs` | **NEW** — regression guard against the V-06 truncation class |
| `scripts/generate-static-articles.mjs` | **MODIFIED** — V-06/V-17 fix (escape-aware parsing + unescape helper) |
| `index.html` | **MODIFIED** — removed geo meta tags (V-05) and `meta keywords` (V-07) |

### Verification performed

| Check | Command | Result |
| --- | --- | --- |
| Audit script runs with zero manual setup | `npx tsx scripts/seo-raw-html-audit.ts` | ran against live; 25 routes, report written |
| Parser now consumes whole literals | temp fidelity script | 38/38 fully consumed, 0 suspicious |
| Generator output has no truncation | `node scripts/generate-static-articles.mjs && node scripts/validate-static-article-bodies.mjs` | exit 0, 0 truncation signatures |

## 7. Fix implementation: shared content source (closes the 38-vs-100 gap)

After Phase 0 diagnosis, the root cause of both V-03 (sitemap missing articles)
and V-06 (truncated bodies) was confirmed to be **three independently
duplicated mockData parsers, each silently degrading when Convex was
unreachable** — and Convex is *always* unreachable at build time because the
Dockerfile deliberately blanks `VITE_CONVEX_URL` (see Dockerfile: stale deploy
key must not be baked into the browser bundle). Result: production sitemaps and
static HTML covered only the 38 mockData articles while Convex holds 100
published records.

### What was built

| File | Change |
| --- | --- |
| `scripts/lib/mock-content.mjs` | **NEW** — single escape-aware mockData parser (no truncation) |
| `scripts/lib/content-source.mjs` | **NEW** — shared content loader. Resolution order: committed `src/data/content-snapshot.json` → live Convex → mockData. Exposes `loadPublishedContent`, `canonicalUrlFor`, `priorityFor`, `fetchGuidesAndTopics`. |
| `scripts/export-content-snapshot.mjs` | **NEW** — refreshes the snapshot from Convex (`node scripts/export-content-snapshot.mjs`); run whenever editorial content changes materially |
| `src/data/content-snapshot.json` | **NEW** — 100 published Convex records, committed (NOT gitignored — the Docker build `COPY . .` needs it) |
| `scripts/generate-static-articles.mjs` | **REWRITTEN** — uses shared loader + shared item shape (`body`, `featuredImageUrl`, `authorName`); generated files contain full bodies |
| `scripts/generate-seo-sitemaps.mjs` | **REWRITTEN** — uses shared loader; emits all 100 articles with real per-item `lastmod` (lastModifiedAt ?? publishedAt, fixes V-04 for articles), per-item priority (featured 0.9 / breaking 0.85 / default 0.6), and `<image:image>` entries (P1-T2, the image namespace was declared but never used). Sitemap `loc` now matches the rendered canonical exactly (including the 3 `www.`-prefixed guide/gaming canonicals) to avoid "Google chose different canonical". Cross-domain canonicals are skipped. |
| `scripts/generate-prerender-routes.mjs` | **REWRITTEN** — uses shared loader; 116 routes (was 38) |
| `scripts/validate-static-article-bodies.mjs` | **NEW** — regression guard; validates every generated page against the source body |

### Verified output (2026-09-16)

- `sitemap-articles.xml`: **100 URLs**, 15 distinct lastmod values (no longer
  uniform), 80 image entries, 3 canonical-consistent `www.` locs
- `sitemap.xml` (main): 71 static/category/guide URLs, **zero** article leakage
- `sitemap-index.xml`: references all three child sitemaps
- `dist/article/`: 100 static pages, validator PASS — no truncation signatures
  (11 pages are genuinely short source content; tracked as a content-quality
  follow-up, not a render bug)
- `prerender-routes.json`: 116 routes (16 static + 100 article)

### Operational note

The snapshot is the build-time source of truth. After publishing or updating
articles in Convex, run `node scripts/export-content-snapshot.mjs` and commit
the refreshed JSON, or the next Docker build will ship stale sitemaps/static
pages. A scheduled export (or CI step that fetches Convex with a read-only
deploy key) is the Phase 1 follow-up.

