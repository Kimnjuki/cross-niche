# Homepage / sitewide client-dependency audit (P0-T2)

**Date:** 2026-09-16
**Target:** https://www.thegridnexus.com
**Related plan findings:** V-02, V-01
**Deliverable:** P0-T2 — "Identify which homepage sections require client JS"

> **Stack correction (important).** The execution plan says
> `stack_assumed: Next.js App Router + Convex`. That is wrong for this repo.
> The app is a **Vite 5 + React 18 SPA** (`src/App.tsx`, `react-router-dom`) with a
> **Convex** backend, served as static files by **nginx** from `dist/`.
> `vite-plugin-prerender` is present but **disabled in production**
> (`Dockerfile`: `PRERENDER=0`, `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`).
> Therefore there are **zero Server Components, no `"use client"` directives, and
> no `app/` directory**. Every React component is client-only. The only
> server-rendered HTML is a hand-written `#static-shell` in `index.html` plus the
> per-article HTML emitted by `scripts/generate-static-articles.mjs`.
>
> This means "is it SSR-safe?" is the wrong question for this repo. The correct
> question — asked and answered below — is: **what does a non-JS crawler actually
> receive for each route?**

## 1. How routing/HTML is actually produced

| Layer | File | What it contributes to the no-JS HTML |
| --- | --- | --- |
| Static shell (all routes) | `index.html` L266-409 | nav, `<h1>` "The Grid Nexus – Tech, Security & Gaming News", a hardcoded "Latest Coverage" list of ~10 article cards, a large link farm |
| nginx fallback | `nginx.conf` L302-305 | `location / { try_files $uri /index.html; }` — **any route without its own HTML file receives the homepage shell** |
| nginx article fallback | `nginx.conf` L278-280 | `location ^~ /article/ { try_files $uri $uri/index.html /index.html; }` |
## 2. Client dependency inventory

All of the following are `useQuery`-fed client components with **no server-provided
initial data** and **no non-JS fallback of their own**, imported (transitively) into
the homepage tree rooted at `src/pages/Index.tsx` (`<Route path="/" element={<Index />} />`,
`src/App.tsx` L178).

| Component | File | Renders unique text? | Non-JS fallback? | Recommendation |
| --- | --- | --- | --- | --- |
| `Index` (homepage) | `src/pages/Index.tsx` | Yes — titles, excerpts, counts | Partial: `index.html` hardcodes ~10 cards | **Needs generated server fallback** |
| `HeroCommandCenter` | `src/components/home/HeroCommandCenter.tsx` | Yes | No | Server fallback for headline/lede; interactive tabs may stay client |
| `CommandDashboard` | `src/components/home/CommandDashboard.tsx` | Yes (counters) | No | Keep client-only (counters are not unique content) |
| `BreakingNewsTicker` | `src/components/home/BreakingNewsTicker.tsx` | Yes (headlines) | No | **Needs server fallback** — high-value crawlable content |
| `BriefingsGrid` | `src/components/home/BriefingsGrid.tsx` | Yes | No | **Needs server fallback** |
| `SpotlightStrip` | `src/components/home/SpotlightStrip.tsx` | Yes | No | **Needs server fallback** |
| `GamingStrip` | `src/components/home/GamingStrip.tsx` | Yes | No | **Needs server fallback** |
| `AIMiniStrip` | `src/components/home/AIMiniStrip.tsx` | Yes | No | **Needs server fallback** |
| `DenseListFeed` | `src/components/home/FeedLayouts.tsx` | Yes | No | **Needs server fallback** |
| `SecurityRankWidget` | `src/components/home/SecurityRankWidget.tsx` | Yes (rankings) | No | Server fallback for rank names/scores |
| `ThreatIntelWidget` | `src/components/home/ThreatIntelWidget.tsx` | Yes (CVE/threat text) | No | Server fallback |
| `NewsFeed` | `src/components/news/NewsFeed.tsx` | Yes | No | **Needs server fallback** |
| `NexusTerminal` | `src/components/home/NexusTerminal.tsx` | No (interactive) | n/a | **Keep client-only** |
| `NexusGuardWidget` | `src/components/home/NexusGuardWidget.tsx` | No (interactive) | n/a | **Keep client-only** |
| `SecurityAuditWidget` | `src/components/home/SecurityAuditWidget.tsx` | No (interactive) | n/a | **Keep client-only** |
| `EnhancedSearch` | `src/components/search/EnhancedSearch.tsx` | No (input) | n/a | **Keep client-only** |
| `NewsletterForm` | `src/components/newsletter/NewsletterForm.tsx` | No (form) | n/a | **Keep client-only** |
## 3. What a non-JS crawler actually gets (measured — see `reports/raw-html-audit.md`)

| Route | H1 | canonical | meta description | Served its own shell? |
| --- | --- | --- | --- | --- |
| `/` | homepage H1 | **MISSING** | **MISSING** | (baseline) |
| `/tech`, `/security`, `/gaming`, `/news`, `/explore` | homepage H1 | **MISSING** | **MISSING** | **No — homepage shell** |
| `/topics`, `/guides`, `/tools`, `/about`, `/privacy`, `/terms`, `/roadmap` | homepage H1 | **MISSING** | **MISSING** | **No — homepage shell** |
| `/security-score`, `/breach-sim`, `/live-threat-dashboard`, `/ai-pulse` | homepage H1 | **MISSING** | **MISSING** | **No — homepage shell** |
| `/pillar/gaming-security`, `/research/state-of-gaming-security-2026` | homepage H1 | **MISSING** | **MISSING** | **No — homepage shell** |
| `/article/<slug>` present in `mockData.ts` (38 routes) | own H1 | present | present | **Yes** |
| `/article/<slug>` in Convex but not `mockData.ts` (~62 routes) | homepage H1 | **MISSING** | **MISSING** | **No — homepage shell** |

Measured summary from the 25-route crawl: `canonical` **2/25**, `meta description`
**2/25**, `serves own shell` **2/25**.

**Verified soft-404:** `/article/this-slug-does-not-exist-xyz123` returns
**HTTP 200** with the homepage `<h1>` and title `Gaming Security Intelligence for
Players | The Grid Nexus`. Non-existent article URLs are indistinguishable from
real ones to a crawler — a direct cause of GSC "soft 404" and crawl-budget waste.

## 4. Recommendations

1. **Do not attempt a "CSR -> SSR migration"** (plan doc 2). Rendering will not
   move to a server in this stack. Instead extend the existing static-shell
   generation so that **every indexable route** gets its own HTML file with its own
   `<title>`, `<meta name="description">`, `<link rel="canonical">` and `<h1>`.
   That is a build-step change, not a framework change.
2. **The unique per-route metadata already exists** — it is the `routes` map at
   `index.html` L12-100 (and `src/lib/seo/pageMetadata.ts`). It only needs to be
   emitted into static HTML at build time instead of being applied by JS at runtime.
3. **Reverse the blanket nginx fallback for content routes.** Serving `/index.html`
   (homepage H1, no canonical) for thousands of paths is the single biggest
   duplicate-content generator on the site. Content routes with no generated file
   should return **404/410**.
4. Keep genuinely interactive widgets client-only — they carry no unique content and
   correctly require JS.
5. **V-02 verdict:** confirmed and now explained. The "JavaScript is required"
   fallback is the `<noscript>` block at `index.html` L412-426. It is harmless in
   itself, but it sits inside a shell that is *not* route-specific, so the client-JS
   layer really is the only source of unique content for 23 of 25 sampled routes.

| `ArticleCard` | `src/components/articles/ArticleCard.tsx` | Yes | Only inside client lists | **Convert to static-HTML emitter** — reuse in the generator |
| `SEOHead` | `src/components/seo/SEOHead.tsx` | n/a (DOM writes) | No | **Must be mirrored in the static-shell generator** |

| Per-article HTML | `scripts/generate-static-articles.mjs` | real `<title>`, description, canonical, Article JSON-LD, H1, byline, breadcrumb, truncated body |
| Runtime metadata | `index.html` L10-100 | a `var routes = { '/tech': {t,d} ... }` map applied **by script after load** (post-hydration) |
| Runtime SEO writes | `src/components/seo/SEOHead.tsx` | `useEffect` DOM writer for title/description/canonical/JSON-LD — **client-only** |
| Content data | `src/hooks/useContent.ts` | `useQuery(api.content...)` from `convex/react` — **client-only, no server fetch** |
