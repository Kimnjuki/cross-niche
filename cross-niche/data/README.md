# Ahrefs SEO Data

This folder holds CSV exports and JSON configs for the Ahrefs implementation plan.

## File Guide

| File | Source | Purpose |
|------|--------|---------|
| `low_hanging_keywords.csv` | Site Explorer → Organic Keywords (Position 4-15) | Keywords close to page 1 |
| `snippet_opportunities.csv` | Site Explorer → SERP features filter | Featured snippet / AI Overview targets |
| `snippet_types.json` | Manual mapping | Maps keyword → paragraph \| list \| table \| video |
| `content_gap_keywords.csv` | Content Gap analysis | Competitors rank, you don't |
| `topic_clusters.json` | Manual grouping | Cluster names → target keywords |
| `prioritized_gaps.json` | `scripts/filter_content_gap.ts` | Filtered by KD/volume |
| `declining_pages.csv` | Site Explorer → Top Pages | Negative traffic delta |
| `decline_diagnosis.json` | Manual | URL → decline_reason |
| `old_pages_low_traffic.csv` | Content Explorer | Old pages, low traffic |
| `page_decisions.json` | Manual | update \| consolidate \| delete |
| `cannibalization_issues.csv` | Site Explorer | Same keyword, multiple URLs |
| `cannibalization_resolutions.json` | Manual | winner_url, loser_url, action |
| `broken_pages_with_links.csv` | Site Explorer → 404 with backlinks | Dead URLs with link equity |
| `redirect_map.json` | Manual | from, to, status 301 |
| `internal_link_opportunities.csv` | Site Audit | source_page, keyword_mention, target_page |
| `internal_links_log.json` | Auto | Tracks links added per page |
| `link_intersect_prospects.csv` | Link Intersect | Domains linking to competitors |
| `scored_prospects.json` | `scripts/score_link_prospects.ts` | Filtered/scored prospects |
| `link_targets.json` | Manual | Best pages for outreach |
| `unlinked_mentions.csv` | Content Explorer | Brand mentions without link |
| `outreach_tracker.json` | Manual | Outreach log |
| `generic_anchors.csv` | Anchors report | click here, read more, etc. |
| `anchor_replacements.json` | Manual | old_anchor → new_anchor |

## Scripts

- `group_keywords_by_page.ts` — Group keywords by landing page
- `filter_content_gap.ts` — Filter content gap by KD/volume
- `update_sitemap.ts` — Regenerate sitemap with lastmod
- `verify_redirects.ts` — Check redirect HTTP status
- `score_link_prospects.ts` — Score link intersect prospects
- `find_internal_links.ts` — Find hrefs pointing to a URL
- `audit_anchor_distribution.ts` — Anchor text distribution
- `sync_redirects_to_vercel.ts` — Sync redirect_map → vercel.json
