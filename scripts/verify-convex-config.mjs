#!/usr/bin/env node
/**
 * Verify Convex Configuration Consistency
 * Checks that all config files use intent-akita-728 and CONVEX_DEPLOY_KEY is prioritized
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const EXPECTED_URL = 'https://intent-akita-728.convex.cloud';
const EXPECTED_DEPLOYMENT = 'intent-akita-728';
const OLD_DEPLOYMENT = 'canny-mule';

console.log('🔍 Verifying Convex Configuration...\n');

let errors = [];
let warnings = [];

// Check .env.example
const envExamplePath = path.join(projectRoot, '.env.example');
if (fs.existsSync(envExamplePath)) {
  const content = fs.readFileSync(envExamplePath, 'utf-8');
  if (!content.includes(EXPECTED_URL)) {
    errors.push('.env.example: VITE_CONVEX_URL should be ' + EXPECTED_URL);
  }
  if (content.includes(OLD_DEPLOYMENT)) {
    errors.push('.env.example: Contains reference to old deployment ' + OLD_DEPLOYMENT);
  }
  if (!content.includes('CONVEX_DEPLOY_KEY')) {
    warnings.push('.env.example: Should include CONVEX_DEPLOY_KEY');
  }
}

// Check .convex.env
const convexEnvPath = path.join(projectRoot, '.convex.env');
if (fs.existsSync(convexEnvPath)) {
  const content = fs.readFileSync(convexEnvPath, 'utf-8');
  if (!content.includes(EXPECTED_DEPLOYMENT)) {
    errors.push('.convex.env: Should reference ' + EXPECTED_DEPLOYMENT);
  }
  if (content.includes(OLD_DEPLOYMENT)) {
    errors.push('.convex.env: Contains reference to old deployment ' + OLD_DEPLOYMENT);
  }
}

// Check package.json scripts
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(content);
  
  // Check deploy:convex script - must be exactly "npx convex deploy --yes"
  if (packageJson.scripts['deploy:convex'] !== 'npx convex deploy --yes') {
    errors.push('package.json: deploy:convex must be exactly "npx convex deploy --yes" (environment-driven)');
  }
  
  // Check predeploy:convex hook exists
  if (!packageJson.scripts['predeploy:convex']) {
    warnings.push('package.json: Missing predeploy:convex hook for safety checks');
  }
  
  // Check for old deployment references
  if (content.includes(OLD_DEPLOYMENT)) {
    warnings.push('package.json: Contains reference to old deployment ' + OLD_DEPLOYMENT);
  }
  
  // Check build scripts
  if (packageJson.scripts['build:convex'] && 
      !packageJson.scripts['build:convex'].includes(EXPECTED_URL)) {
    warnings.push('package.json: build:convex should use ' + EXPECTED_URL);
  }
}

// Check Dockerfile
const dockerfilePath = path.join(projectRoot, 'Dockerfile');
if (fs.existsSync(dockerfilePath)) {
  const content = fs.readFileSync(dockerfilePath, 'utf-8');
  if (!content.includes(EXPECTED_URL)) {
    warnings.push('Dockerfile: VITE_CONVEX_URL default should be ' + EXPECTED_URL);
  }
  if (content.includes(OLD_DEPLOYMENT)) {
    errors.push('Dockerfile: Contains reference to old deployment ' + OLD_DEPLOYMENT);
  }
}

// Report results
if (errors.length > 0) {
  console.error('❌ ERRORS FOUND:\n');
  errors.forEach(err => console.error(`   • ${err}`));
  console.error('');
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('⚠️  WARNINGS:\n');
  warnings.forEach(warn => console.warn(`   • ${warn}`));
  console.warn('');
}

console.log('✅ Configuration verified:');
console.log(`   • VITE_CONVEX_URL: ${EXPECTED_URL}`);
console.log(`   • Deployment: ${EXPECTED_DEPLOYMENT}`);
console.log(`   • No references to ${OLD_DEPLOYMENT}`);
console.log('');

process.exit(0);
