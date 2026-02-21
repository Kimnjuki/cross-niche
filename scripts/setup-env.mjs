#!/usr/bin/env node
/**
 * Copy .env.example to .env if .env does not exist.
 * Ensures app can load credentials (VITE_CONVEX_URL, etc.) when running locally.
 */
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

if (!fs.existsSync(examplePath)) {
  console.warn('No .env.example found. Skipping setup.');
  process.exit(0);
}

if (fs.existsSync(envPath)) {
  console.log('.env already exists. Leave as-is or edit manually.');
  process.exit(0);
}

fs.copyFileSync(examplePath, envPath);
console.log('Created .env from .env.example. Edit .env if you need to change credentials.');
