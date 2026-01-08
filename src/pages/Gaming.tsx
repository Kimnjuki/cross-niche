import { Layout } from '@/components/layout/Layout';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { mockArticles } from '@/data/mockData';
import { useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function Gaming() {
  const { data: gamingContent, isLoading } = useContentByFeed('play', 20);

  const gamingArticles = gamingContent && gamingContent.length > 0
    ? mapContentToArticles(gamingContent)
    : mockArticles.filter(a => a.niche === 'gaming');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-gaming">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl text-gaming">Play</h1>
              <p className="text-muted-foreground">Gaming & Esports</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your ultimate gaming destination. Reviews, news, esports coverage, and exclusive security ratings for every game.
          </p>
        </div>

        {/* Security Score Info */}
        <div className="bg-gaming/5 border border-gaming/20 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-gaming/10">
              <Shield className="h-6 w-6 text-gaming" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg mb-2">Security Score Rating</h3>
              <p className="text-muted-foreground mb-4">
                We rate every game's security practices including data collection, account protection, and privacy policies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-gaming text-gaming-foreground">90-100: Excellent</Badge>
                <Badge variant="secondary">70-89: Good</Badge>
                <Badge variant="outline">50-69: Fair</Badge>
                <Badge variant="destructive">Below 50: Poor</Badge>
              </div>
              <Link 
                to="/security-score" 
                className="inline-flex items-center gap-1 text-sm text-gaming hover:underline mt-4"
              >
                <Info className="h-4 w-4" />
                Learn more about our methodology
              </Link>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <ArticleGrid articles={gamingArticles} columns={3} />
        )}
      </div>
    </Layout>
  );
}
