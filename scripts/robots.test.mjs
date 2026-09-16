import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

const robots = fs.readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
const rules = [...robots.matchAll(/^(Allow|Disallow):\s*(\S+)/gm)].map(([, action, pattern]) => {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return { action, specificity: body.replaceAll('*', '').length, regex: new RegExp(`^${escaped}${anchored ? '$' : ''}`) };
});
function allowed(url) {
  const matches = rules.filter(rule => rule.regex.test(url)).sort((a, b) =>
    b.specificity - a.specificity || (a.action === 'Allow' ? -1 : 1));
  return !matches.length || matches[0].action === 'Allow';
}

test('public editorial and tool routes remain crawlable', () => {
  for (const route of ['/', '/tech', '/security/article', '/gaming/article', '/news', '/guides/example', '/article/example', '/tools/pc-builder', '/security-score', '/breach-sim', '/pillar/gaming-security', '/research/report']) {
    assert.ok(allowed(route), route);
  }
});
test('account, unpublished, API and search/filter states are excluded', () => {
  for (const route of ['/api/content', '/admin', '/admin/editor', '/settings', '/notifications', '/security-profile', '/preview/example', '/draft/example', '/article/example/preview', '/article/example?preview=true', '/topics?search=gaming', '/topics?sort=date&search=gaming', '/explore?filter=tech', '/explore?page=2&filter=gaming']) {
    assert.equal(allowed(route), false, route);
  }
});
test('sitemap index is advertised without blocking the site', () => {
  assert.match(robots, /^Sitemap: https:\/\/thegridnexus\.com\/sitemap-index\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);
});
