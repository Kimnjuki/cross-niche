/**
 * Entity-first readiness audit — scores each article on the signals AI/RAG
 * systems look for before citing a source (Pillar 2):
 *   1. question-based H2/H3 headings ("How do I…?")
 *   2. data tables (<table>)
 *   3. FAQ section
 *   4. Key Takeaways / summary block
 *   5. direct-answer opening paragraph (30–120 words, no preamble)
 *
 * Lowest-scoring guides are the ones to restructure first for GEO/AI Overviews.
 *
 * Usage: node scripts/audit-entity-first.mjs [topN]
 */
import { loadPublishedContent } from './lib/content-source.mjs';
import { markdownToHtml } from './lib/markdown-to-html.mjs';

const topN = parseInt(process.argv[2] || '40', 10);

const { items } = await loadPublishedContent();

function stripHtml(html) {
  return String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const results = items.map((a) => {
  // Bodies are stored as Markdown (99/102); score the RENDERED structure by
  // converting to HTML first, otherwise Markdown headings/tables are invisible.
  const body = markdownToHtml(String(a.body || ''));

  const questionHeadings = (body.match(/<h[23][^>]*>[^<]*\?[^<]*<\/h[23]>/gi) || []).length;
  const dataTables = (body.match(/<table>/gi) || []).length;
  const hasFAQ = /(faq|frequently asked|common questions)/i.test(body);
  const hasKeyTakeaways = /(key takeaways|tl;?dr|summary)/i.test(body);

  const firstP = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  const firstPWords = stripHtml(firstP).split(/\s+/).filter(Boolean).length;
  const directAnswer = firstPWords >= 30 && firstPWords <= 120;

  const score = [questionHeadings > 0, dataTables > 0, hasFAQ, hasKeyTakeaways, directAnswer]
    .filter(Boolean).length;

  return {
    slug: a.slug,
    title: a.metaTitle || a.title,
    score,
    questionHeadings,
    dataTables,
    hasFAQ,
    hasKeyTakeaways,
    directAnswer,
  };
});

// Focus on guide/tutorial/security content — the high-intent pages worth GEO effort.
const candidates = results.filter((r) => /guide|how.?to|tutorial|security|hardening|protect|recover/i.test(r.title));
candidates.sort((a, b) => a.score - b.score || b.questionHeadings - a.questionHeadings);

const shown = candidates.slice(0, topN);
console.log(`\nEntity-first readiness — ${candidates.length} candidate articles, showing lowest-scored ${shown.length}:\n`);
console.log(`Sc  QH  Tbl  FAQ  KT   DA   Title`);
for (const r of shown) {
  const flag = (b) => (b ? 'Y' : '·');
  console.log(
    ` ${r.score}   ${String(r.questionHeadings).padStart(2)}  ${String(r.dataTables).padStart(3)}   ` +
    `${flag(r.hasFAQ)}   ${flag(r.hasKeyTakeaways)}   ${flag(r.directAnswer)}  ${r.title.slice(0, 58)}`,
  );
}

const avg = (candidates.reduce((s, r) => s + r.score, 0) / Math.max(candidates.length, 1)).toFixed(1);
console.log(`\nAverage readiness score: ${avg}/5. Restructure the lowest-scored first.`);
