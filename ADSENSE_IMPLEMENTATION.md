# AdSense Implementation Guide

## ✅ AdSense Client ID Updated

**New Client ID**: `ca-pub-9278124025449370`

### Files Updated

1. **`index.html`**
   - Updated AdSense script tag with new client ID
   - Script loads asynchronously with `crossorigin="anonymous"`

2. **`src/lib/adsenseConfig.ts`**
   - Updated `clientId` in configuration
   - All ad slot configurations reference this client ID

3. **`src/components/ads/AdSenseAd.tsx`**
   - Updated `data-ad-client` attribute to new client ID
   - All ad components now use the new client ID

## 📍 Ad Placement Locations

The following ad placements are configured and ready to use:

### 1. Header/Banner Ads
- **Component**: `<AdPlacement position="header" />`
- **Format**: Auto-responsive banner
- **Usage**: Top of page, below navigation

### 2. Footer Ads
- **Component**: `<AdPlacement position="footer" />`
- **Format**: Auto-responsive banner
- **Usage**: Bottom of page, above footer

### 3. In-Article Ads
- **Component**: `<AdPlacement position="in-article" />`
- **Format**: Full-width responsive
- **Usage**: Within article content, between paragraphs

### 4. In-Feed Ads
- **Component**: `<AdPlacement position="in-feed" />`
- **Format**: Auto-responsive
- **Usage**: Between article cards in feed/list views

### 5. Between Content Ads
- **Component**: `<AdPlacement position="between-content" />`
- **Format**: Auto-responsive
- **Usage**: Between major content sections

### 6. Sidebar Ads
- **Component**: `<AdPlacement position="sidebar" />`
- **Format**: 300x250 or responsive
- **Usage**: Sidebar column (sticky positioning)

## 🔧 Configuration

### Ad Slot IDs

To activate ads, you need to replace the placeholder ad slot IDs in `src/lib/adsenseConfig.ts`:

```typescript
adSlots: {
  header: 'YOUR_HEADER_AD_SLOT_ID',
  footer: 'YOUR_FOOTER_AD_SLOT_ID',
  inArticle: 'YOUR_IN_ARTICLE_AD_SLOT_ID',
  inFeed: 'YOUR_IN_FEED_AD_SLOT_ID',
  betweenContent: 'YOUR_BETWEEN_CONTENT_AD_SLOT_ID',
  sidebar: 'YOUR_SIDEBAR_AD_SLOT_ID',
}
```

### How to Get Ad Slot IDs

1. Log in to your [Google AdSense account](https://www.google.com/adsense)
2. Navigate to **Ads** > **By ad unit**
3. Create new ad units for each placement type
4. Copy the ad unit IDs (format: `1234567890`)
5. Replace the placeholder IDs in `adsenseConfig.ts`

## 🍪 Cookie Consent Integration

Ads are automatically integrated with the cookie consent system:

- **Consent Required**: Ads only show if user has consented to advertising cookies
- **Automatic Reload**: Ads reload automatically when consent is granted
- **Privacy Compliant**: Respects user privacy preferences

### Consent Check

The system checks for consent via:
- `localStorage.getItem('cookie-consent')`
- `localStorage.getItem('cookie-preferences')`

If `advertising: true` in preferences, ads will display.

## 📊 Current Ad Placements on Site

### Homepage (`src/pages/Index.tsx`)
- Between content sections
- In feed (between niche sections)

### Article Pages (`src/pages/Article.tsx`)
- In-article (mid-content)
- Related articles section

## 🚀 Next Steps

### 1. Create Ad Units in AdSense
1. Go to AdSense dashboard
2. Create ad units for each placement type
3. Copy the ad slot IDs
4. Update `adsenseConfig.ts` with real IDs

### 2. Enable Auto Ads (Optional)
Google AdSense also supports Auto Ads, which automatically places ads in optimal locations. To enable:

1. Go to AdSense dashboard
2. Navigate to **Ads** > **Auto ads**
3. Enable Auto ads for your site
4. The script tag in `index.html` will automatically handle this

### 3. Test Ad Display
1. Ensure you're logged out of AdSense (to see real ads)
2. Clear browser cache
3. Visit your site
4. Verify ads appear in configured locations
5. Check that ads are responsive on mobile devices

### 4. Monitor Performance
- Use AdSense dashboard to monitor:
  - Impressions
  - Click-through rate (CTR)
  - Revenue
  - Ad placement performance

## ⚠️ Important Notes

1. **Ad Blockers**: The system detects ad blockers and won't attempt to load ads if blocked
2. **Consent Mode**: The site uses Google Consent Mode v2 for GDPR compliance
3. **Responsive Ads**: All ads are configured to be responsive by default
4. **Ad Limits**: Google has policies on ad density - ensure you don't exceed limits

## 🔍 Verification Checklist

- [x] AdSense script tag updated with new client ID
- [x] Configuration file updated
- [x] Ad components updated
- [x] Cookie consent integration working
- [ ] Ad slot IDs replaced with real IDs (pending)
- [ ] Ad units created in AdSense dashboard (pending)
- [ ] Ads displaying correctly (pending verification)

## 📝 Code Examples

### Basic Ad Usage
```tsx
import { AdPlacement } from '@/components/ads/AdPlacement';

// In your component
<AdPlacement position="in-article" />
```

### Custom Ad Slot
```tsx
import { AdSenseAd } from '@/components/ads/AdSenseAd';

<AdSenseAd
  adSlot="YOUR_CUSTOM_AD_SLOT_ID"
  adFormat="auto"
  responsive
/>
```

### Direct Component Usage
```tsx
import { BannerAd, InArticleAd, SidebarAd } from '@/components/ads/AdSenseAd';

<BannerAd />
<InArticleAd />
<SidebarAd />
```

All AdSense implementation is complete and ready for ad slot configuration!

