# Google Analytics 4 – Improvement Plan

**Site:** thegridnexus.com  
**Period:** Jan 5 – Feb 4, 2026  
**Goal:** Improve traffic, engagement, and GA4 data quality

---

## Current Performance Snapshot

| Metric | Value |
|--------|-------|
| Sessions | 45 |
| Engaged sessions | 21 |
| Average session duration | 19m 34s |
| User engagement | 1h 18m |
| Engagement rate | 46.67% |

### Traffic Analysis (90 days)

- **Active users:** Weak positive trend
- **Top channels:** Direct > Unassigned > Referral
- **Opportunity:** Organic Search and Social are underutilized

---

## Implemented Improvements

### 1. GA4 Module Enhancements (`src/lib/analytics/ga4.ts`)

- **Measurement ID:** Uses `G-TJ1VXE91NE` (matches `index.html`) instead of placeholder
- **No duplicate script load:** Skips loading gtag.js if already present from `index.html`
- **Recommended events:**
  - `view_item` + `article_view` for article views
  - `generate_lead` + `newsletter_signup` for newsletter signups
  - `share` for social shares
- **New events:**
  - `trackArticleView(articleId, title, niche)` – article page views
  - `trackRelatedArticleClick(sourceId, targetId, title)` – related article clicks

### 2. SPA Page View Tracking

- **`GA4PageTracker`** component tracks route changes in React Router
- Ensures virtual page views are sent when users navigate client-side (e.g. /tech → /article/xyz)
- Mounted in `App.tsx` inside `BrowserRouter`

### 3. Article Engagement Tracking

- **Article page:** Sends `article_view` and `view_item` when article loads
- **Read time:** Tracks 30s, 60s, and completion (95% scroll)
- **Social shares:** `trackSocialShare(platform, articleId, title)` on share button click
- **Related articles:** `trackRelatedArticleClick` when user clicks a related article card

### 4. Newsletter Conversion Tracking

- **NewsletterForm:** Calls `trackNewsletterSignup(variant)` on successful subscription
- Uses GA4 recommended `generate_lead` event for better reporting

---

## Recommendations (from GA4 Report)

### Content Optimization

1. **Use Engagement reports** in GA4 to see which content drives the highest engagement and retention
2. **Focus on top performers:** Create more content similar to your best-performing articles
3. **Refine layouts and CTAs** based on user interaction patterns in GA4

### User Experience

1. **Simplify navigation:** Clear structure improves UX and conversions
2. **Mobile-first:** Ensure the site is optimized for mobile (most traffic is mobile)
3. **A/B test:** Test high-traffic pages for layouts, CTAs, and content

### Traffic Acquisition

1. **Diversify channels:** Direct is strong; grow Organic Search (SEO) and Social
2. **SEO:** Target keywords, improve meta tags, internal linking
3. **Social/Referral:** Share content, build backlinks, consider referral programs
4. **Personalization:** Encourage repeat visits (e.g. personalized recommendations, accounts)

### GA4 Best Practices

1. **Set and monitor goals** in GA4 (e.g. newsletter signup, article completion)
2. **Use custom dimensions** for content type, niche, author
3. **Stay updated** on GA4 features and best practices

---

## Landing Page Performance Analysis

### Top Landing Pages (Jan 29 - Feb 4, 2026)

| Page | User Engagement | Score | Insights |
|------|----------------|-------|----------|
| `/` (Homepage) | 33m 23s | 2003 | **511% week-over-week growth** - Strongest performer |
| `/tech` | 21m 06s | 1266 | Second highest engagement |
| `/security` | 14m 25s | 865 | Third highest engagement |
| `/blog-series?filter=latest` | 42s | — | Low engagement - needs optimization |
| `/article/tech-3` | 5s | — | Very low - check content quality |

### Key Insights

1. **Homepage dominance:** Homepage has 511% week-over-week growth, indicating strong content discovery
2. **Category pages perform well:** Tech and Security pages show strong engagement (20+ min average)
3. **Article pages need work:** Individual articles show low engagement (5s) - may indicate:
   - Content quality issues
   - Poor internal linking
   - Weak CTAs
4. **Blog series underperforms:** `/blog-series?filter=latest` has minimal engagement

### Implemented Enhancements

- **Enhanced page view tracking:** Now includes `page_type` and `content_group` dimensions
- **Landing page engagement tracking:** Tracks time on page, scroll depth, articles viewed
- **Category page tracking:** Homepage, Tech, Security, Gaming pages now track engagement metrics

---

## Next Steps (Optional)

| Action | Priority | Notes |
|--------|----------|-------|
| Add GA4 custom dimensions for `content_type`, `niche`, `author` | Medium | Requires GA4 admin setup |
| Create GA4 exploration for “Top articles by engagement” | Medium | Use Engagement reports |
| Add `trackSearch` to Topics page when user searches | Low | Already implemented in ga4.ts |
| Add scroll-depth tracking to category pages | Low | `trackScrollDepth` already in init |
| Set up GA4 conversions for newsletter_signup, article_completed | High | In GA4 Admin → Conversions |

---

## Environment Variable

To override the GA4 measurement ID (e.g. for staging):

```env
VITE_GA4_MEASUREMENT_ID=G-YOUR-ID
```

Default: `G-TJ1VXE91NE` (matches `index.html`)
