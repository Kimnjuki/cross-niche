# How to Get Your Screaming Frog CSV Report

**Date:** 2026-02-06

---

## 📋 Step-by-Step Instructions

### Step 1: Download Screaming Frog SEO Spider

If you don't have it yet:
1. Go to: https://www.screamingfrog.co.uk/seo-spider/
2. Download the free version (500 URLs) or paid version
3. Install and open the application

### Step 2: Crawl Your Website

1. **Open Screaming Frog SEO Spider**
2. **Set Mode:** Make sure "Spider" mode is selected (top menu)
3. **Enter URL:** Type your website URL in the address bar:
   ```
   https://thegridnexus.com
   ```
4. **Click "Start"** (green play button) to begin crawling
5. **Wait for crawl to complete** - This may take a few minutes depending on site size

### Step 3: Export the CSV Report

1. **Go to Reports Menu:**
   - Click: `Reports` → `Export` → `Internal: All`
   
2. **Save the File:**
   - File name: `internal_all.csv`
   - Save location: Project root directory
     ```
     C:\Users\Administrator\Downloads\cross-niche-intelligence-main\internal_all.csv
     ```

### Step 4: Run the Analysis

Once the file is in the project root:

```bash
npm run analyze-seo
```

Or if the file is in a different location:

```bash
node scripts/process-screaming-frog-report.mjs "C:\path\to\your\internal_all.csv"
```

---

## 📁 Common Export Locations

Screaming Frog typically saves exports to:

- **Desktop:** `C:\Users\YourUsername\Desktop\internal_all.csv`
- **Downloads:** `C:\Users\YourUsername\Downloads\internal_all.csv`
- **Documents:** `C:\Users\YourUsername\Documents\internal_all.csv`
- **Screaming Frog folder:** `C:\Users\YourUsername\Screaming Frog SEO Spider\`

---

## 🔍 What the CSV Contains

The `internal_all.csv` file includes:
- All internal URLs found on your site
- Status codes (200, 404, etc.)
- Title tags
- Meta descriptions
- H1 tags
- Image alt text
- Links (internal/external)
- Canonical tags
- Open Graph tags
- Schema markup
- Page load times
- Word counts
- And more...

---

## ✅ Quick Checklist

- [ ] Screaming Frog installed
- [ ] Website crawled successfully
- [ ] CSV exported as `internal_all.csv`
- [ ] File placed in project root OR path noted
- [ ] Run `npm run analyze-seo`

---

## 🚨 Troubleshooting

### "File not found" Error

**Solution 1:** Place file in project root
```
C:\Users\Administrator\Downloads\cross-niche-intelligence-main\internal_all.csv
```

**Solution 2:** Use full path
```bash
node scripts/process-screaming-frog-report.mjs "C:\Users\Administrator\Desktop\internal_all.csv"
```

### CSV Export Not Available

Make sure you:
1. Completed the crawl (not just started)
2. Selected "Internal: All" export (not just "All")
3. File saved with `.csv` extension

### Wrong CSV Format

The script expects Screaming Frog's standard export format. If you exported a custom report, make sure it includes:
- Address/URL column
- Status Code column
- Title columns
- Meta Description columns
- H1 columns

---

## 📊 Expected File Size

- Small site (<100 pages): ~50-200 KB
- Medium site (100-500 pages): ~200 KB - 1 MB
- Large site (500+ pages): 1 MB+

---

## 🎯 Next Steps After Getting CSV

1. **Place CSV in project root** or note the path
2. **Run analysis:** `npm run analyze-seo`
3. **Review report:** Open `SCREAMING_FROG_FIXES.md`
4. **Fix issues:** Follow recommendations
5. **Re-crawl:** Verify fixes with another Screaming Frog crawl

---

**Need help?** Make sure your CSV file is from Screaming Frog's "Internal: All" export and includes all the standard columns.
