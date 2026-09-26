/**
 * Guard rail for the duplicated article-body normalisation logic.
 *
 * src/lib/articleHtml.ts is what the React app runs at render time;
 * scripts/lib/normalize-article-html.mjs is the build-time mirror used by the
 * feed / static-article generators (plain Node cannot import TypeScript). This
 * script runs both over the same corpus and fails if they ever disagree, and
 * checks the markdown converter produces real lists rather than literal bullet
 * characters.
 *
 * Run: npm run verify:article-html
 */
import { expandInlineBulletRuns, repairMojibake, normalizeArticleHtml } from '../src/lib/articleHtml';
import { markdownToHtml } from '../src/lib/markdownToHtml';

type Mirror = {
  repairMojibake: (input: string | null | undefined) => string;
  expandInlineBulletRuns: (html: string) => string;
  normalizeArticleHtml: (html: string | null | undefined) => string;
};

const mirror = (await import(new URL('./lib/normalize-article-html.mjs', import.meta.url).href)) as Mirror;

// Mojibake the way it actually arrives: UTF-8 bytes read back as Windows-1252.
const EM_DASH = '\u2014';
const EM_DASH_MOJIBAKE = '\u00e2\u20ac\u201d';
const RSQUO = '\u2019';
const RSQUO_MOJIBAKE = '\u00e2\u20ac\u2122';
const BULLET = '\u2022';
const BULLET_MOJIBAKE = '\u00e2\u20ac\u00a2';
const EACUTE = '\u00e9';
const EACUTE_MOJIBAKE = '\u00c3\u00a9';

const failures: string[] = [];

function check(label: string, actual: unknown, expected: unknown): void {
  if (actual !== expected) {
    failures.push(`${label}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`);
  }
}

function checkTrue(label: string, condition: boolean): void {
  if (!condition) failures.push(`${label}\n    condition was false`);
}

/* ------------------------------------------------------------------ *
 * 1. Encoding repair
 * ------------------------------------------------------------------ */

check('em dash mojibake is repaired', repairMojibake(`a ${EM_DASH_MOJIBAKE} b`), `a ${EM_DASH} b`);
check('curly apostrophe mojibake is repaired', repairMojibake(`it${RSQUO_MOJIBAKE}s`), `it${RSQUO}s`);
check('accented letter mojibake is repaired', repairMojibake(`caf${EACUTE_MOJIBAKE}`), `caf${EACUTE}`);
check('bullet mojibake becomes a real bullet', repairMojibake(`a ${BULLET_MOJIBAKE} b`), `a ${BULLET} b`);
check('clean text is untouched', repairMojibake('Plain ASCII text.'), 'Plain ASCII text.');
check('legitimate accented prose survives', repairMojibake('p\u00e2te \u00e0 la mode'), 'p\u00e2te \u00e0 la mode');
check('lone lead byte is left alone', repairMojibake('\u00e2XY'), '\u00e2XY');
check('empty input', repairMojibake(''), '');

/* ------------------------------------------------------------------ *
 * 2. Inline bullet runs
 * ------------------------------------------------------------------ */

const bulletRun = `<p>Common mistakes:${BULLET} weak passwords${BULLET} reused credentials${BULLET} no 2FA</p>`;
const bulletExpanded = expandInlineBulletRuns(bulletRun);
checkTrue('bullet run keeps its lead-in paragraph', bulletExpanded.startsWith('<p>Common mistakes:</p>'));
checkTrue('bullet run becomes a <ul>', bulletExpanded.includes('<ul>'));
check('bullet run item count', (bulletExpanded.match(/<li>/g) ?? []).length, 3);
checkTrue('bullet character is gone', !bulletExpanded.includes(BULLET));

check('single bullet is left alone', expandInlineBulletRuns(`<p>Note${BULLET} one thing</p>`), `<p>Note${BULLET} one thing</p>`);
check(
  'existing lists are never rewritten',
  expandInlineBulletRuns(`<ul><li>${BULLET} a</li><li>${BULLET} b</li></ul>`),
  `<ul><li>${BULLET} a</li><li>${BULLET} b</li></ul>`,
);
check('paragraph without bullets is untouched', expandInlineBulletRuns('<p>Nothing here.</p>'), '<p>Nothing here.</p>');

/* ------------------------------------------------------------------ *
 * 3. The two implementations must agree
 * ------------------------------------------------------------------ */

const corpus = [
  '',
  'Plain ASCII text.',
  `<p>A ${EM_DASH_MOJIBAKE} B</p>`,
  bulletRun,
  `<p>Note${BULLET} one thing</p>`,
  `<ul><li>${BULLET} a</li></ul>`,
  `<h2>Takeaways ${EM_DASH_MOJIBAKE}</h2>\n<p>It${RSQUO_MOJIBAKE}s fine.</p>`,
  `<p>Mixed ${BULLET_MOJIBAKE} ${EM_DASH_MOJIBAKE} ${EACUTE_MOJIBAKE}</p>`,
];

for (const sample of corpus) {
  const label = JSON.stringify(sample.slice(0, 40));
  check(`mirror repairMojibake(${label})`, mirror.repairMojibake(sample), repairMojibake(sample));
  check(
    `mirror expandInlineBulletRuns(${label})`,
    mirror.expandInlineBulletRuns(sample),
    expandInlineBulletRuns(sample),
  );
  check(
    `mirror normalizeArticleHtml(${label})`,
    mirror.normalizeArticleHtml(sample),
    normalizeArticleHtml(sample),
  );
}

/* ------------------------------------------------------------------ *
 * 4. Normalisation is idempotent (render + build must not double-apply)
 * ------------------------------------------------------------------ */

for (const sample of [...corpus, bulletRun.replace(BULLET, BULLET_MOJIBAKE)]) {
  const once = normalizeArticleHtml(sample);
  const label = JSON.stringify(sample.slice(0, 40));
  check(`normalizeArticleHtml is idempotent for ${label}`, normalizeArticleHtml(once), once);
}

/* ------------------------------------------------------------------ *
 * 5. Markdown path: bullets must become lists, not literal characters
 * ------------------------------------------------------------------ */

const mdDashList = markdownToHtml('- weak passwords\n- reused credentials\n- no 2FA');
checkTrue('markdown "- " list becomes a <ul>', mdDashList.includes('<ul>'));
check('markdown "- " list item count', (mdDashList.match(/<li>/g) ?? []).length, 3);
checkTrue('markdown "- " list keeps no bullet characters', !mdDashList.includes('- '));

const mdStarList = markdownToHtml('* first\n* second');
checkTrue('markdown "* " list is not italicised', !mdStarList.includes('<em>'));
check('markdown "* " list item count', (mdStarList.match(/<li>/g) ?? []).length, 2);

const mdOrdered = markdownToHtml('1. one\n2. two');
checkTrue('markdown ordered list becomes an <ol>', mdOrdered.includes('<ol>'));
check('markdown ordered list item count', (mdOrdered.match(/<li>/g) ?? []).length, 2);

const mdLede = markdownToHtml('Intro paragraph.\n- a\n- b');
checkTrue('markdown lede stays its own paragraph', mdLede.includes('<p>Intro paragraph.</p>'));
checkTrue(
  'markdown list is a sibling of the lede paragraph',
  !mdLede.includes('<ul>') || mdLede.indexOf('<ul>') > mdLede.indexOf('</p>'),
);

checkTrue('markdown bold still works', markdownToHtml('**bold** text').includes('<strong>bold</strong>'));
checkTrue('markdown italic still works', markdownToHtml('plain *italic* text').includes('<em>italic</em>'));

const htmlPassthrough = markdownToHtml(`<p style="color:red">Lead:${BULLET} a${BULLET} b</p>`);
checkTrue('HTML bodies are not escaped', htmlPassthrough.includes('style="color:red"'));
checkTrue('HTML bodies still get bullet repair', htmlPassthrough.includes('<ul>'));
checkTrue('HTML bodies still get encoding repair', markdownToHtml(`<p>x ${EM_DASH_MOJIBAKE} y</p>`).includes(EM_DASH));

checkTrue('prose with "<" is still treated as markdown', markdownToHtml('5 < 10 and *3* > 2').includes('&lt;'));

/* ------------------------------------------------------------------ */

if (failures.length) {
  console.error(`[verify-article-html] ${failures.length} check(s) failed:\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}

console.log(`[verify-article-html] OK — ${corpus.length} corpus samples, TS module and build mirror agree.`);
