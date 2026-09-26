/**
 * Extract FAQ question/answer pairs from an article body.
 *
 * The published bodies carry their own "Frequently Asked Questions" section
 * (`<h2>Frequently Asked Questions</h2>` followed by `<h3>question</h3>` /
 * `<p>answer</p>` pairs). The page renders that section as part of the article,
 * so the FAQ UI must not be rendered a second time underneath it — but the
 * FAQPage structured data still has to exist for rich results.
 *
 * Regex-based on purpose: this runs in the browser bundle and during the
 * prerender pass, where no DOM parser is guaranteed to be available.
 */

export interface ExtractedFaq {
  question: string;
  answer: string;
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
};

function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The slice of the body between the FAQ heading and the next h2 (e.g. Sources). */
function faqSlice(content: string): string | null {
  const startMatch = /<h2[^>]*>[^<]*frequently asked questions[^<]*<\/h2>/i.exec(content);
  if (!startMatch) return null;

  const rest = content.slice(startMatch.index + startMatch[0].length);
  const nextH2 = /<h2[^>]*>/i.exec(rest);
  return nextH2 ? rest.slice(0, nextH2.index) : rest;
}

export function extractFaqsFromHtml(content: string | null | undefined): ExtractedFaq[] {
  if (!content || typeof content !== 'string') return [];

  const slice = faqSlice(content) ?? '';
  if (!slice) return [];

  const faqs: ExtractedFaq[] = [];
  const pair = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi;

  for (const match of slice.matchAll(pair)) {
    const question = toPlainText(match[1]);
    const answer = toPlainText(match[2]);
    if (question.length < 8 || answer.length < 20) continue;
    faqs.push({ question, answer });
  }

  return faqs;
}
