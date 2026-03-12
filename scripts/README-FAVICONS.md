# Favicon and OG Image Generation Guide

## Quick Start

### Option 1: Browser-Based Generator (Recommended)
1. Open `scripts/generate-favicons.html` in your web browser
2. Click "Generate All Favicons" button
3. Click "Generate OG Image" button
4. Right-click each image and "Save image as..."
5. Save files to the `public/` folder with the correct names

### Option 2: Node.js Script (Requires canvas package)
```bash
npm install canvas
node scripts/generate-og-image.js
```

## Required Files

Save these files to the `public/` folder:

### Favicons
- `favicon.ico` - Multi-size ICO file (16x16, 32x32, 48x48)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `apple-touch-icon.png` - 180x180 PNG
- `favicon-192x192.png` - 192x192 PNG (for manifest)
- `favicon-512x512.png` - 512x512 PNG (for manifest)
- `mstile-150x150.png` - 150x150 PNG (for Windows)
- `safari-pinned-tab.svg` - SVG for Safari (already created)

### OG Image
- `og-image.jpg` - 1200x630px JPEG

## Design Specifications

### Favicon Design
- **Background:** Gradient (Blue → Red → Green)
- **Letter:** White "G" in center
- **Shape:** Rounded rectangle (12.5% border radius)
- **Border:** Subtle white circle overlay

### OG Image Design
- **Size:** 1200x630px
- **Background:** Dark blue gradient with grid pattern
- **Logo:** Large "G" icon (200x200px) with gradient
- **Text:** 
  - Title: "The Grid Nexus" (72px, bold, white)
  - Subtitle: "Tech • Security • Gaming Intelligence" (36px, white 80% opacity)
  - Tagline: "Breaking News & Expert Analysis" (24px, white 60% opacity)

## Online Tools (Alternative)

If you prefer online tools:

1. **Favicon Generator:**
   - https://realfavicongenerator.net/
   - Upload a 512x512px logo
   - Download all sizes

2. **OG Image Generator:**
   - https://www.opengraph.xyz/
   - Or use Canva/Figma to create 1200x630px image

## Verification

After generating files, verify:
- [ ] All favicon files exist in `public/` folder
- [ ] `og-image.jpg` is 1200x630px
- [ ] Files are properly named
- [ ] Test in browser (favicon should appear in tab)
- [ ] Test OG image with Facebook Debugger



