/**
 * Free placeholder images (Picsum Photos) for image placeholders across the site.
 * Uses seeded URLs for consistent, themed images per context.
 * https://picsum.photos - free, no API key required.
 */

const PICSUM_BASE = 'https://picsum.photos/seed';

export type ImageTheme = 'tech' | 'security' | 'gaming' | 'ai' | 'cyber' | 'default';

const THEME_SEEDS: Record<ImageTheme, string> = {
  tech: 'tech-circuit-1',
  security: 'security-shield-1',
  gaming: 'gaming-controller-1',
  ai: 'ai-neural-1',
  cyber: 'cyber-network-1',
  default: 'nexus-grid-1',
};

/**
 * Get a themed placeholder image URL. Use when content has no image.
 * @param theme - Context: tech, security, gaming, ai, cyber, or default
 * @param width - Image width (default 800)
 * @param height - Image height (default 500)
 */
export function getPlaceholderImage(
  theme: ImageTheme = 'default',
  width = 800,
  height = 500
): string {
  const seed = THEME_SEEDS[theme];
  return `${PICSUM_BASE}/${encodeURIComponent(seed)}/${width}/${height}`;
}

/**
 * Get placeholder by niche (tech | security | gaming)
 */
export function getPlaceholderByNiche(niche: string): string {
  const n = niche?.toLowerCase();
  if (n === 'tech') return getPlaceholderImage('tech');
  if (n === 'security') return getPlaceholderImage('security');
  if (n === 'gaming') return getPlaceholderImage('gaming');
  return getPlaceholderImage('default');
}
