/**
 * Free placeholder images (Picsum Photos) for image placeholders across the site.
 * Uses seeded URLs for consistent, themed images per context.
 * Generates unique images per article using article ID/slug as seed.
 * https://picsum.photos - free, no API key required.
 */

const PICSUM_BASE = 'https://picsum.photos/seed';

export type ImageTheme = 'tech' | 'security' | 'gaming' | 'ai' | 'cyber' | 'default';

const THEME_SEEDS: Record<ImageTheme, string> = {
  tech: 'tech-circuit',
  security: 'security-shield',
  gaming: 'gaming-controller',
  ai: 'ai-neural',
  cyber: 'cyber-network',
  default: 'nexus-grid',
};

/**
 * Generate a unique seed from article ID/slug for consistent unique images
 */
function generateUniqueSeed(theme: ImageTheme, articleId: string | undefined): string {
  const baseSeed = THEME_SEEDS[theme];
  if (!articleId) {
    // Fallback: use timestamp for truly unique image
    return `${baseSeed}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  // Use article ID/slug to create consistent but unique seed
  // Hash the article ID to create a numeric seed (Picsum works better with numeric seeds)
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Combine theme with hashed article ID for unique but themed images
  return `${baseSeed}-${Math.abs(hash)}`;
}

/**
 * Get a themed placeholder image URL. Use when content has no image.
 * @param theme - Context: tech, security, gaming, ai, cyber, or default
 * @param width - Image width (default 800)
 * @param height - Image height (default 500)
 * @param articleId - Optional article ID/slug to generate unique image per article
 */
export function getPlaceholderImage(
  theme: ImageTheme = 'default',
  width = 800,
  height = 500,
  articleId?: string
): string {
  const seed = articleId ? generateUniqueSeed(theme, articleId) : THEME_SEEDS[theme];
  return `${PICSUM_BASE}/${encodeURIComponent(seed)}/${width}/${height}`;
}

/**
 * Get placeholder by niche (tech | security | gaming)
 * @param niche - Niche type
 * @param articleId - Optional article ID/slug for unique image per article
 */
export function getPlaceholderByNiche(niche: string, articleId?: string): string {
  const n = niche?.toLowerCase();
  if (n === 'tech') return getPlaceholderImage('tech', 800, 500, articleId);
  if (n === 'security') return getPlaceholderImage('security', 800, 500, articleId);
  if (n === 'gaming') return getPlaceholderImage('gaming', 800, 500, articleId);
  return getPlaceholderImage('default', 800, 500, articleId);
}
