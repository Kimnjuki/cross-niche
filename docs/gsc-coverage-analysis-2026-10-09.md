# GSC Coverage & Performance Analysis — 2026-10-09

**Site:** https://thegridnexus.com
**Export date:** 2026-10-09
**Bottom line:** The technical foundation is now healthy. Google Search Console still reports ~293 "not indexed" pages, but the vast majority are **stale reports** from the July–September restructuring (slug migration, redirect loops, a 5xx outage, and the raw-Markdown static bug). The live site now returns correct 200/301s, articles emit `index, follow`, and sitemaps are complete. The *remaining* problem is **authority**: a young domain with no backlinks is not worth Google's crawl budget, so 105 articles sit unindexed.

---

## 1. What the data says

### Coverage (Page Indexing) — 293 not indexed, 21 indexed

| GSC category | Count | Status | Root cause |
|---|---|---|---|
| Server error (5xx) | 80 | ✅ Fixed (stale) | September redirect-loop / outage window |
| Discovered — currently not indexed | 81 | ⏳ Authority | Google found the URL but hasn't crawled (crawl budget) |
| Excluded by `noindex` | 79 | ⚠️ Mostly intentional | 21 private routes + stale noindex from the pre-fix era |
| Crawled — currently not indexed | 24 | ⏳ Content quality | Thin news briefs (125–216 words) |
| Redirect error | 17 | ✅ Fixed (stale) | The old `/p/<slug>`, `/tech/<slug>` → `/article/<slug>` chains |
| Not found (404) | 3 | ✅ Fixed (stale) | Retired slugs now 301 |
| Duplicate without user-selected canonical | 3 | ✅ Fixed (stale) | Niche-prefixed duplicates now 301 to canonical |
| Page with redirect | 3 | ✅ Fixed | Retired aliases (correct 301s) |
| Duplicate, Google chose different canonical | 2 | ✅ Fixed (stale) | Same as above |
| Alternate page with proper canonical | 1 | ✅ Correct | Correct canonical tag |

**Indexing trend (Chart.csv):** "Not indexed" jumped to 263 on 2026-07-24 and has hovered 238–293 since; "Indexed" crept from 13 → 21. Impressions collapsed to ~0 in late September/October — consistent with a crawl of a broken site, not a healthy one.

### Performance (Search results) — last 7 days

- **1 click / ~2 impressions total.** Essentially zero traffic.
- Only the **homepage + 9 section pages** get impressions (positions 1.5–10). **No article page ranks.**
- Queries: empty (too little data). Devices: desktop only. Countries: Kenya + US.
- **Search appearance: empty** — no rich results showing yet.

---

## 2. Verification — the technical fixes ARE live

Checked 2026-10-09 against the production origin:

| Check | Result |
|---|---|
| Homepage, lead story, 2 restructured guides, `/tech`, `/security`, `/gaming`, tools, `/about`, `/reviews` | All **200** |
| Retired slugs (`-ios-android`, `-2026`) | **301** to canonical |
| Article robots meta | `index, follow, max-image-preview:large, max-snippet:-1` ✅ |
| Article canonical | `https://thegridnexus.com/article/<slug>` ✅ |
| Article static shells in build | 102/102 ✅ |
| `sitemap.xml` | 78 URLs (sections, tools, 12 author profiles) + `lastmod` ✅ |
| `sitemap-articles.xml` | 102 URLs + `lastmod` + image tags ✅ |
| `sitemap-index.xml` | References all 3 sitemaps ✅ |
| `robots.txt` | Allows GPTBot/ClaudeBot/PerplexityBot/CCBot + generic; `Sitemap:` directive present; private routes anchored with `$` ✅ |
| `noindex` routes | 21 (private: profile, settings, signin, bookmarks, etc.) — intentional ✅ |

**Conclusion:** nothing in the current build blocks indexing. The 80 5xx / 17 redirect / 3 404 / 8 duplicate reports are all traces of the pre-fix era that Google simply hasn't re-crawled.

---

## 3. The real problem — authority & crawl budget

Google has **~180 indexable URLs** (102 articles + 78 routes) but has indexed only ~21. The ~105 unindexed articles break down into:

1. **"Discovered — currently not indexed" (81)** — Google *found* these URLs (via the sitemap + internal links) but never crawled them. This is **crawl budget**: a site with zero domain authority gets crawled rarely, and Google deprioritizes pages it hasn't seen ranked.

2. **"Crawled — currently not indexed" (24)** — Google *crawled* these but declined to index. For a new site this almost always means **thin/low-value content** — the news briefs below.

Content depth is bimodal:

- **5 flagship guides:** 2,380–4,500 words (excellent, entity-first, review schema).
- **~20 news briefs:** 125–216 words (e.g. `china-ai-scraping-bot-traffic-2026` at 128 words, `tiktok-us-deal-algorithm-control-2026` at 136 words). These are the prime candidates for "crawled — not indexed."

There is **no backlink profile** yet, so Google has no reason to spend crawl budget here. That is the single biggest lever.

---

## 4. Action plan (prioritized)

### P0 — Recover the stale errors (you, in GSC — 15 minutes)
Google won't re-crawl on its own for weeks. For each category below, open **Pages → click the issue → "Validate Fix"**:

1. **Server error (5xx)** → Validate Fix (they now return 200)
2. **Redirect error** → Validate Fix (now correct 301s)
3. **Not found (404)** → Validate Fix (now 301)
4. **Duplicate without user-selected canonical** → Validate Fix
5. **Duplicate, Google chose different canonical** → Validate Fix

Then use **URL Inspection → "Request Indexing"** on the 5 flagship guides + the top 20 highest-intent articles. Do not request all 102 at once — Google throttles bulk requests; prioritize the money pages.

### P1 — Build authority / backlinks (you, ~2–3 hours over a week)
The draft copy already exists in `docs/listing-copy-gaming-security-checkup.md` and the plan in `BACKLINK_ACQUISITION_PLAN.md`:

1. Submit **AlternativeTo** (have-i-been-pwned competitor listing)
2. Submit **Product Hunt**
3. Submit **Slant / G2** for the gaming-security-checkup tool
4. 5–10 outreach emails to gaming/security blogs (template is in the plan)

Each dofollow link is a crawl-budget signal. This is what moves "discovered → indexed" at scale.

### P2 — Fix thin content (editorial; I can help scaffold)
The ~20 news briefs under 200 words are the "crawled — not indexed" cohort. Two options:

- **Expand** the highest-value briefs to 400–600 words (add context, a stat, a "why it matters" section), or
- **Consolidate** clusters of briefs into a single monthly "gaming & security news roundup" (one strong page beats ten thin ones).

### P3 — Monitor (2–4 weeks out)
Re-export GSC Coverage + Performance and re-check. Expect: 5xx/redirect/404 counts → 0 after validation; "Indexed" climbing past 21; impressions returning to articles.

---

## 5. Minor follow-up (not indexing-critical)

- **`wordCount` metadata is 0 for 97/102 articles** in the Convex snapshot. The JSON-LD generator computes word count from the body (`schemaMarkup.ts:111`), so the schema is correct — but read-time display ("X min read") and any future `wordCount` consumers fall back to approximations. A `backfillWordCount` Convex mutation (same pattern as the existing `backfillMetaTitle`) would clean this up. Not blocking indexing.

---

*Generated from the 2026-10-09 GSC export (Coverage + Performance on Search) plus live curl verification of the production origin.*
