/**
 * AI-Pulse Roadmap (nexus-002) – Live-updating timeline for AI/ML tech trends.
 */

import { Layout } from '@/components/layout/Layout';
import { AIPulseTimeline } from '@/components/ai/AIPulseTimeline';
import { SEOHead } from '@/components/seo/SEOHead';
import { Sparkles, BarChart3 } from 'lucide-react';
import { SAMPLE_AI_UPDATES } from '@/data/aiUpdates';

export default function AIPulse() {
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
          </div>
        </header>

        <AIPulseTimeline items={SAMPLE_AI_UPDATES} />
      </div>
    </Layout>
  );
}
