# Article body render audit (P0-T3)

**Date:** 2026-09-16
**Related plan finding:** V-06 ("body content in the raw fetch appeared to cut off mid-sentence")
**Deliverable:** P0-T3 — "Confirm whether article body truncation is real"

## Verdict

**Real, not a fetch-tool artifact — but narrower than first stated, and it exposed two
separate problems.**

1. **Truncation: 4 of the 38 generated article pages (11%).** `src/data/mockData.ts`
   stores article bodies two different ways. The 34 stored as *template literals*
   (backticks) were parsed correctly. The 4 stored as *single-quoted strings* that
   contain escaped apostrophes (`\'`) were silently truncated at the first
   apostrophe. The live route the original audit sampled —
   `/article/ai-security-threats-2026` — happens to be one of those 4, which is why
   the problem looked systematic.
2. **Thin content: 21 of the 38 generated article pages (55%) contain only 58-243
   words of body text in the source data.** This is *not* a parser bug; the source
   articles in `mockData.ts` are genuinely short. It is a separate, larger
   content-quality problem.
3. **Coverage: ~62 published Convex articles have no static article page at all**,
   so those URLs serve the homepage shell instead (see
   `reports/homepage-client-dependency-audit.md`).

### Measured before/after (fixed in this session)

| Article | Quoting style | Body words before | Body words after |
| --- | --- | --- | --- |
| `/article/ai-security-threats-2026` | single-quoted | **9** | **461** |
| `/article/steam-deck-2-specs-release-date-leaks` | single-quoted | **37** | **243** |
| `/article/gaming-pc-security-hardening-guide-2026` | single-quoted | **104** | **351** |
| `/article/router-security-gamers-2026` | single-quoted | **253** | **313** |
| *the other 34 articles* | template literal | unchanged | unchanged |


## Evidence 1 — live raw HTML ends mid-sentence with a dangling backslash

`GET https://www.thegridnexus.com/article/ai-security-threats-2026` (plain HTTP, no JS),
total response only **6,520 bytes**:

```html
<div style="color:#cbd5e1;line-height:1.7;font-size:1.0625rem">
  <p>The threat briefing I opened on Monday morning, I\
</div>
```

The body stops after ~10 words of the first paragraph and the trailing `\` is a
fragment of an escaped backtick left behind by the regex that extracted it.
Measured body text for this route: **103 words** (article template threshold is 300).
A second sampled article, `/article/gaming-pc-security-hardening-guide-2026`,
measured **212 words**.

## Evidence 2 — the truncating code

> Root cause and the applied fix are in **Evidence 5** at the end of this report.

`scripts/generate-static-articles.mjs` parses TypeScript source with regex instead of
importing it. The body is captured with a **non-greedy** match that stops at the
**first** backtick it finds:

```js
// scripts/generate-static-articles.mjs L40
const contentMatch = block.match(/content:\s*(?:`([\s\S]*?)`|'([^']*)')/);
```

```js
// scripts/generate-static-articles.mjs L60
content: contentMatch ? (contentMatch[1] ?? contentMatch[2]) : '',
```

```js
// scripts/generate-static-articles.mjs L169-171 — the body is injected raw
<div style="color:#cbd5e1;line-height:1.7;font-size:1.0625rem">
  ${article.content}
</div>
```

## Evidence 3 — the React path is *not* the problem, and neither is client fetching

`src/pages/Article.tsx` does **not** gate, paginate, or lazy-load the body:

```tsx
// src/pages/Article.tsx L82
const { data: contentData, isLoading } = useContentBySlug(slugOrId, { enabled: slugOrId.length > 0 });
// src/pages/Article.tsx L91-97
const article = useMemo(() => {
  if (contentData) return mapContentToArticle(contentData) ?? null;
  if (!slugOrId) return null;
  return findMockArticleBySlug(mockArticles, slugOrId) ?? null;
}, [contentData, slugOrId]);
```

So there is **no "read more" gating and no client-side re-fetch of the body** for
the hydrated app. The problem is exclusively in the **static-HTML generator**, which
never imports `contentData` from Convex at all — it re-parses `mockData.ts`.

**Consequence:** even a perfect fix to the regex would only repair the 38 articles
that exist in `mockData.ts`. The other ~62 published Convex articles get no static
page whatsoever and therefore no crawlable body.

## Evidence 4 — other gaps in the generated article HTML

Generated per-article HTML (`scripts/generate-static-articles.mjs` L102-181) is
present and correct for the head elements — `<title>`, `<meta name="description">`,
`<link rel="canonical">`, OG/Twitter, and one Article JSON-LD block are all there
(this is why V-01's "the site is not entirely CSR-broken" observation is right for
these 38 routes). Missing from it:

| Missing | Impact |
| --- | --- |
| `dateModified` in Article JSON-LD | No freshness signal for recrawl |
| `BreadcrumbList` JSON-LD (visible breadcrumb *is* rendered at L156-160) | Breadcrumb rich results unavailable |
| `Organization` / `WebSite` sitewide JSON-LD | Only present on `index.html`, absent from article pages |
| `Person` author with `url` | Author is emitted as a bare name (`"The GridNexus Security Team"`) — no E-E-A-T linkage |
| Any `<a>` to related articles | Generated article pages are near-orphans (only nav + footer links) |

## Recommendations (feeding Phase 1)

1. **DONE (V-06 fix)** — `scripts/generate-static-articles.mjs` no longer truncates on
   escaped quotes; `title`, `excerpt`, `author` and `content` are all escape-aware.
2. **DONE (regression guard)** — `scripts/validate-static-article-bodies.mjs` fails the
   build on any structural truncation signature (dangling escape backslash, body ending
   mid-tag, unbalanced `<div>`/`<p>`) and reports thin content as a warning. Wire it in
   after the generator runs:
   `node scripts/generate-static-articles.mjs && node scripts/validate-static-article-bodies.mjs`.
   Use `STRICT=1` to also fail on thin pages.
3. **Stop regex-parsing `mockData.ts`.** The escape-aware regex is now correct, but
   parsing TypeScript source with regexes remains fragile and is why this bug shipped.
   Either `import` the data or drive the generator from the same source as the sitemap.
4. **Generate static HTML for every published Convex article** (~62 are missing today —
   see `reports/phase-0-findings.md` sec. V-03 for the build-time data-source problem).
5. **Thin-content backfill:** 21 of 38 articles carry only 58-243 words. This is the
   largest single content-quality gap found, and it is *independent* of the truncation
   bug. It should be triaged as an editorial backlog item (expand or consolidate).
6. Add `dateModified`, `BreadcrumbList`, `Organization`/`WebSite`, `Person` author and
   internal related-article links to the article template (see Evidence 4 / V-13).


**Root cause:** for a *single-quoted* `content:` literal, the lazy `([\s\S]*?)` branch
is never reached — the regex falls through to the second alternative, `'([^']*)'`.
The character class `[^']*` stops at the **first apostrophe**, and article prose is
full of them. In `mockData.ts` the apostrophe appears escaped (`\'`), so the capture
returns everything up to the `\` and then stops. That stray `\` is exactly what
appears in the served HTML.

Articles whose bodies are stored as *template literals* were unaffected, because
`([\s\S]*?)` under the backtick branch does consume them correctly.

## Evidence 5 — root cause and the fix applied

> This section is the conclusion of Evidence 2. It sits at the end of the report
> because it was appended after the fix was implemented and validated.

`scripts/generate-static-articles.mjs` now uses escape-aware character classes on
**both** alternatives, plus a shared unescape helper:

```js
// L40 — escape-aware on both branches
const contentMatch = block.match(
  /content:\s*(?:`((?:\\[\s\S]|[^`\\])*)`|'((?:\\[\s\S]|[^'\\])*)')/,
);
// L60 — decode \' \n \t \\ etc. back to literal characters
content: contentMatch ? unescapeJsString(contentMatch[1] ?? contentMatch[2]) : '',
```

The same escape-aware treatment was applied to `title:`, `excerpt:` and `author:`,
which had the identical latent bug.

**Fidelity proof:** for all 38 articles the match now ends exactly at the property
separator `,`, i.e. the entire source literal is consumed. Verified with a
throwaway script that compared the character following each match:

```
literals captured                38
fully consumed (ends at ',')     38
suspicious                        0
```

**Before/after on the real generator output** (validated by
`scripts/validate-static-article-bodies.mjs`):

```
Before: 22 of 38 pages under 300 words, worst case 9 words, bodies ended mid-sentence
After :  0 truncation signatures; the 4 affected pages now 243-461 words
```

