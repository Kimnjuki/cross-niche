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
 * Get base URLs for sitemap
 */
export function getBaseUrls(baseUrl: string = 'https://thegridnexus.com'): SitemapUrl[] {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/tech`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/security`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/gaming`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/blog-series`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/topics`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/guides`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.4
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.3
    }
  ];
}

/**
 * Convert articles to sitemap URLs
 */
export function articlesToSitemapUrls(articles: Article[], baseUrl: string = 'https://thegridnexus.com'): SitemapUrl[] {
  return articles.map(article => ({
    loc: `${baseUrl}/article/${article.slug ?? article.id ?? ''}`,
    lastmod: article.updatedAt 
      ? new Date(article.updatedAt).toISOString().split('T')[0]
      : new Date(article.publishedAt).toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.7
  }));
}

/**
 * Generate complete sitemap with articles
 */
export function generateCompleteSitemap(articles: Article[], baseUrl: string = 'https://thegridnexus.com'): string {
  const baseUrls = getBaseUrls(baseUrl);
  const articleUrls = articlesToSitemapUrls(articles, baseUrl);
  const allUrls = [...baseUrls, ...articleUrls];
  return generateSitemapXML(allUrls);
}






