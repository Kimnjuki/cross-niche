#!/bin/bash

# Grid Nexus Platform Diagnostic Script
# Run this to identify why articles aren't appearing

echo "======================================"
echo "Grid Nexus Platform Diagnostic"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Step 1: Checking Convex Connection..."
if command -v npx &> /dev/null; then
    echo -e "${GREEN}✓${NC} npx is available"
else
    echo -e "${RED}✗${NC} npx not found - install Node.js"
    exit 1
fi

echo ""
echo "🔍 Step 2: Checking Project Structure..."

# Check for key files
files_to_check=(
    "convex/schema.ts"
    "convex/content.ts"
    "convex/_generated/api.d.ts"
    "package.json"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} Found $file"
    else
        echo -e "${YELLOW}⚠${NC} Missing $file"
    fi
done

echo ""
echo "🔍 Step 3: Checking Dependencies..."

if [ -f "package.json" ]; then
    if grep -q "convex" package.json; then
        echo -e "${GREEN}✓${NC} Convex is in package.json"
    else
        echo -e "${RED}✗${NC} Convex not found in package.json"
    fi
    
    if grep -q "next" package.json; then
        echo -e "${GREEN}✓${NC} Next.js is in package.json"
    else
        echo -e "${YELLOW}⚠${NC} Next.js not found in package.json"
    fi
fi

echo ""
echo "======================================"
echo "Next Steps:"
echo "======================================"
echo ""
echo "1. Open Convex Dashboard:"
echo "   → Go to https://dashboard.convex.dev"
echo "   → Select your project"
echo "   → Check the 'content' table"
echo ""
echo "2. Check data in the table:"
echo "   → How many records exist?"
echo "   → What are the 'status' field values?"
echo "   → Do records have 'publishedAt' timestamps?"
echo ""
echo "3. Run these commands in Convex Dashboard Functions:"
echo ""
echo "   a) Check content count:"
echo "      → api.content.getContentStats()"
echo ""
echo "   b) Get published content:"
echo "      → api.content.getPublishedContent({ limit: 10 })"
echo ""
echo "   c) Fix draft articles (if needed):"
echo "      → api.admin.publishAllDrafts()"
echo ""
echo "   d) Fix missing dates (if needed):"
echo "      → api.admin.fixPublishedDates()"
echo ""
echo "4. Check frontend component:"
echo "   → Open browser DevTools (F12)"
echo "   → Go to Console tab"
echo "   → Look for errors"
echo "   → Check Network tab for failed API calls"
echo ""
echo "5. Common Issues & Fixes:"
echo ""
echo "   Issue: Articles have status='draft'"
echo "   Fix: Run api.admin.publishAllDrafts()"
echo ""
echo "   Issue: Articles missing publishedAt"
echo "   Fix: Run api.admin.fixPublishedDates()"
echo ""
echo "   Issue: No articles in database"
echo "   Fix: Run api.admin.seedSampleContent({ count: 10 })"
echo ""
echo "   Issue: Frontend not loading data"
echo "   Fix: Check browser console for errors"
echo "        Verify useQuery hook is being called"
echo "        Check Convex client is initialized"
echo ""
echo "======================================"
echo "Files Created for You:"
echo "======================================"
echo ""
echo "1. gridnexus-restoration-guide.md"
echo "   → Complete troubleshooting guide"
echo ""
echo "2. convex-content-queries.ts"
echo "   → All query functions you need"
echo "   → Copy to convex/content.ts"
echo ""
echo "3. convex-admin-mutations.ts"
echo "   → Admin functions to fix data"
echo "   → Copy to convex/admin.ts"
echo ""
echo "======================================"
echo "Quick Fix Commands:"
echo "======================================"
echo ""
echo "If you have Convex CLI installed:"
echo ""
echo "  # Start Convex dev server"
echo "  npx convex dev"
echo ""
echo "  # Deploy Convex functions"
echo "  npx convex deploy"
echo ""
echo "  # Open Convex dashboard"
echo "  npx convex dashboard"
echo ""
echo "======================================"
