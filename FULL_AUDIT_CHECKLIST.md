# Full Audit Checklist — Errors, Layout & Competitor Features

Reference: [Ars Technica](https://arstechnica.com/), [WIRED](https://www.wired.com/), The Verge.

---

## 1. Errors & Issues

| Check | Status | Notes |
|-------|--------|--------|
| ESLint (no errors) | Run `npm run lint` | Fix any reported errors |
| TypeScript (no errors) | Run `tsc --noEmit` | Ensure build passes |
| Broken internal links | Manual / link checker | Footer, Navbar, Index links |
| Missing `alt` on images | Grep `<img` and `LazyImage` | All images need alt text |
| Console errors in dev | Browser console | Remove debug logs in prod |
| 404 / invalid routes | All `Route` paths match `Link` `to` | Sitemap, nav, footer |
| Form validation & error states | Contact, Auth, Newsletter | Clear error messages |
| Missing error boundaries | Key routes | Graceful fallback UI |

---

## 2. Accessibility (A11y)

| Check | Status | Notes |
|-------|--------|--------|
| Focus order & visible focus | Tab through pages | `focus-visible` rings on interactive elements |
| Heading hierarchy (h1 → h2 → h3) | One h1 per page, logical order | SEOHead, page titles |
| ARIA labels on icon buttons | Search, bookmark, menu | `aria-label` where no text |
| Color contrast (WCAG AA) | text/background, badges | Use design tokens |
| Skip to content link | Layout | SkipToContent component |
| Form labels associated | All inputs | `htmlFor` / `aria-label` |

---

## 3. Layout & Responsive

| Check | Status | Notes |
|-------|--------|--------|
| Mobile viewport (320px+) | All pages | No horizontal scroll |
| Tablet (768px) grid breakpoints | `md:` classes | Cards, nav, footer |
| Desktop (1024px+) | `lg:` max-width, grid | Container, multi-column |
| Touch targets ≥ 44px | Buttons, links | Padding/height on mobile |
| Sticky/fixed elements | Navbar, widget | Don’t obscure content |

---

## 4. Competitor Features (Ars Technica, WIRED, The Verge)

### 4.1 Ars Technica–style

| Feature | Status | Implementation |
|---------|--------|-----------------|
| Section nav (AI, Tech, Security, Gaming, etc.) | ✅ Exists | Navbar: Innovate, Secured, Play, Topics, Guides, Roadmap |
| Grid / List / Compact view toggle | ✅ Implemented | ArticleGrid + ViewToggle on Index, Tech, Security, Gaming, Bookmarks |
| “Included stories” / section filter chips | ✅ Implemented | SectionFilter on Index featured section |
| “Most read” module | ✅ Exists | TrendingSection, TrendingTopicsWidget |
| Featured carousel / hero | ✅ Exists | RotatingHeroSection, BreakingNewsSection |
| Classic vs Grid layout | ✅ Implemented | View toggle in article grids (grid/list/compact) |

### 4.2 WIRED–style

| Feature | Status | Implementation |
|---------|--------|-----------------|
| “Today’s Picks” / curated strip | ✅ Implemented | Today’s Picks section on Index (WIRED-style, top 6) |
| Category pills (Security, Politics, Business, etc.) | ✅ Exists | Niches + Topics page |
| “The Big Story” hero | ✅ Exists | Rotating hero + breaking news |
| Reviews / buying guides section | ✅ Exists | ProductReviewsSection |
| Clean header with sections | ✅ Exists | Navbar + Layout |

### 4.3 General modern features

| Feature | Status | Notes |
|---------|--------|--------|
| View toggle (grid/list/compact) | ✅ Implemented | ArticleGrid viewMode + ViewToggle on Index, Tech, Security, Gaming, Bookmarks |
| Section filter (Tech, Security, Gaming, All) | ✅ Implemented | SectionFilter on Index featured; ArticleCard list variant |
| Consistent card design | ✅ | ArticleCard variants: default, featured, compact, list |
| Load more / pagination | Optional | Currently “View All” links |
| Dark/light theme | ✅ | next-themes, design tokens |

---

## 5. Run Commands

```bash
# Lint
npm run lint

# TypeScript
npx tsc --noEmit

# Build (catches runtime/import errors)
npm run build
```

---

## 6. Checklist Summary

- **Errors:** Run lint + tsc + build; fix reported issues.
- **A11y:** Skip link, headings, aria-labels, contrast.
- **Layout:** Responsive grid, containers, touch targets.
- **Competitor parity:** View toggle, section filters, “Today’s Picks”–style block, section nav (already present); ensure ArticleGrid supports grid/list/compact everywhere used.
