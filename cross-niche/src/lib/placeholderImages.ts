/**
 * Local placeholder images from /assets (copied from assets/ to public/assets at build).
 * Uses curated tech, gaming, and cybersecurity images that match the platform's themes.
 * Generates unique images per article using article ID/slug as seed.
 */

const ASSETS_BASE = '/assets';

export type ImageTheme = 'tech' | 'security' | 'gaming' | 'ai' | 'cyber' | 'default';

// Local assets: aai.jpg, abstract.jpg, Ai.jpg, box.jpg, circuit.jpg, cyber.jpg, globe.jpg, motherboard.jpg, network.jpg, networking.jpg, tech.jpg, unsplash.jpg
const THEME_IMAGES: Record<ImageTheme, string[]> = {
  tech: [
    `${ASSETS_BASE}/tech.jpg`,
    `${ASSETS_BASE}/circuit.jpg`,
    `${ASSETS_BASE}/motherboard.jpg`,
    `${ASSETS_BASE}/network.jpg`,
    `${ASSETS_BASE}/networking.jpg`,
    `${ASSETS_BASE}/globe.jpg`,
  ],
  security: [
    `${ASSETS_BASE}/cyber.jpg`,
    `${ASSETS_BASE}/network.jpg`,
    `${ASSETS_BASE}/circuit.jpg`,
  ],
  gaming: [
    `${ASSETS_BASE}/tech.jpg`,
    `${ASSETS_BASE}/abstract.jpg`,
    `${ASSETS_BASE}/box.jpg`,
  ],
  ai: [
    `${ASSETS_BASE}/Ai.jpg`,
    `${ASSETS_BASE}/aai.jpg`,
    `${ASSETS_BASE}/tech.jpg`,
    `${ASSETS_BASE}/circuit.jpg`,
  ],
  cyber: [
    `${ASSETS_BASE}/cyber.jpg`,
    `${ASSETS_BASE}/network.jpg`,
    `${ASSETS_BASE}/circuit.jpg`,
  ],
  default: [
    `${ASSETS_BASE}/globe.jpg`,
    `${ASSETS_BASE}/abstract.jpg`,
    `${ASSETS_BASE}/unsplash.jpg`,
    `${ASSETS_BASE}/tech.jpg`,
    `${ASSETS_BASE}/network.jpg`,
  ],
};

/**
 * Generate a unique image selection from article ID/slug for consistent unique images
 */
function generateUniqueImage(theme: ImageTheme, articleId: string | undefined): string {
  const images = THEME_IMAGES[theme];
  if (!articleId) {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }

  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % images.length;
  return images[index];
}

/**
 * Get a themed placeholder image URL. Use when content has no image.
 * @param theme - Context: tech, security, gaming, ai, cyber, or default
 * @param width - Image width (kept for API compatibility; local images use natural size)
 * @param height - Image height (kept for API compatibility)
 * @param articleId - Optional article ID/slug to generate unique image per article
 */
export function getPlaceholderImage(
  theme: ImageTheme = 'default',
  width = 800,
  height = 500,
  articleId?: string
): string {
  return generateUniqueImage(theme, articleId);
}

/** Returns true if URL is HTTPS or local path (avoids mixed content); false for http or invalid. */
export function isSecureImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:');
}

/**
 * Use imageUrl only if secure (HTTPS or local); otherwise return placeholder. Prevents mixed content errors.
 */
export function secureImageUrl(
  url: string | null | undefined,
  placeholder: string
): string {
  return isSecureImageUrl(url) ? url! : placeholder;
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
  if (n === 'technology') return getPlaceholderImage('tech', 800, 500, articleId);
  if (n === 'cybersecurity') return getPlaceholderImage('security', 800, 500, articleId);
  return getPlaceholderImage('default', 800, 500, articleId);
}

/**
 * Get placeholder images for Live Wire / news feeds
 * @param theme - Image theme
 * @param articleId - Optional article ID for unique image per article
 */
export function getLivePlaceholderImage(theme: ImageTheme = 'default', articleId?: string): string {
  const liveImages: Record<ImageTheme, string[]> = {
    tech: [`${ASSETS_BASE}/tech.jpg`, `${ASSETS_BASE}/circuit.jpg`, `${ASSETS_BASE}/motherboard.jpg`, `${ASSETS_BASE}/network.jpg`],
    security: [`${ASSETS_BASE}/cyber.jpg`, `${ASSETS_BASE}/network.jpg`, `${ASSETS_BASE}/circuit.jpg`],
    gaming: [`${ASSETS_BASE}/tech.jpg`, `${ASSETS_BASE}/abstract.jpg`, `${ASSETS_BASE}/box.jpg`],
    ai: [`${ASSETS_BASE}/Ai.jpg`, `${ASSETS_BASE}/aai.jpg`, `${ASSETS_BASE}/tech.jpg`],
    cyber: [`${ASSETS_BASE}/cyber.jpg`, `${ASSETS_BASE}/network.jpg`, `${ASSETS_BASE}/circuit.jpg`],
    default: [`${ASSETS_BASE}/globe.jpg`, `${ASSETS_BASE}/abstract.jpg`, `${ASSETS_BASE}/unsplash.jpg`],
  };
  const images = liveImages[theme] || liveImages.default;
  if (!articleId) {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % images.length;
  return images[index];
}
