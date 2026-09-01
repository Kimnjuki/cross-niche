# SEO/Audit Fix Checklist
Generated from thegridnexus.com_pages_20260901.csv

## P0 - Fix Immediately
- [ ] Fix canonicalization issues on article pages with "Canonical to other page"
- [ ] Add missing canonical tags to pages showing `-`
- [ ] Fix HTTP to HTTPS redirect chains (302 responses on http:// URLs)
- [ ] Ensure article pages are included in sitemap

## P1 - Fix This Week
- [ ] Improve ILR on low-scoring pages (/ai-pulse, article pages)
- [ ] Add missing incoming internal links to article pages
- [ ] Add schema.org JSON-LD to pages missing it
- [ ] Fix Open Graph tags on pages missing them

## P2 - Fix This Month
- [ ] Reduce JS/CSS size on heavy pages
- [ ] Improve page load times for slow pages
- [ ] Add hreflang tags where needed
- [ ] Fix any remaining validation issues

## Verification Steps
- [ ] Run `npm run validate:seo` after fixes
- [ ] Re-crawl affected pages
- [ ] Verify canonical tags are correct
- [ ] Check sitemap includes all article pages
- [ ] Verify no 302 chains remain
