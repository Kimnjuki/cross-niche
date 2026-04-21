# Google Search Console Setup Guide

## Step 1: Verify Domain Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Choose "URL prefix" and enter: `https://thegridnexus.com`
4. Choose verification method:
   - **Recommended:** HTML file upload
   - **Alternative:** HTML tag (add to `index.html`)
   - **Alternative:** DNS record

### HTML File Method (Recommended)
1. Download the HTML verification file from Google
2. Save it to `public/google[random].html`
3. Deploy and verify

### HTML Tag Method
1. Copy the meta tag from Google
2. Add to `index.html` in the `<head>` section
3. Deploy and verify

## Step 2: Submit Sitemap

1. After verification, go to "Sitemaps" in the left menu
2. Enter sitemap URL: `https://thegridnexus.com/sitemap.xml`
3. Click "Submit"
4. Wait for Google to process (usually 1-2 days)

## Step 3: Request Indexing

1. Go to "URL Inspection" tool
2. Enter your homepage URL: `https://thegridnexus.com`
3. Click "Request Indexing"
4. Repeat for key pages:
   - `/tech`
   - `/security`
   - `/gaming`
   - `/blog-series`

## Step 4: Monitor Performance

1. Check "Performance" report after 1-2 weeks
2. Monitor:
   - Impressions
   - Clicks
   - Average position
   - CTR (Click-Through Rate)

## Step 5: Fix Issues

1. Check "Coverage" report for indexing issues
2. Fix any errors or warnings
3. Resubmit sitemap if needed

## Expected Timeline

- **Verification:** Immediate (after deployment)
- **Sitemap Processing:** 1-2 days
- **Initial Indexing:** 1-7 days
- **Performance Data:** 1-2 weeks
- **Ranking Improvements:** 2-4 weeks

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Rich Results Test](https://search.google.com/test/rich-results)



