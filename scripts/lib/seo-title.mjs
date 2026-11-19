/**
 * Shared SERP title composer.
 *
 * Problem this solves: several generators appended " | The Grid Nexus" to an
 * already-long topic, producing titles of 61–98 characters that Google
 * truncates mid-phrase (e.g. "Is "Free skin / Nitro / V-Bucks / Riot Points"
 * generators safe? — Avoid | The Grid Nexus" at 98 chars).
 *
 * Design: parts are supplied in descending priority — the searcher's query
 * first, then the differentiator (verdict/scenario), then the brand. The brand
 * is dropped first because Google already prints the site name beside the
 * title, so it is the least valuable use of the character budget. This keeps
 * the words Google matches and the words a searcher clicks.
 *
 * Mirrors the word-boundary truncation in scripts/generate-static-articles.mjs
 * (truncateAtWord) so prerendered HTML and the hydrated SPA agree.
 */

export const SITE_NAME = 'The Grid Nexus';
export const BRAND_SUFFIX = ` | ${SITE_NAME}`;
export const TITLE_MAX = 60;

/** Trim to <= maxLength chars at a word boundary, dropping trailing punctuation. */
function truncateAtWord(str, maxLength) {
  const clean = String(str ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.substring(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  const body = lastSpace > maxLength * 0.6 ? cut.substring(0, lastSpace) : cut;
  // No ellipsis — Google rewrites ellipsis-truncated titles as "incomplete".
  return body.replace(/[\s,;:.–—-]+$/, '');
}

/**
 * Compose a title from priority-ordered parts.
 *
 * @param {string[]} parts Descending priority. Each part carries its own
 *   leading separator where one is wanted (e.g. '— Avoid', ' | The Grid Nexus').
 * @param {number} [max] Character budget (default 60).
 * @returns {string} A title no longer than `max`.
 */
export function composeTitle(parts, max = TITLE_MAX) {
  const cleaned = (parts ?? []).map((p) => String(p ?? '').trim()).filter(Boolean);
  if (cleaned.length === 0) return SITE_NAME;

  let out = cleaned[0];
  for (let i = 1; i < cleaned.length; i++) {
    const candidate = out + cleaned[i];
    if (candidate.length <= max) {
      out = candidate;
    } else {
      // Stop at the first part that does not fit; lower-priority parts are
      // never worth truncating the query to accommodate.
      break;
    }
  }
  return out.length <= max ? out : truncateAtWord(out, max);
}

/**
 * Shorten a subject so that `Is ${subject} safe?` fits the budget, preserving
 * the "safe?" query word that Google matches.
 *
 * @param {string} subject
 * @param {number} [max] Total title budget.
 * @returns {string} The possibly-shortened subject.
 */
export function fitSafetySubject(subject, max = TITLE_MAX) {
  const clean = String(subject ?? '').replace(/\s+/g, ' ').trim();
  // "Is " + subject + " safe?" = subject.length + 10
  const subjectBudget = max - 10;
  if (clean.length <= subjectBudget) return clean;
  return truncateAtWord(clean, subjectBudget);
}