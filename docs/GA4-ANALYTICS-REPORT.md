# Google Analytics 4 – Report Implementation & Usage

This doc summarizes the GA4 performance report (Feb 2026) and how the platform implements the recommendations so you can improve growth, traffic, and engagement.

## Report Summary (Feb 8–15, 2026)

| Metric | Value | WoW |
|--------|--------|-----|
| Active users | 17 | +6.3% |
| Sessions | 50 | +22% |
| Key events | 0 | – |
| Bounce rate | 18% | +56% |
| Avg session duration | 18m 05s | -54.1% |

**Issues:** Key events were 0; bounce rate up; session duration down. The site needs better engagement tracking and use of GA4 reports to act on the data.

---

## What Is Implemented in Code

### 1. GA4 Measurement ID from env

- **.env / .env.example:** `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`
- **Build:** Vite plugin injects this into `index.html` so the Google tag uses your ID. No hardcoded ID in HTML.
- **Runtime:** `src/lib/analytics/ga4.ts` also uses `VITE_GA4_MEASUREMENT_ID` for config and fallback script load.

### 2. Key events (so you can get “Key events” > 0)

The app sends these events. **In GA4 Admin → Data display → Key events**, mark the ones you care about as “Key events” so they show in reports and as conversions:

| Event name | When it fires | Suggested as Key event |
|------------|----------------|-------------------------|
| `view_item` | User opens an article | ✅ Yes |
| `generate_lead` | Newsletter signup | ✅ Yes |
| `share` | User shares (e.g. social) | Optional |
| `user_engagement` | User on site ≥10s (engaged session threshold) | Optional |
| `scroll` (90%) | User scrolls 90% down the page | Optional |
| `landing_page_engagement` | 30s or exit on homepage/category | Optional |

After marking 1–2 as Key events (e.g. `view_item`, `generate_lead`), “Key events” in GA4 will stop being 0.

### 3. Engagement and engagement time

- **Engaged session:** GA4 counts a session as “engaged” when duration ≥10s, or 2+ page views, or a conversion. The app sends `user_engagement` at 10s so you can also use that event for Key events if you want.
- **Scroll depth:** 25%, 50%, 75%, 90% are sent as `scroll` events (global).
- **Article:** `article_view`, `article_read_time` (30s / 60s), `article_completed` (scroll 95%).
- **Landing pages:** `landing_page_engagement` with time on page and scroll depth (homepage, Tech, Security, Gaming).

### 4. Traffic and landing page reporting

- **Page views:** Every route change sends a `page_view` and updates `page_path` / `page_title` / `content_group` so **Traffic Acquisition** and **Pages and screens** work.
- **Content groups:** Homepage, tech, security, gaming, news, articles, etc., so you can see which sections drive traffic and engagement.

### 5. Events for behavior and content

- **Events report:** Use **Reports → Engagement → Events** to see `view_item`, `article_view`, `scroll`, `user_engagement`, `landing_page_engagement`, `generate_lead`, `share`, etc.
- **Pages and screens:** Use **Reports → Engagement → Pages and screens** for “which pages hold attention longest” and **Reports → Engagement → Events** for “what actions users take.”

---

## How to Use GA4 Reports (Recommendations from the report)

1. **SEO and keywords**  
   **Reports → Acquisition → User acquisition** (and **Traffic acquisition**) → dimension “Session default channel group” or “First user source”.  
   Add a comparison for “Session source/medium” to see organic search. Use **Search Console** link for query data. Use this to plan content and meta tags.

2. **Traffic sources**  
   **Reports → Acquisition → User acquisition** and **Traffic acquisition** show where users come from (organic, direct, social, etc.). Focus effort on channels that bring engaged users.

3. **Landing page performance**  
   **Reports → Engagement → Pages and screens** → set “Landing page” as the dimension. Find pages with high traffic but high bounce or low engagement and improve those (content, layout, internal links).

4. **A/B testing**  
   Use the same Events and Pages reports to see which pages or flows perform better. For formal A/B tests, use Google Optimize or a dedicated tool and keep sending the same GA4 events so results are comparable.

5. **Engagement metrics**  
   **Reports → Engagement → Overview** for “Average engagement time” and “Engaged sessions.” Use **Events** to see which actions (e.g. `view_item`, `user_engagement`, `scroll`) correlate with longer sessions.

6. **Custom audiences**  
   **Admin → Audiences** → New audience → define by event (e.g. “users who did `view_item`” or “users who did `generate_lead`”). Use these for analysis and, if you use paid campaigns, for remarketing.

7. **Content and feature audit**  
   Use **Pages and screens** and **Events** to see which content and features get the most engagement, then simplify or improve underperforming areas.

---

## Checklist After Deployment

- [ ] Set `VITE_GA4_MEASUREMENT_ID` in production env (e.g. in Vercel/Netlify) so the built site uses your property.
- [ ] In GA4 Admin → **Data display → Key events**, mark at least `view_item` and `generate_lead` as Key events.
- [ ] Wait 24–48 hours, then check **Reports → Engagement → Events** and **Key events** to confirm events and Key events are recording.
- [ ] Use **Traffic acquisition**, **Pages and screens**, and **Landing page** reports to act on the report’s recommendations (SEO, traffic sources, landing pages, engagement).
