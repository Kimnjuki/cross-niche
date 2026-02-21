# Gaming Page – GA Recommendations & Implementation

This doc summarizes the Google Analytics findings for the `/gaming` section and what is implemented to grow traffic and engagement.

## Current GA Findings (Jan 16–Feb 15, 2026)

- **/gaming/ (or /gaming)** had **0 sessions** in the last 30 days in GA.
- This indicates either no dedicated traffic to the gaming section or the section needs to be built up and promoted.

## What Is Implemented

### 1. Dedicated gaming route and page

- **Route:** `/gaming` (and `/gaming/:slug` for articles).
- **Page:** `src/pages/Gaming.tsx` – category landing with gaming articles, security ratings section, and clear CTAs.

### 2. SEO

- **SEOHead** on Gaming page: title "Gaming News & Reviews | The Grid Nexus", meta description, keywords (`gaming news`, `game reviews`, `esports`, `gaming hardware`, `gaming security`, `game ratings`).
- **Canonical:** Set from app (origin + pathname) so `/gaming` is canonical (no trailing slash).
- **Internal links:** To `/topics?q=gaming`, `/security-score`, `/guides`, `/blog-series`, and article cards to `/article/:slug` and `/gaming/:slug`.

### 3. GA4 tracking

- **Page view:** Every visit to `/gaming` sends a page view with `page_type: category`, `content_group: gaming`.
- **Listing page view:** `trackListingPageView('/gaming')` so the page appears in Funnel Exploration and Engagement > Landing page.
- **Landing page engagement:** `LandingPageTracker` on Gaming sends `landing_page_engagement` with `content_group: gaming`, `articles_viewed`, `time_on_page`, `scroll_depth` (on 30s timer or before unload).

### 4. Content and UX

- Articles from Convex by niche (gaming) with fallback to mock gaming articles.
- “Games with Security Ratings” section (Nexus Risk-to-Reward).
- Links to Gaming Topics, Security Scores, Gaming Guides, Blog Series.
- View toggle (grid/list/compact) and responsive grid.

## Recommendations Applied

| Recommendation | Status |
|----------------|--------|
| Create high-quality gaming content | Content from Convex; consider adding more gaming-specific pieces. |
| Find a niche (e.g. reviews, esports, hardware) | Page positions “reviews, news, esports, security ratings”. |
| SEO: keywords, on-page, mobile-friendly | Title, description, keywords set; page is responsive. |
| Promote (social, email, paid) | No code change; use GA to measure after promotion. |
| Measure with GA: engagement, popular content, events | `listing_page_view`, `landing_page_engagement`, scroll/time; use Pages and screens + Events. |

## How to Monitor in GA4

1. **Landing page report**  
   Reports → Engagement → Landing page. Add comparison **Page path = /gaming** (or **Page path and screen class** contains `gaming`) to see sessions and engagement for the gaming section.

2. **Content group**  
   Use **content_group = gaming** in explorations or as a dimension to see all gaming-related pages and events together.

3. **Funnel Exploration**  
   Build a funnel with step 1 = `listing_page_view` where `page_path = /gaming`, then step 2 = `view_item` or `page_view` for article pages to see drop-off.

4. **Events**  
   Check `scroll`, `select_content`, `share` (if implemented) on `/gaming` to see how users interact with the page.

## Next Steps (optional)

- Add more internal links to `/gaming` from homepage, nav, and related articles.
- Create gaming-only content (reviews, esports, hardware) and tag with niche `gaming` so they appear on this page.
- Promote `/gaming` via social, newsletter, or paid campaigns and watch GA4 Landing page and content_group reports.
