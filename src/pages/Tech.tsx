import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ViewToggle } from '@/components/ui/view-toggle';
import { mockArticles } from '@/data/mockData';
import { useContentByNicheId } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Cpu } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

export default function Tech() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const { data: techContent, isLoading } = useContentByNicheId(1, 20);

  const techArticles = techContent && techContent.length > 0
    ? mapContentToArticles(techContent)
    : mockArticles.filter(a => a.niche === 'tech');

  return (
    <Layout>
      <SEOHead
        title="Technology News & Innovation | The Grid Nexus"
        description="Latest technology news, hardware reviews, and innovation insights. Stay ahead with cutting-edge processors, AI developments, and tech industry analysis."
        keywords={['technology news', 'tech innovation', 'hardware reviews', 'AI technology', 'tech trends', 'innovation']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-tech">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl text-tech">Innovate</h1>
              <p className="text-muted-foreground">Technology, Hardware & Innovation</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay ahead with the latest in technology news, hardware reviews, and industry analysis. From cutting-edge processors to breakthrough AI developments.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link to="/topics?q=artificial+intelligence" className="text-primary hover:underline">AI & Machine Learning</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/topics?q=cloud+computing" className="text-primary hover:underline">Cloud Computing</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/guides" className="text-primary hover:underline">Tech Guides</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
          </div>
        </div>

        {/* View toggle (Ars / WIRED style) */}
        <div className="flex justify-end mb-6">
          <ViewToggle value={viewMode} onChange={setViewMode} ariaLabel="Article layout" />
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <ArticleGrid articles={techArticles} columns={3} viewMode={viewMode} />
        )}
      </div>
    </Layout>
  );
}
