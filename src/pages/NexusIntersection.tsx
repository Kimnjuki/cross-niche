/**
 * Nexus Intersection (nexus-004): unified cross-section — 1 Tech, 1 Security, 1 Gaming linked by common keyword.
 */

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { NexusIntersectionTemplate } from '@/components/nexus/NexusIntersectionTemplate';
import { SEOHead } from '@/components/seo/SEOHead';
import { useNexusIntersection } from '@/hooks/useNexusIntersection';
import { Link2, RefreshCw, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NexusIntersectionPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { tech, security, gaming, commonKeyword, isLoading, error } = useNexusIntersection();

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    window.location.reload(); // Force fresh fetch from Convex
  };

  return (
    <Layout>
      <SEOHead
        title="Nexus Intersection | The Grid Nexus"
        description="Cross-section of Tech, Security, and Gaming: one article from each niche linked by a common theme. Discover how topics connect across the Nexus."
        keywords={['nexus intersection', 'cross-section', 'tech security gaming', 'themed articles', commonKeyword]}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">Nexus Intersection</h1>
              <p className="text-muted-foreground">Tech · Security · Gaming</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            One Tech article, one Security alert, and one Gaming guide — linked by a common keyword in a{' '}
            <strong>Nexus Summary</strong> at the top. See how themes connect across niches.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="gap-2">
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              New intersection
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/breach-sim" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Security training
              </Link>
            </Button>
          </div>
        </header>

        <NexusIntersectionTemplate
          key={refreshKey}
          tech={tech}
          security={security}
          gaming={gaming}
          commonKeyword={commonKeyword}
          isLoading={isLoading}
          error={error}
        />

        {/* Cross-links & tips */}
        <Card className="mt-10 border-dashed">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Explore more
            </h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/tech" className="text-primary hover:underline">Tech</Link>
              <Link to="/security" className="text-primary hover:underline">Security</Link>
              <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
              <Link to="/guides" className="text-primary hover:underline">Guides</Link>
              <Link to="/ai-pulse" className="text-primary hover:underline">AI Pulse</Link>
              <Link to="/roadmap" className="text-primary hover:underline">Roadmap</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
