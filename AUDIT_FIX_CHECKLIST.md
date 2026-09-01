# The Grid Nexus — Ahrefs Audit Fix Checklist
Extracted from: Ahrefs audit, 26 Aug 2026
Source: thegridnexus.com_pages_20260901.csv + PDF summary

## Active Errors (non-zero counts)
- [ ] Redirect loop — 1 page
- [ ] 3XX redirect in sitemap — 42 URLs
- [ ] Canonical points to redirect — 38 pages
- [ ] Duplicate pages without canonical — 104 pages
- [ ] Orphan pages (no incoming internal links) — 32 pages

## Execution Order
1. Redirect loop (quick win, 1 page)
2. Sitemap 3XX cleanup (bulk, low risk)
3. Canonical → redirect fixes (protect indexing)
4. Duplicate pages without canonical (large volume)
5. Orphan pages (internal linking strategy)

## Notes
- For Tasks 1–3/4/5, actual per-URL evidence should come from the Ahrefs export.
- Without the live Ahrefs export file here, this checklist encodes the required fixes at the code/config level and adds safeguards so new URLs cannot reintroduce the same issues.

## Verification
- [ ] Re-run `npm run validate:seo` after each batch
- [ ] Re-crawl in Ahrefs after deploy
- [ ] Confirm 0 redirect-loop, 0 sitemap 3XX, 0 canonical→redirect
