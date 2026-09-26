/**
 * Unit tests for prepareArticleContent / markdownToHtml.
 *
 * Regression coverage for the bug where article bodies authored as HTML were
 * escaped and rendered as literal "<p>", "<h2>" and "<div style=…>" text on
 * /article/:slug pages.
 *
 * Run: npx tsx --test scripts/markdownToHtml.test.ts
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { markdownToHtml, prepareArticleContent } from '../src/lib/markdownToHtml';

test('passes HTML article bodies through untouched', () => {
  const body = '<h2>Section</h2>\n<p>Body copy.</p>';
  assert.equal(markdownToHtml(body), body);
});

test('does not escape tags in a mixed HTML body', () => {
  const body = '<p>Intro</p>\n<div style="color:#c8392b">2.8B</div>\n<ul><li>One</li></ul>';
  const out = markdownToHtml(body);
  assert.ok(out.includes('<div style="color:#c8392b">'), 'div markup preserved');
  assert.ok(!out.includes('&lt;div'), 'no escaped tags');
  assert.ok(!out.includes('&lt;p&gt;'), 'no escaped paragraph tags');
});

test('keeps figure and table markup intact', () => {
  const body =
    '<figure><img src="/images/a.png" alt="A" width="1024" height="1536" /><figcaption>Cap</figcaption></figure>\n<table><tbody><tr><td>Cell</td></tr></tbody></table>';
  const out = markdownToHtml(body);
  assert.ok(out.includes('<figure>'));
  assert.ok(out.includes('<figcaption>Cap</figcaption>'));
  assert.ok(out.includes('<td>Cell</td>'));
  assert.ok(!out.includes('&lt;figure'), 'figure not escaped');
});

test('still converts genuine markdown', () => {
  assert.equal(markdownToHtml('## Title'), '<h2>Title</h2>');
  assert.ok(markdownToHtml('**bold**').includes('<strong>bold</strong>'));
  assert.ok(markdownToHtml('- a\n- b').includes('<li>a</li>'));
});

test('leaves prose containing a bare less-than on the markdown path', () => {
  const out = markdownToHtml('Use a value of 5 < 10 for the threshold');
  assert.ok(out.includes('5 &lt; 10'), 'bare < is escaped, not treated as a tag');
});

test('prepareArticleContent returns empty for blank input', () => {
  assert.equal(prepareArticleContent(''), '');
  assert.equal(prepareArticleContent('   '), '');
  assert.equal(prepareArticleContent(null), '');
  assert.equal(prepareArticleContent(undefined), '');
});
