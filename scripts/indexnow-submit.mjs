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
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyKeyFile() {
  const res = await fetch(KEY_LOCATION, {
    headers: { Accept: 'text/plain,*/*' },
    redirect: 'follow',
  });
  const text = (await res.text()).trim();
  const contentType = res.headers.get('content-type') || '';
  const ok =
    res.ok &&
    text === KEY &&
    !contentType.includes('text/html') &&
    !text.startsWith('<!doctype') &&
    !text.startsWith('<html');

  return { ok, status: res.status, contentType, preview: text.slice(0, 120) };
}

async function postOnce(endpoint, urlList) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { endpoint, status: res.status, text };
}

async function submitWithRetry(urlList, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    for (const endpoint of ENDPOINTS) {
      try {
        const result = await postOnce(endpoint, urlList);
        if (result.status === 200 || result.status === 202) return result;
        lastError = new Error(
          `${endpoint} returned HTTP ${result.status}${result.text ? `: ${result.text}` : ''}`
        );
      } catch (err) {
        lastError = err;
        const cause = err?.cause?.code || err?.code || err?.message;
        console.error(`Attempt ${attempt}/${attempts} failed for ${endpoint}: ${cause}`);
      }
    }
    if (attempt < attempts) await sleep(1500 * attempt);
  }
  throw lastError ?? new Error('IndexNow submit failed');
}

const urls = [...new Set(collectUrls(process.argv.slice(2)))];
if (!urls.length) {
  console.error('No URLs to submit.');
  process.exit(1);
}

console.log(`IndexNow key file: ${KEY_LOCATION}`);
try {
  const keyCheck = await verifyKeyFile();
  if (!keyCheck.ok) {
    console.error(
      [
        'Key file is not live yet (Coolify has not deployed it, or nginx is serving the SPA shell).',
        `HTTP ${keyCheck.status} content-type=${keyCheck.contentType || 'unknown'}`,
        `Body preview: ${keyCheck.preview || '(empty)'}`,
        'Wait for https://thegridnexus.com/aa8245eb73a4eed4dddf92b938f96cf5.txt to return only the key as text/plain, then rerun npm run indexnow.',
        'You can still submit sitemaps in Bing Webmaster Tools without IndexNow.',
      ].join('\n')
    );
    process.exit(2);
  }
  console.log('Key file verified.');
} catch (err) {
  console.error(`Could not fetch key file: ${err?.cause?.code || err.message}`);
  process.exit(2);
}

console.log(`Submitting ${urls.length} URL(s)…`);
try {
  const result = await submitWithRetry(urls);
  console.log(
    `HTTP ${result.status} via ${result.endpoint}${result.text ? ` — ${result.text}` : ''}`
  );
} catch (err) {
  console.error(`IndexNow submit failed: ${err?.cause?.code || err.message}`);
  process.exit(1);
}
