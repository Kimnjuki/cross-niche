/**
 * AI-Pulse Roadmap (nexus-002) – Live-updating timeline for AI/ML tech trends.
 */

import { Layout } from '@/components/layout/Layout';
import { AIPulseTimeline } from '@/components/ai/AIPulseTimeline';
import { SEOHead } from '@/components/seo/SEOHead';
import { Sparkles, BarChart3 } from 'lucide-react';
import { useAIPulse } from '@/hooks/useAIPulse';
import { Skeleton } from '@/components/ui/skeleton';

export default function AIPulse() {
  const { items, isLoading, isConvex } = useAIPulse();

  return (
    <Layout>
      <SEOHead
        title="AI-Pulse Roadmap | The Grid Nexus"
        description="Live-updating timeline for AI and Machine Learning tech trends. Filter by Productivity, Creative, or Gaming AI. Toggle Hype vs Utility to focus on confirmed benchmarks."
        keywords={['AI roadmap', 'machine learning', 'tech trends', 'AI productivity', 'gaming AI', 'creative AI']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">AI-Pulse Roadmap</h1>
              <p className="text-muted-foreground">AI & Machine Learning tech trends</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Interactive timeline of AI and ML updates. Filter by <strong>Productivity</strong>, <strong>Creative</strong>, or <strong>Gaming AI</strong>.
            Use <strong>Hype</strong> vs <strong>Utility</strong>: Hype dims marketing fluff; Utility highlights items with confirmed ML benchmarks.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Updates ordered by date (newest first). Responsive on mobile.</span>
            {isConvex && (
              <span className="text-xs text-primary">· Live from Convex</span>
            )}
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <AIPulseTimeline items={items} />
        )}
      </div>
    </Layout>
  );
}
