#!/usr/bin/env node
/**
 * Migration Script: Deploy all Convex functions and schema to intent-akita-728
 * 
 * This script ensures all changes from the old deployment (canny-mule) 
 * are deployed to the new deployment (intent-akita-728).
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Migrating Convex deployment to intent-akita-728...\n');

// Check environment variables
const CONVEX_DEPLOY_KEY = process.env.CONVEX_DEPLOY_KEY;
const VITE_CONVEX_URL = process.env.VITE_CONVEX_URL;

// Expected values
const EXPECTED_URL = 'https://intent-akita-728.convex.cloud';

console.log('📋 Pre-deployment checks:\n');

// Verify CONVEX_DEPLOY_KEY
if (!CONVEX_DEPLOY_KEY || CONVEX_DEPLOY_KEY.trim() === '') {
  console.error('❌ ERROR: CONVEX_DEPLOY_KEY is not set!\n');
  console.error('   Set it in your environment or .env.local file.\n');
  process.exit(1);
}

// Verify deploy key format
const validPrefixes = ['prod:', 'dev:intent-akita-728'];
const isValidFormat = validPrefixes.some(prefix => CONVEX_DEPLOY_KEY.startsWith(prefix));

if (!isValidFormat) {
  console.error('❌ ERROR: CONVEX_DEPLOY_KEY format is invalid!\n');
  console.error('   Must start with "prod:" or "dev:intent-akita-728"\n');
  process.exit(1);
}

// Verify VITE_CONVEX_URL
if (!VITE_CONVEX_URL || VITE_CONVEX_URL !== EXPECTED_URL) {
  console.warn('⚠️  WARNING: VITE_CONVEX_URL does not match expected deployment');
  console.warn(`   Current: ${VITE_CONVEX_URL || 'not set'}`);
  console.warn(`   Expected: ${EXPECTED_URL}\n`);
}

console.log('✅ CONVEX_DEPLOY_KEY is set and valid');
console.log(`✅ Deploy key format: ${CONVEX_DEPLOY_KEY.startsWith('prod:') ? 'production' : 'dev:intent-akita-728'}`);
if (VITE_CONVEX_URL) {
  console.log(`✅ VITE_CONVEX_URL: ${VITE_CONVEX_URL}`);
}
console.log('');

// Check Convex directory exists
const convexDir = path.join(__dirname, '..', 'convex');
if (!fs.existsSync(convexDir)) {
  console.error('❌ ERROR: convex/ directory not found!\n');
  process.exit(1);
}

console.log('📦 Convex functions found:\n');

// List all TypeScript files in convex directory
const convexFiles = fs.readdirSync(convexDir)
  .filter(file => file.endsWith('.ts') && file !== 'tsconfig.json')
  .map(file => `  • ${file}`)
  .join('\n');

console.log(convexFiles);
console.log('');

// Deploy to intent-akita-728
console.log('🚀 Deploying to intent-akita-728...\n');

try {
  // Run deployment
  const deployOutput = execSync('npx convex deploy --yes', {
    encoding: 'utf-8',
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      CONVEX_DEPLOY_KEY: CONVEX_DEPLOY_KEY,
    }
  });

  console.log('\n✅ Deployment completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('   1. Verify deployment in Convex Dashboard');
  console.log('   2. Check that all functions are available');
  console.log('   3. Verify schema is updated');
  console.log('   4. Test your application\n');

} catch (error) {
  console.error('\n❌ Deployment failed!\n');
  console.error('Error:', error.message);
  console.error('\nTroubleshooting:');
  console.error('   1. Ensure CONVEX_DEPLOY_KEY is set correctly');
  console.error('   2. Run: npx convex login');
  console.error('   3. Check Convex Dashboard for deployment status\n');
  process.exit(1);
}
