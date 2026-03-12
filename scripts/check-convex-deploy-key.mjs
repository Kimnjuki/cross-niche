#!/usr/bin/env node
/**
 * Pre-deploy safety check: Verify CONVEX_DEPLOY_KEY is present and targets intent-akita-728
 * Exits with error if missing or invalid to prevent deployment drift
 */

const CONVEX_DEPLOY_KEY = process.env.CONVEX_DEPLOY_KEY;
const VITE_CONVEX_URL = process.env.VITE_CONVEX_URL;

console.log('🔍 Pre-deployment safety check...\n');

// Check for CONVEX_DEPLOY_KEY presence
if (!CONVEX_DEPLOY_KEY || CONVEX_DEPLOY_KEY.trim() === '') {
  console.error('❌ ERROR: CONVEX_DEPLOY_KEY is not set!\n');
  console.error('   This environment variable is required for Convex deployment.');
  console.error('   Set it in your environment or .env file:\n');
  console.error('   CONVEX_DEPLOY_KEY=prod:... or CONVEX_DEPLOY_KEY=dev:intent-akita-728|...\n');
  console.error('   Get your deploy key from: https://dashboard.convex.dev → Settings → Deploy Keys\n');
  process.exit(1);
}

// Verify CONVEX_DEPLOY_KEY format: must start with "prod:" or "dev:intent-akita-728"
const validPrefixes = ['prod:', 'dev:intent-akita-728'];
const isValidFormat = validPrefixes.some(prefix => CONVEX_DEPLOY_KEY.startsWith(prefix));

if (!isValidFormat) {
  console.error('❌ ERROR: CONVEX_DEPLOY_KEY has invalid format!\n');
  console.error('   Deploy key must start with one of:');
  console.error('   - prod: (for production deployment)');
  console.error('   - dev:intent-akita-728 (for dev/preview deployment)\n');
  console.error(`   Current value starts with: ${CONVEX_DEPLOY_KEY.substring(0, 20)}...\n`);
  console.error('   Update your CONVEX_DEPLOY_KEY to target intent-akita-728.\n');
  process.exit(1);
}

// Verify VITE_CONVEX_URL matches expected deployment (single source of truth)
const EXPECTED_URL = 'https://intent-akita-728.convex.cloud';
if (!VITE_CONVEX_URL || VITE_CONVEX_URL.trim() === '') {
  console.error('❌ ERROR: VITE_CONVEX_URL is not set!\n');
  console.error('   This is the single source of truth for Convex deployment URL.');
  console.error(`   Set it to: ${EXPECTED_URL}\n`);
  process.exit(1);
}

if (VITE_CONVEX_URL !== EXPECTED_URL) {
  console.error('❌ ERROR: VITE_CONVEX_URL does not match expected deployment!\n');
  console.error(`   Current: ${VITE_CONVEX_URL}`);
  console.error(`   Expected: ${EXPECTED_URL}\n`);
  console.error('   Update VITE_CONVEX_URL to match intent-akita-728 deployment.\n');
  process.exit(1);
}

// Check for canny-mule references (should not exist)
if (CONVEX_DEPLOY_KEY.includes('canny-mule') || 
    VITE_CONVEX_URL.includes('canny-mule')) {
  console.error('❌ ERROR: Found reference to old deployment "canny-mule"!\n');
  console.error('   This deployment should not be used.');
  console.error('   Update your configuration to use: intent-akita-728\n');
  process.exit(1);
}

// All checks passed
console.log('✅ CONVEX_DEPLOY_KEY is set and valid');
console.log(`✅ CONVEX_DEPLOY_KEY format: ${CONVEX_DEPLOY_KEY.startsWith('prod:') ? 'production' : 'dev:intent-akita-728'}`);
console.log(`✅ VITE_CONVEX_URL: ${VITE_CONVEX_URL}`);
console.log('✅ All safety checks passed - deployment can proceed\n');

process.exit(0);
