#!/usr/bin/env node
/**
 * Submit changed URLs to IndexNow (Bing + other participating engines).
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs
 *   node scripts/indexnow-submit.mjs https://thegridnexus.com/tools/gaming-security-checkup
 *   node scripts/indexnow-submit.mjs --file urls.txt
 *
 * With no args, submits the homepage plus the priority tools/hub pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const HOST = 'thegridnexus.com';
const KEY = 'aa8245eb73a4eed4dddf92b938f96cf5';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const DEFAULT_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/tools/gaming-security-checkup`,
  `https://${HOST}/tools/scam-check`,
  `https://${HOST}/games`,
  `https://${HOST}/safety`,
  `https://${HOST}/recover`,
  `https://${HOST}/threats`,
  `https://${HOST}/data`,
  `https://${HOST}/research/state-of-gaming-security-2026`,
  `https://${HOST}/article/gaming-pc-antivirus-best-2026`,
  `https://${HOST}/article/vpn-gaming-security-latency-test-2026`,
];

function collectUrls(argv) {
  const fileIdx = argv.indexOf('--file');
  if (fileIdx !== -1) {
    const filePath = argv[fileIdx + 1];
    if (!filePath) throw new Error('--file requires a path');
    return fs
      .readFileSync(path.resolve(projectRoot, filePath), 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.startsWith('http'));
  }

  const fromArgs = argv.filter((arg) => arg.startsWith('http'));
  return fromArgs.length ? fromArgs : DEFAULT_URLS;
}

async function submit(urlList) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return { status: res.status, text };
}

const urls = [...new Set(collectUrls(process.argv.slice(2)))];
if (!urls.length) {
  console.error('No URLs to submit.');
  process.exit(1);
}

console.log(`IndexNow key file: ${KEY_LOCATION}`);
console.log(`Submitting ${urls.length} URL(s)…`);
const result = await submit(urls);
console.log(`HTTP ${result.status}${result.text ? ` — ${result.text}` : ''}`);
if (result.status !== 200 && result.status !== 202) process.exit(1);
