/**
 * Dynamic Sitemap Route
 * Generates XML sitemap on-the-fly for SEO
 */

import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { usePublishedContent } from '@/hooks/useContent';
import { generateCompleteSitemap } from '@/lib/sitemapGenerator';
import { mapContentToArticles } from '@/lib/contentMapper';

export default function Sitemap() {
  const { data: content } = usePublishedContent(1000); // Get all published content
  
  useEffect(() => {
    if (content) {
      const articles = mapContentToArticles(content);
      // Note: generateCompleteSitemap expects specific Article type
      // For now, sitemap is generated statically in public/sitemap.xml
      // This component is for human-readable sitemap page
      
      // Set content type and return XML
      const blob = new Blob([sitemapXML], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // For server-side rendering, you'd return this as XML response
      // For client-side, we'll handle it differently
      console.log('Sitemap generated:', sitemapXML.length, 'characters');
    }
  }, [content]);

  // This component should ideally be server-side rendered
  // For now, return a simple response with SEO
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
        <p className="text-muted-foreground mb-8">
          Complete index of all content on The Grid Nexus. For XML sitemap, visit{' '}
          <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>
        </p>
        <p className="text-sm text-muted-foreground">
          This page is for human visitors. Search engines should use the XML sitemap at{' '}
          <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>
        </p>
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




