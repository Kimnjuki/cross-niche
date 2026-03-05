# Cybersecurity Page – GA Recommendations & Implementation

This doc summarizes the Google Analytics findings for the cybersecurity section and what is implemented to grow traffic and engagement.

## Current GA Findings (Jan 16–Feb 15, 2026)

- **/cybersecurity/** had **0 sessions** in the last 30 days in GA.
- The site’s main cybersecurity section lives at **/security** (canonical). A redirect from **/cybersecurity** to **/security** is in place so traffic and links using “cybersecurity” in the URL land on the same content.

## What Is Implemented

### 1. Dedicated cybersecurity/security route and page

- **Canonical route:** `/security` (and `/security/:slug` for articles).
- **Alternate path:** `/cybersecurity` and `/cybersecurity/` redirect to `/security` so GA and users looking for “cybersecurity” still reach the section.
- **Page:** `src/pages/Security.tsx` – category landing with security articles, threat dashboard, and clear CTAs.

### 2. SEO

- **SEOHead** on Security page: title "Cybersecurity News & Threat Intelligence | The Grid Nexus", meta description, keywords (`cybersecurity`, `security news`, `threat intelligence`, `cyber threats`, `data privacy`, `network security`).
- **Canonical:** Set from app (origin + `/security`) so `/security` is the single canonical URL.
- **Internal links:** To `/topics?q=cybersecurity`, `/topics?q=data+privacy`, `/guides`, `/blog-series`, and article cards to `/article/:slug` and `/security/:slug`.
- **External link:** One outbound link to a trusted authority (e.g. CISA or NIST) for credibility and SEO.

### 3. GA4 tracking

- **Page view:** Every visit to `/security` (and after redirect from `/cybersecurity`) sends a page view with `page_type: category`, `content_group: security`.
- **Listing page view:** `trackListingPageView('/security')` so the page appears in Funnel Exploration and Engagement > Landing page.
- **Landing page engagement:** `LandingPageTracker` on Security sends `landing_page_engagement` with `content_group: security`, `articles_viewed`, `time_on_page`, `scroll_depth` (on 30s timer or before unload).

### 4. Content and UX

- Articles from Convex by niche (security) with fallback to mock security articles.
- Threat dashboard (high/medium impact counts, status).
- Links to Cybersecurity Topics, Data Privacy, Security Guides, Blog Series.
- View toggle (grid/list/compact) and responsive grid.

## Recommendations Applied

| Recommendation | Status |
|----------------|--------|
| Create high-quality cybersecurity content | Content from Convex; consider threat intel, SMB advice, privacy/GDPR. |
| Find a niche (threat intel, business security, privacy) | Page positions “threat intelligence, data privacy, protection guides”. |
| SEO: keywords, on-page, build authority | Title, description, keywords, canonical; one external link to authority. |
| Promote (LinkedIn, Reddit r/cybersecurity, newsletter) | No code change; use GA to measure after promotion. |
| Measure with GA: engagement, popular content, events | `listing_page_view`, `landing_page_engagement`, scroll/time; use Pages and screens + Events. |

## How to Monitor in GA4

1. **Landing page report**  
   Reports → Engagement → Landing page. Add comparison **Page path = /security** (or **Page path and screen class** contains `security`) to see sessions and engagement for the cybersecurity section.

2. **Content group**  
   Use **content_group = security** in explorations or as a dimension to see all security-related pages and events together.

3. **Funnel Exploration**  
   Build a funnel with step 1 = `listing_page_view` where `page_path = /security`, then step 2 = `view_item` or `page_view` for article pages to see drop-off.

4. **Events**  
   Check `scroll`, `select_content`, `share` (if implemented) on `/security` to see how users interact with the page.

## Next Steps (optional)

- Add more internal links to `/security` from homepage, nav, and related articles.
- Create cybersecurity-only content (threat intel, how-tos, expert interviews) and tag with niche `security` so they appear on this page.
- Promote `/security` and `/cybersecurity` (redirects to /security) via LinkedIn, r/cybersecurity, and newsletter; watch GA4 Landing page and content_group reports.
