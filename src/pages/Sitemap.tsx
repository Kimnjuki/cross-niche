/**
 * Human-readable Sitemap page – linked from footer for crawlability (fixes "no incoming internal links" / "no outgoing links").
 * XML sitemap is served statically at /sitemap.xml.
 */

import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';

const SECTION_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/tech', label: 'Tech News' },
  { to: '/security', label: 'Security' },
  { to: '/gaming', label: 'Gaming' },
  { to: '/news', label: 'News' },
  { to: '/explore', label: 'Explore' },
  { to: '/topics', label: 'Topics' },
  { to: '/guides', label: 'Guides' },
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/blog-series', label: 'Blog Series' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/ai-pulse', label: 'AI Pulse' },
  { to: '/breach-sim', label: 'Breach Sim' },
  { to: '/nexus-intersection', label: 'Nexus Intersection' },
  { to: '/security-score', label: 'Security Score' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/media', label: 'Media' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/disclosure', label: 'Disclosure' },
  { to: '/editorial', label: 'Editorial Policy' },
] as const;

export default function Sitemap() {
  return (
    <Layout>
      <SEOHead
        title="Sitemap | The Grid Nexus"
        description="Complete sitemap of all articles, guides, and pages on The Grid Nexus. Find tech, security, and gaming content."
        keywords={['sitemap', 'site map', 'all pages', 'content index']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-4xl mb-4">Sitemap</h1>
        <p className="text-muted-foreground mb-6">
          Complete index of all content on The Grid Nexus. For crawlers and search engines, use the XML sitemap:{' '}
          <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Main sections</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {SECTION_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-primary hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Sitemap files</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="/sitemap.xml" className="text-primary hover:underline">sitemap.xml</a> – Main sitemap (articles and pages)
            </li>
            <li>
              <a href="/sitemap-news.xml" className="text-primary hover:underline">sitemap-news.xml</a> – News sitemap
            </li>
            <li>
              <a href="/robots.txt" className="text-primary hover:underline">robots.txt</a> – Crawl directives
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}

/**
 * Server-side sitemap generation function
 * Use this in your server/API route
 */
export async function generateSitemapResponse() {
  // In a real implementation, fetch content from your database/API
  // For now, return a basic structure
  const baseUrl = 'https://thegridnexus.com';
  const today = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/tech', priority: 0.9, changefreq: 'daily' },
    { loc: '/security', priority: 0.9, changefreq: 'daily' },
    { loc: '/gaming', priority: 0.9, changefreq: 'daily' },
    { loc: '/topics', priority: 0.9, changefreq: 'daily' },
    { loc: '/blog-series', priority: 0.8, changefreq: 'daily' },
    { loc: '/guides', priority: 0.7, changefreq: 'weekly' },
    { loc: '/tutorials', priority: 0.7, changefreq: 'weekly' },
    { loc: '/about', priority: 0.5, changefreq: 'monthly' },
    { loc: '/contact', priority: 0.4, changefreq: 'monthly' },
    { loc: '/privacy', priority: 0.3, changefreq: 'monthly' },
    { loc: '/terms', priority: 0.3, changefreq: 'monthly' },
    { loc: '/disclosure', priority: 0.3, changefreq: 'monthly' },
    { loc: '/roadmap', priority: 0.6, changefreq: 'weekly' },
    { loc: '/security-score', priority: 0.6, changefreq: 'weekly' },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add dynamic article URLs here (fetch from database)
  // For now, articles will be discovered through internal linking

  sitemap += `
</urlset>`;

  return sitemap;
}




