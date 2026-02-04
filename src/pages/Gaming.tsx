import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ViewToggle } from '@/components/ui/view-toggle';
import { GameSecurityCard } from '@/components/games/GameSecurityCard';
import { mockArticles } from '@/data/mockData';
import { useContentByNicheId } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';

// Sample security ratings for Nexus Risk-to-Reward (nexus-001). Replace with Convex useQuery(api.securityRatings.list) when frontend uses Convex.
const SAMPLE_SECURITY_RATINGS = [
  { gameTitle: 'Sample Game A', nexusSecurityScore: 85, funFactor: 88, dataEncryption: true, accountMFA: true, dataSharingPolicy: 'standard' as const },
  { gameTitle: 'Sample Game B', nexusSecurityScore: 62, funFactor: 92, dataEncryption: true, accountMFA: false, dataSharingPolicy: 'extensive' as const },
  { gameTitle: 'Sample Game C', nexusSecurityScore: 94, funFactor: 75, dataEncryption: true, accountMFA: true, dataSharingPolicy: 'minimal' as const },
];

export default function Gaming() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const { data: gamingContent, isLoading } = useContentByNicheId(3, 20);

  const gamingArticles = gamingContent && gamingContent.length > 0
    ? mapContentToArticles(gamingContent)
    : mockArticles.filter(a => a.niche === 'gaming');

  return (
    <Layout>
      <SEOHead
        title="Gaming News & Reviews | The Grid Nexus"
        description="Your ultimate gaming destination. Reviews, news, esports coverage, and exclusive security ratings for every game."
        keywords={['gaming news', 'game reviews', 'esports', 'gaming hardware', 'gaming security', 'game ratings']}
        url={window.location.href}
        type="website"
      />
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
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link to="/topics?q=gaming" className="text-primary hover:underline">Gaming Topics</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security-score" className="text-primary hover:underline">Security Scores</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/guides" className="text-primary hover:underline">Gaming Guides</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
          </div>
        </div>

        {/* Nexus Risk-to-Reward: Games with Security Ratings (nexus-001) */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-2xl text-gaming mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Games with Security Ratings
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Fun Factor vs Security Risk — radar view and Nexus Security Score (Encryption, MFA, Privacy).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_SECURITY_RATINGS.map((r) => (
              <GameSecurityCard
                key={r.gameTitle}
                gameTitle={r.gameTitle}
                nexusSecurityScore={r.nexusSecurityScore}
                funFactor={r.funFactor}
                dataEncryption={r.dataEncryption}
                accountMFA={r.accountMFA}
                dataSharingPolicy={r.dataSharingPolicy}
              />
            ))}
          </div>
        </section>

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
          <ArticleGrid articles={gamingArticles} columns={3} viewMode={viewMode} />
        )}
      </div>
    </Layout>
  );
}
