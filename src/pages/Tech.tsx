import { Layout } from '@/components/layout/Layout';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { mockArticles } from '@/data/mockData';
import { useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Cpu } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Tech() {
  const { data: techContent, isLoading } = useContentByFeed('innovate', 20);

  const techArticles = techContent && techContent.length > 0
    ? mapContentToArticles(techContent)
    : mockArticles.filter(a => a.niche === 'tech');

  return (
    <Layout>
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
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <ArticleGrid articles={techArticles} columns={3} />
        )}
      </div>
    </Layout>
  );
}
