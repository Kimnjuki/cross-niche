/** @type {import('next-sitemap').IConfig } */
export default {
  siteUrl: 'https://thegridnexus.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  
  // Exclude non-canonical and duplicate pages (FIX-005)
  exclude: [
    '/admin/*',
    '/api/*',
    '/auth/*',
    '/profile',
    '/search',
    '/wp-admin/*',
    '/wp-includes/*',
    '/*?s=*',
    '/*?ref=*',
    '/*?utm_source=*',
    '/*?page=1',
  ],

  // Transform URLs to ensure canonical format
  transform: async (config, path) => {
    // Remove trailing slash for consistency with next.config.js
    const canonicalPath = path.replace(/\/$/, '') || '/';
    
    return {
      loc: canonicalPath,
      changefreq: 'weekly',
      priority: getPriority(canonicalPath),
      lastmod: new Date().toISOString(),
    };
  },

  // Additional sitemaps
  additionalSitemaps: [
    'https://thegridnexus.com/sitemap-news.xml',
  ],

  // Robots.txt configuration (FIX-006)
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile',
          '/auth',
          '/auth/',
          '/wp-admin/',
          '/wp-includes/',
          '/search/',
          '/*?s=',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/profile', '/auth'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/auth'],
      },
      // AI Crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://thegridnexus.com/sitemap.xml',
      'https://thegridnexus.com/sitemap-news.xml',
    ],
  },
};

// Helper function to determine priority based on URL pattern
function getPriority(path) {
  if (path === '/') return 1.0;
  if (path.startsWith('/tech') || path.startsWith('/security') || path.startsWith('/gaming')) return 0.9;
  if (path.startsWith('/article/')) return 0.8;
  if (path.startsWith('/news') || path.startsWith('/topics')) return 0.7;
  if (path.startsWith('/guides') || path.startsWith('/blog-series')) return 0.6;
  return 0.5;
}
