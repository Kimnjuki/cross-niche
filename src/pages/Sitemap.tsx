/**
 * Human-readable Sitemap page – linked from footer for crawlability (fixes orphan pages).
 * XML sitemap is served statically at /sitemap.xml.
 */

import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { getPageMetadata } from '@/lib/seo/pageMetadata';
import { TOOL_PAGES } from '@/lib/sitemapGenerator';

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
  { to: '/blog', label: 'Blog' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/startups', label: 'Startups' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/ai-pulse', label: 'AI Pulse' },
  { to: '/breach-sim', label: 'Breach Sim' },
  { to: '/nexus-intersection', label: 'Nexus Intersection' },
  { to: '/security-score', label: 'Security Score' },
  { to: '/live-threat-dashboard', label: 'Live Threat Dashboard' },
  { to: '/community-threats', label: 'Community Threats' },
  { to: '/security-profile', label: 'Security Profile' },
  { to: '/forums', label: 'Community Forums' },
  { to: '/tools', label: 'Tools Hub' },
  { to: '/media', label: 'Media' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/disclosure', label: 'Disclosure' },
  { to: '/editorial', label: 'Editorial Policy' },
  { to: '/quality-guidelines', label: 'Quality Guidelines' },
  { to: '/content-policy', label: 'Content Policy' },
] as const;

export default function Sitemap() {
  const meta = getPageMetadata('/sitemap');
  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        url={typeof window !== 'undefined' ? `${window.location.origin}/sitemap` : 'https://thegridnexus.com/sitemap'}
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

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Tools</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {TOOL_PAGES.map(({ slug, name }) => (
              <li key={slug}>
                <Link to={slug} className="text-primary hover:underline">
                  {name}
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
              <a href="/sitemap-articles.xml" className="text-primary hover:underline">sitemap-articles.xml</a> – Article URLs
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
