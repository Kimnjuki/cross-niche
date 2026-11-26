import fs from 'node:fs';

/**
 * Off-niche article filter for the "gaming security for players" pivot.
 *
 * Default rule: demote general-tech / enterprise-AI / news content types.
 * Overrides: KEEP_SLUGS reinstates specific URLs for indexing (GSC coverage),
 * DEMOTE_SLUGS force-demotes fabricated / off-niche pieces.
 *
 * Reversible: add/remove a slug from kept-article-slugs.json or
 * demoted-article-slugs.json. The app still renders demoted articles. They are
 * excluded from the sitemap AND emitted with `noindex, follow` by
 * `generate-static-articles.mjs`, so no existing URL 404s and Google stops
 * spending crawl budget on them.
 *
 * Keep this logic in sync with `src/lib/offNicheArticles.ts`.
 */
const DEMOTED_CONTENT_TYPES = new Set(['technology', 'news', 'feature']);

const KEEP_SLUGS = new Set(
  JSON.parse(
    fs.readFileSync(new URL('../../src/data/kept-article-slugs.json', import.meta.url), 'utf8'),
  ),
);

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
