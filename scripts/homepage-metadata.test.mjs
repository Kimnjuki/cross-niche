import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

// Strip scripts so DOM-writing JavaScript cannot satisfy crawler checks.
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const head = html.split('</head>')[0].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

test('homepage raw HTML contains exactly one canonical URL', () => {
  const links = [...head.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/gi)];
  assert.equal(links.length, 1);
  assert.match(links[0][0], /href="https:\/\/thegridnexus\.com\/"/);
});

test('homepage raw HTML contains one description of 50–160 characters', () => {
  const descriptions = [...head.matchAll(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/gi)];
  assert.equal(descriptions.length, 1);
  const length = descriptions[0][1].length;
  assert.ok(length >= 50 && length <= 160, `Description has ${length} characters`);
});
