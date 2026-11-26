import demotedSlugs from '@/data/demoted-article-slugs.json';
import keptSlugs from '@/data/kept-article-slugs.json';

const KEEP_SLUGS = new Set(keptSlugs);
const DEMOTE_SLUGS = new Set(demotedSlugs);
const DEMOTED_CONTENT_TYPES = new Set(['technology', 'news', 'feature']);

/**
 * Matches scripts/lib/off-niche-articles.mjs so the hydrated article page
 * cannot flip a statically noindexed URL back to index,follow (and vice versa).
 *
 * Explicit `content.noindex` (e.g. fabricated-claim backfill) always wins over
 * KEEP_SLUGS so trust demotions cannot be undone by the GSC reinstatement list.
 */
export function shouldNoindexArticle(article: {
  slug?: string | null;
  niche?: string | null;
  contentType?: string | null;
  noindex?: boolean | null;
} | null | undefined): boolean {
  if (!article) return true;
  if (article.noindex === true) return true;
  if (article.slug && KEEP_SLUGS.has(article.slug)) return false;
  if (article.slug && DEMOTE_SLUGS.has(article.slug)) return true;
  const type = article.contentType ?? article.niche ?? '';
  return DEMOTED_CONTENT_TYPES.has(type);
}
