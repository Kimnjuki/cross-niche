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
  for (const route of ['/', '/tech', '/security/article', '/gaming/article', '/news', '/guides/example', '/article/example', '/author/jane-doe', '/tools/pc-builder', '/security-score', '/breach-sim', '/pillar/gaming-security', '/research/report', '/topics', '/explore', '/topics?page=2', '/explore?sort=date']) {
    assert.ok(allowed(route), route);
  }
});
/**
 * Routes that carry a `<meta name="robots" content="noindex">` tag in their
 * static shell (see NON_INDEXABLE_ROUTES in scripts/lib/route-metadata.mjs).
 *
 * These MUST stay crawlable in robots.txt. Google cannot read a noindex tag on
 * a page it is not allowed to fetch, so a Disallow rule here does not keep the
 * URL out of the index — it strands it in "Discovered, currently not indexed"
 * permanently, which is exactly the failure mode this remediation is fixing.
 * The directive is read from the page, so the page has to be fetchable.
 */
const NOINDEXED_BUT_CRAWLABLE = [
  '/signin', '/signup', '/settings', '/bookmarks', '/notifications',
  '/profile', '/security-profile', '/subscription', '/subscription/management',
  '/newsletter/verify', '/simple', '/enhanced', '/enhanced-simple',
  '/original-index', '/tools-old', '/seo-checklist', '/keyword-gap-analysis',
  '/sitemap', '/api',
];

test('noindexed routes stay crawlable so the directive can be read', () => {
  for (const route of NOINDEXED_BUT_CRAWLABLE) {
    assert.equal(allowed(route), true, `${route} must not be Disallowed in robots.txt`);
  }
});

test('admin, unpublished and search/filter states are excluded', () => {
  for (const route of ['/admin', '/admin/editor', '/preview/example', '/draft/example', '/article/example/preview', '/article/example?preview=true', '/topics?search=gaming', '/topics?sort=date&search=gaming', '/explore?filter=tech', '/explore?page=2&filter=gaming', '/article/example/edit', '/article-detail']) {
    assert.equal(allowed(route), false, route);
  }
});

test('no Disallow rule targets a route that also emits noindex', () => {
  // Guards against re-introducing the contradiction above. Any Disallow whose
  // pattern matches a noindexed route is a bug, not a hardening measure.
  const contradictions = [];
  for (const route of NOINDEXED_BUT_CRAWLABLE) {
    const blocked = rules.some(
      (rule) => rule.action === 'Disallow' && rule.regex.test(route)
    );
    if (blocked) contradictions.push(route);
  }
  assert.deepEqual(contradictions, [], `Disallow rules contradict noindex: ${contradictions.join(', ')}`);
});
test('sitemap index is advertised without blocking the site', () => {
  assert.match(robots, /^Sitemap: https:\/\/thegridnexus\.com\/sitemap-index\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);
});
