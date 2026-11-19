import fs from 'node:fs';

/**
 * Off-niche article filter for the "gaming security for players" pivot.
 *
 * Default rule: demote general-tech / enterprise-AI / news content types.
 * Overrides: keep gaming-security articles mislabeled under those types, and
 * demote enterprise-security + non-security gaming reviews/news that sit in
 * the `security` and `gaming` types.
 *
 * Reversible: remove a slug from a set to re-index it. The app still renders
 * demoted articles. They are excluded from the sitemap AND emitted with
 * `noindex, follow` by `generate-static-articles.mjs`, so no existing URL 404s
 * and Google stops spending crawl budget on them.
 */
const DEMOTED_CONTENT_TYPES = new Set(['technology', 'news', 'feature']);

const KEEP_SLUGS = new Set([
  // Empty by design. The "gaming-security" articles that were previously
  // force-kept here under a demoted contentType (windows-11 anti-cheat, vpn
  // test, gaming-headset, and the four game-* "feature" pieces) were AI-
  // generated with fabricated claims and are now demoted with the rest of the
  // batch. Keep nothing by exception — on-niche now means the contentType is
  // on-niche AND the article is honest, which is enforced by DEMOTE_SLUGS.
]);

const DEMOTE_SLUGS = new Set(
  JSON.parse(
    fs.readFileSync(new URL('../../src/data/demoted-article-slugs.json', import.meta.url), 'utf8'),
  ),
);

/** True when an article belongs in the gaming-security sitemap. */
export function isOnNicheArticle(article) {
  const slug = article.slug;
  const type = article.contentType ?? article.niche;
  if (KEEP_SLUGS.has(slug)) return true;
  if (DEMOTE_SLUGS.has(slug)) return false;
  return !DEMOTED_CONTENT_TYPES.has(type);
}
