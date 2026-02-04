/**
 * Explore / All Articles – every published article for archive and discoverability.
 * Uses api.content.getAllPublishedContent so background/unlisted content is not shown here;
 * only status === "published" appears. Linked from Navbar for users and search engines.
 */

import { Layout } from '@/components/layout/Layout';
import { useAllPublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { SEOHead } from '@/components/seo/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Archive, ChevronRight } from 'lucide-react';

export default function Explore() {
  const { data: allContent, isLoading } = useAllPublishedContent(50);
  const articles = allContent ? mapContentToArticles(allContent) : [];

  return (
    <Layout>
      <SEOHead
        title="All Articles | The Grid Nexus"
        description="Browse all tech, security, and gaming articles. Archive and full catalog for discoverability."
        keywords={['all articles', 'archive', 'tech articles', 'security articles', 'gaming articles', 'blog archive']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Archive className="h-8 w-8 text-muted-foreground" />
            <h1 className="font-display font-bold text-3xl md:text-4xl">Explore</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Every published article in one place. Find tech, security, and gaming coverage.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link to="/tech" className="text-primary hover:underline">Tech</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/security" className="text-primary hover:underline">Security</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/blog-series" className="text-primary hover:underline flex items-center gap-1">
              Blog series <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground text-lg">No articles yet. Content is managed in Convex.</p>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to home</Link>
          </div>
        ) : (
          <ArticleGrid articles={articles} columns={3} viewMode="grid" />
        )}
      </div>
    </Layout>
  );
}
