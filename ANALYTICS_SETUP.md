# Analytics Setup Guide

This document outlines the analytics tools integrated into The Grid Nexus platform.

## ✅ Implemented Analytics Tools

### 1. Ahrefs Web Analytics

**Status**: ✅ Installed

**Location**: `index.html` (in `<head>` section)

**Script**:
```html
<script src="https://analytics.ahrefs.com/analytics.js" data-key="aNTResFK8mO8Rf5gt0QKdw" async></script>
```

**Features**:
- Automatic page view tracking
- User behavior analytics
- Traffic source analysis
- Conversion tracking
- Real-time visitor monitoring

**Verification**:
1. Go to Ahrefs Web Analytics dashboard
2. Click "Recheck installation" button
3. Visit your site and verify data is being collected

**Data Key**: `aNTResFK8mO8Rf5gt0QKdw`

### 2. Google AdSense Analytics

**Status**: ✅ Installed

**Location**: `index.html`

**Features**:
- Ad performance tracking
- Revenue analytics
- Click-through rates
- Viewability metrics

### 3. Clickio Consent Management

**Status**: ✅ Installed

**Location**: `index.html` and `src/components/consent/CookieConsent.tsx`

**Features**:
- GDPR/CCPA compliance
- Cookie consent management
- Consent mode integration
- Privacy-first analytics

## 📊 Analytics Utilities

A utility library is available at `src/lib/analytics.ts` for custom event tracking:

```typescript
import { trackEvent, trackArticleView, trackSearch } from '@/lib/analytics';

// Track custom events
trackEvent('button_click', { button_name: 'subscribe' });

// Track article views
trackArticleView('article-123', 'Article Title');

// Track search queries
trackSearch('technology news', 25);
```

## 🔍 Available Tracking Functions

- `trackPageView(url, title)` - Track page views
- `trackEvent(eventName, eventData)` - Track custom events
- `trackArticleView(articleId, title)` - Track article views
- `trackArticleEngagement(articleId, action, metadata)` - Track article interactions
- `trackSearch(query, resultsCount)` - Track search queries
- `trackNewsletterSignup(email)` - Track newsletter signups
- `trackAuth(action, method)` - Track authentication events

## 🚀 Adding Additional Analytics Tools

### Google Analytics 4 (GA4)

To add Google Analytics 4, add this to `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### SEMrush Position Tracking

SEMrush doesn't require a tracking script. Instead:
1. Add your site to SEMrush Projects
2. Set up position tracking
3. Verify site ownership via meta tag or DNS

To add SEMrush verification meta tag:

```html
<meta name="semrush-verification" content="YOUR_VERIFICATION_CODE" />
```

### Other Analytics Tools

1. **Facebook Pixel**: Add to `index.html` in `<head>`
2. **LinkedIn Insight Tag**: Add to `index.html` in `<head>`
3. **Twitter Analytics**: Uses meta tags (already configured)
4. **Bing Webmaster Tools**: Add verification meta tag

## 📈 Privacy & Compliance

All analytics tools are integrated with:
- ✅ Cookie Consent Management (Clickio)
- ✅ GDPR compliance
- ✅ CCPA compliance
- ✅ Privacy-first approach

Analytics data collection respects user consent preferences set via the cookie consent banner.

## 🔐 Data Security

- All analytics scripts load asynchronously
- No sensitive user data is tracked
- Email addresses are hashed/anonymized
- IP addresses are anonymized by default

## 📝 Next Steps

1. **Verify Ahrefs Installation**:
   - Visit Ahrefs dashboard
   - Click "Recheck installation"
   - Verify data is flowing

2. **Set Up Goals** (Optional):
   - Newsletter signups
   - Article reads
   - User registrations
   - Time on site

3. **Configure Alerts**:
   - Traffic drops
   - Error spikes
   - Conversion changes

4. **Add SEMrush Verification** (If needed):
   - Get verification code from SEMrush
   - Add meta tag to `index.html`

## 🛠️ Troubleshooting

### Ahrefs Not Tracking

1. Check script is in `<head>` section
2. Verify `data-key` attribute is correct
3. Clear browser cache
4. Check browser console for errors
5. Verify site is accessible (not behind firewall)

### Analytics Data Not Appearing

1. Wait 24-48 hours for initial data
2. Check if ad blockers are interfering
3. Verify consent is granted (for EU users)
4. Check network tab for script loading

### Performance Impact

All analytics scripts are loaded asynchronously to minimize performance impact. If you notice slowdowns:
1. Check script loading order
2. Consider lazy loading analytics
3. Use tag manager (GTM) for better control


