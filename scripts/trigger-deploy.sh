#!/bin/bash
# Manual Coolify deploy trigger for thegridnexus.com
# Run this if auto-deploy is not working

echo "=== Triggering Coolify Deploy for thegridnexus.com ==="

# Coolify instance
COOLIFY_URL="https://coolify.cheapwebstack.com"
APP_UUID="hgwsc8swsks4o4woowcg08ws"

# Method 1: Deploy webhook (if configured)
echo ""
echo "Method 1: Deploy webhook..."
curl -s -X POST \
  "$COOLIFY_URL/api/v1/deploy?uuid=$APP_UUID&tag=latest&force=true" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" 2>/dev/null

echo ""
echo ""
echo "Method 2: Force re-deploy via Coolify API..."
# If you have an API token, add -H "Authorization: Bearer YOUR_TOKEN"
curl -s -X GET \
  "$COOLIFY_URL/api/v1/deploy?force=true&tag=latest" \
  -H "Accept: application/json" 2>/dev/null

echo ""
echo ""
echo "=== Done ==="
echo "Check deploy status at: $COOLIFY_URL/project/$APP_UUID"
echo ""
echo "Or wait for Coolify auto-deploy from GitHub push."
