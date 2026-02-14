/**
 * Free real-life tech, gaming, and cybersecurity images from Unsplash.
 * Uses curated, high-quality images that match the platform's themes.
 * Generates unique images per article using article ID/slug as seed.
 * https://unsplash.com - free, high-quality, no API key required.
 */

const UNSPLASH_BASE = 'https://images.unsplash.com';

export type ImageTheme = 'tech' | 'security' | 'gaming' | 'ai' | 'cyber' | 'default';

// Curated Unsplash images for each theme - real tech, gaming, and cybersecurity content
const THEME_IMAGES: Record<ImageTheme, string[]> = {
  tech: [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800', // Modern computer setup
    'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=800', // Computer chips
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800', // Server room
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800', // Code on screen
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800', // Data center
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800', // Technology abstract
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', // Office workspace
    'https://images.unsplash.com/photo-1550439048-5f4e9c14045c?q=80&w=800', // Modern tech
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800', // Science lab
    'https://images.unsplash.com/photo-1531297484001-8002217f5a07?q=80&w=800', // Laptop workspace
  ],
  security: [
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800', // Cybersecurity lock
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800', // Digital security
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800', // Network security
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800', // Security abstract
    'https://images.unsplash.com/photo-1531297484001-8002217f5a07?q=80&w=800', // Secure workspace
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800', // Security concept
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800', // Data protection
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=800', // Security tech
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', // Secure systems
    'https://images.unsplash.com/photo-1603776844935-aaa0526354c7?q=80&w=800', // Cybersecurity concept
  ],
  gaming: [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800', // Gaming setup
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800', // Gaming room
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800', // Esports arena
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800', // Gaming console
    'https://images.unsplash.com/photo-1516035069371-29a1b24e5e93?q=80&w=800', // VR gaming
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800', // Gaming peripherals
    'https://images.unsplash.com/photo-1493711666828-d5de99175b22?q=80&w=800', // RGB gaming
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800', // Competitive gaming
    'https://images.unsplash.com/photo-1518259083064-dd5e7152e6c3?q=80&w=800', // Gaming tournament
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', // Gaming community
  ],
  ai: [
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800', // AI/VR technology
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800', // Quantum computing
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800', // AI brain
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800', // Machine learning
    'https://images.unsplash.com/photo-1531297484001-8002217f5a07?q=80&w=800', // AI workspace
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800', // AI research
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800', // Neural networks
    'https://images.unsplash.com/photo-1554254656-5a18b8d2bd60?q=80&w=800', // AI technology
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800', // AI systems
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800', // AI lab
  ],
  cyber: [
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800', // Cybersecurity
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800', // Cyber security
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800', // Cyber networks
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800', // Cyber abstract
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', // Cyber systems
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=800', // Cyber tech
    'https://images.unsplash.com/photo-1603776844935-aaa0526354c7?q=80&w=800', // Cyber concept
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800', // Cyber protection
    'https://images.unsplash.com/photo-1531297484001-8002217f5a07?q=80&w=800', // Cyber workspace
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800', // Cyber security
  ],
  default: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800', // Space/tech nexus
    'https://images.unsplash.com/photo-1446776811953-b23d57ea21c3?q=80&w=800', // Grid network
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800', // Technology nexus
    'https://images.unsplash.com/photo-1531297484001-8002217f5a07?q=80&w=800', // Digital nexus
    'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800', // Modern nexus
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800', // Science nexus
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800', // Data nexus
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800', // Server nexus
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800', // Innovation nexus
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800', // Future nexus
  ],
};

/**
 * Generate a unique image selection from article ID/slug for consistent unique images
 */
function generateUniqueImage(theme: ImageTheme, articleId: string | undefined): string {
  const images = THEME_IMAGES[theme];
  if (!articleId) {
    // Fallback: use timestamp to select random image
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }
  
  // Use article ID/slug to create consistent but unique image selection
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use hash to select image consistently
  const index = Math.abs(hash) % images.length;
  return images[index];
}

/**
 * Get a themed real-life image URL. Use when content has no image.
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
  const imageUrl = generateUniqueImage(theme, articleId);
  // Add size parameters to Unsplash URL
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}w=${width}&h=${height}&fit=crop&auto=format`;
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
