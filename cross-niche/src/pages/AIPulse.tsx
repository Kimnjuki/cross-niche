import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { getPageMetadata } from '@/lib/seo/pageMetadata';
import { AIPulseTimeline } from '@/components/ai/AIPulseTimeline';
import { useAIPulse } from '@/hooks/useAIPulse';

export default function AIPulse() {
  const { items, isLoading } = useAIPulse();
  const meta = getPageMetadata('/ai-pulse');

  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={['ai pulse', 'ai updates', 'ml benchmarks', 'ai trends', 'gaming ai', 'competitive analysis']}
        url={typeof window !== 'undefined' ? window.location.href : '/ai-pulse'}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h1 className="font-display font-bold text-4xl mb-3">AI Pulse</h1>
          <p className="text-muted-foreground text-lg">
            Curated AI signals with benchmarks, feature breakdowns, and competitive gaps.
          </p>
          {isLoading ? (
            <div className="mt-8 text-muted-foreground">Loading AI updates…</div>
          ) : (
            <AIPulseTimeline items={items} className="mt-8" />
          )}
        </div>
      </div>
    </Layout>
  );
}
