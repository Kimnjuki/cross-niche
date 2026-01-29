/**
 * Dynamic Sitemap Route
 * Generates XML sitemap on-the-fly for SEO
 */

import { useEffect } from 'react';
import { usePublishedContent } from '@/hooks/useContent';
import { generateCompleteSitemap } from '@/lib/sitemapGenerator';
import { mapContentToArticles } from '@/lib/contentMapper';

export default function Sitemap() {
  const { data: content } = usePublishedContent(1000); // Get all published content
  
  useEffect(() => {
    if (content) {
      const articles = mapContentToArticles(content);
      const sitemapXML = generateCompleteSitemap(articles);
      
      // Set content type and return XML
      const blob = new Blob([sitemapXML], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // For server-side rendering, you'd return this as XML response
      // For client-side, we'll handle it differently
      console.log('Sitemap generated:', sitemapXML.length, 'characters');
    }
  }, [content]);

  // This component should ideally be server-side rendered
  // For now, return a simple response
  return null;
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




