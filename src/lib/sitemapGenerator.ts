/**
 * Dynamic Sitemap Generator
 * Generates XML sitemap for SEO optimization
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface Article {
  id: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}

/**
 * Generate XML sitemap string
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => {
    const lastmod = url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : '';
    const changefreq = url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>\n` : '';
    const priority = url.priority !== undefined ? `    <priority>${url.priority}</priority>\n` : '';
    
    return `  <url>\n    <loc>${url.loc}</loc>\n${lastmod}${changefreq}${priority}  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;
}

/**
 * All tool pages with SEO metadata for sitemap + cross-linking.
 * Central registry — update here when tools are added/removed.
 */
export const TOOL_PAGES = [
  { slug: '/tools/security-scanner',        name: 'Security Scanner',               priority: 0.9, changefreq: 'weekly' as const },
  { slug: '/tools/nexusguard',              name: 'NexusGuard',                     priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/security-briefing',       name: 'Security Briefing Room',         priority: 0.7, changefreq: 'weekly' as const },
  { slug: '/tools/vr-cyber-training',       name: 'VR Cyber Training',              priority: 0.6, changefreq: 'weekly' as const },
  { slug: '/tools/steam-scanner',           name: 'Steam Security Scanner',         priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/ioc-lookup',              name: 'IOC Threat-Hunting Lookup',      priority: 0.8, changefreq: 'daily' as const },
  { slug: '/tools/gaming-security-checkup', name: 'Gaming Security Checkup',        priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/breach-explainer',        name: 'Breach Explainer',               priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/ai-tool-finder',          name: 'AI Security Tool Finder',        priority: 0.7, changefreq: 'weekly' as const },
  { slug: '/tools/patch-risk-tracker',      name: 'Game Patch Risk Tracker',        priority: 0.8, changefreq: 'daily' as const },
  { slug: '/tools/zero-trust-quiz',         name: 'Zero-Trust Readiness Quiz',      priority: 0.7, changefreq: 'monthly' as const },
  { slug: '/tools/exploit-risk-meter',      name: 'Exploit Risk Meter',             priority: 0.8, changefreq: 'daily' as const },
  { slug: '/tools/pc-builder',              name: 'AI PC Builder',                  priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/sentiment-analyzer',      name: 'Game Sentiment Analyzer',        priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/news-personalizer',       name: 'AI News Personalizer',           priority: 0.7, changefreq: 'daily' as const },
  { slug: '/tools/recommendation-engine',   name: 'AI Recommendation Engine',       priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/tools/threat-scanner',          name: 'Real-Time Threat Scanner',       priority: 0.9, changefreq: 'daily' as const },
  { slug: '/tools/community-moderator',     name: 'Community AI Moderator',         priority: 0.7, changefreq: 'weekly' as const },
  { slug: '/tools/gaming-copilot',          name: 'Gaming Copilot AI',              priority: 0.9, changefreq: 'daily' as const },
  { slug: '/tools/release-predictor',       name: 'Game Release Predictor',         priority: 0.8, changefreq: 'daily' as const },
  { slug: '/security-score',                name: 'Security Score',                 priority: 0.7, changefreq: 'monthly' as const },
  { slug: '/breach-sim',                    name: 'Breach Simulator',               priority: 0.7, changefreq: 'monthly' as const },
] as const;

export type ToolPageSlug = typeof TOOL_PAGES[number]['slug'];

/** Generate sitemap entries for all tool pages */
export function getToolSitemapUrls(baseUrl: string = 'https://thegridnexus.com'): SitemapUrl[] {
  const today = new Date().toISOString().split('T')[0];
  return TOOL_PAGES.map((t) => ({
    loc: `${baseUrl}${t.slug}`,
    lastmod: today,
    changefreq: t.changefreq,
    priority: t.priority,
  }));
}

/**
 * Get base URLs for sitemap
 */
export function getBaseUrls(baseUrl: string = 'https://thegridnexus.com'): SitemapUrl[] {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    { loc: `${baseUrl}/`,                 lastmod: today, changefreq: 'daily',   priority: 1.0 },
    { loc: `${baseUrl}/tech`,             lastmod: today, changefreq: 'daily',   priority: 0.9 },
    { loc: `${baseUrl}/security`,         lastmod: today, changefreq: 'daily',   priority: 0.9 },
    { loc: `${baseUrl}/gaming`,           lastmod: today, changefreq: 'daily',   priority: 0.9 },
    { loc: `${baseUrl}/blog-series`,      lastmod: today, changefreq: 'daily',   priority: 0.8 },
    { loc: `${baseUrl}/topics`,           lastmod: today, changefreq: 'daily',   priority: 0.9 },
    { loc: `${baseUrl}/guides`,           lastmod: today, changefreq: 'weekly',  priority: 0.7 },
    { loc: `${baseUrl}/tools`,            lastmod: today, changefreq: 'daily',   priority: 0.9 },
    { loc: `${baseUrl}/about`,            lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { loc: `${baseUrl}/contact`,          lastmod: today, changefreq: 'monthly', priority: 0.4 },
    { loc: `${baseUrl}/privacy`,          lastmod: today, changefreq: 'monthly', priority: 0.3 },
    { loc: `${baseUrl}/terms`,            lastmod: today, changefreq: 'monthly', priority: 0.3 },
  ];
}

/**
 * Convert articles to sitemap URLs
 */
export function articlesToSitemapUrls(articles: Article[], baseUrl: string = 'https://thegridnexus.com'): SitemapUrl[] {
  const nicheRoute = (article: Article): string => {
    const niche = (article as any).niche;
    if (niche === 'security') return 'security';
    if (niche === 'gaming') return 'gaming';
    if (niche === 'tech') return 'tech';
    return 'article';
  };
  return articles.map(article => ({
    loc: `${baseUrl}/${nicheRoute(article)}/${article.slug ?? article.id ?? ''}`,
    lastmod: article.updatedAt 
      ? new Date(article.updatedAt).toISOString().split('T')[0]
      : new Date(article.publishedAt).toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.7
  }));
}

/**
 * Generate complete sitemap with articles + tools
 */
export function generateCompleteSitemap(articles: Article[], baseUrl: string = 'https://thegridnexus.com'): string {
  const baseUrls = getBaseUrls(baseUrl);
  const toolUrls = getToolSitemapUrls(baseUrl);
  const articleUrls = articlesToSitemapUrls(articles, baseUrl);
  const allUrls = [...baseUrls, ...toolUrls, ...articleUrls];
  return generateSitemapXML(allUrls);
}
