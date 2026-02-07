/**
 * AI-Pulse Roadmap (nexus-002) – Comprehensive AI/ML tech trends roadmap.
 * Includes interactive timeline, feature overview, competitive analysis, visualizations, and future predictions.
 */

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AIPulseTimeline } from '@/components/ai/AIPulseTimeline';
import { AIFeatureOverview } from '@/components/ai/AIFeatureOverview';
import { AICompetitiveAnalysis } from '@/components/ai/AICompetitiveAnalysis';
import { AIFuturePredictions } from '@/components/ai/AIFuturePredictions';
import { AIVisualizations } from '@/components/ai/AIVisualizations';
import { SEOHead } from '@/components/seo/SEOHead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, BarChart3, Layers, TrendingUp, Building2 } from 'lucide-react';
import { useAIPulse } from '@/hooks/useAIPulse';
import { Skeleton } from '@/components/ui/skeleton';
import { LandingPageTracker } from '@/components/analytics/LandingPageTracker';

export default function AIPulse() {
  const { items, isLoading, isConvex } = useAIPulse();
  const [activeTab, setActiveTab] = useState('timeline');

  // Generate comprehensive structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AI-Pulse Roadmap - AI & Machine Learning Tech Trends',
    description: 'Comprehensive interactive roadmap showcasing the latest trends in AI and Machine Learning technologies. Filter by Productivity AI, Creative AI, and Gaming AI. Analyze Hype vs Utility with confirmed ML benchmarks.',
    url: typeof window !== 'undefined' ? window.location.href : '',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.slice(0, 10).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TechArticle',
          headline: item.title,
          description: item.description,
          datePublished: new Date(item.publishedAt).toISOString(),
          ...(item.benchmarks && item.benchmarks.length > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: item.benchmarks.reduce((sum, b) => sum + b.score, 0) / item.benchmarks.length,
              reviewCount: item.benchmarks.length,
            },
          }),
          ...(item.sourceUrl && {
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': item.sourceUrl,
            },
          }),
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? `${window.location.origin}/` : '',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI-Pulse Roadmap',
          item: typeof window !== 'undefined' ? window.location.href : '',
        },
      ],
    },
  };

  return (
    <Layout>
      <LandingPageTracker pageType="category" articlesViewed={items.length} />
      <SEOHead
        title="AI-Pulse Roadmap: AI & ML Trends 2026 | The Grid Nexus"
        description="Comprehensive AI and ML tech trends roadmap with interactive timeline, feature overview, competitive analysis, and future predictions. Filter by Productivity AI, Creative AI, Gaming AI. Analyze Hype vs Utility with confirmed ML benchmarks. Expert insights on artificial intelligence trends, machine learning updates, and AI competitive analysis."
        keywords={[
          'AI roadmap',
          'machine learning trends',
          'AI technology roadmap',
          'ML benchmarks',
          'AI productivity tools',
          'gaming AI',
          'creative AI',
          'artificial intelligence trends',
          'machine learning updates',
          'AI competitive analysis',
          'future of AI',
          'AI predictions',
          'AI hype vs utility',
          'ML benchmark analysis',
          'AI feature overview',
          'productivity AI tools',
          'creative AI applications',
          'gaming AI technology',
          'AI industry leaders',
          'machine learning competitive landscape',
          'AI future predictions',
          'expert AI insights',
          'AI trend analysis',
          'ML performance metrics',
          'AI technology comparison',
        ]}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
        faqs={[
          {
            question: 'What is the AI-Pulse Roadmap?',
            answer: 'The AI-Pulse Roadmap is a comprehensive, interactive timeline showcasing the latest trends and updates in AI and Machine Learning technologies. It includes filtering by category (Productivity, Creative, Gaming AI) and analysis of Hype vs Utility with confirmed ML benchmarks.',
          },
          {
            question: 'How do I filter AI updates by category?',
            answer: 'Use the category tabs at the top of the timeline to filter by Productivity AI, Creative AI, Gaming AI, or view All updates. Each category shows relevant AI/ML developments in that sector.',
          },
          {
            question: 'What is Hype vs Utility analysis?',
            answer: 'Hype vs Utility helps distinguish marketing-driven announcements from items with confirmed ML benchmarks. Utility view highlights updates with verified performance metrics, while Hype view shows all updates including marketing announcements.',
          },
          {
            question: 'What sectors are covered in the Feature Overview?',
            answer: 'The Feature Overview covers AI/ML features across gaming, security, productivity, and creative sectors, highlighting how these technologies contribute to advancement in each field.',
          },
        ]}
      />
      {typeof window !== 'undefined' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl">AI-Pulse Roadmap</h1>
              <p className="text-muted-foreground">Comprehensive AI & Machine Learning Tech Trends</p>
            </div>
          </div>
          <div className="prose prose-lg max-w-3xl mb-6">
            <p className="text-lg text-muted-foreground mb-4">
              Interactive roadmap of AI and ML updates with comprehensive analysis. Filter by <strong>Productivity</strong>, <strong>Creative</strong>, or <strong>Gaming AI</strong>.
              Use <strong>Hype</strong> vs <strong>Utility</strong> to distinguish marketing-driven items from those with confirmed ML benchmarks.
            </p>
            <p className="text-base text-muted-foreground">
              Explore detailed feature overviews across gaming, security, productivity, and creative sectors. 
              Analyze competitive landscapes with industry leader comparisons. 
              Visualize trends through interactive charts and metrics. 
              Gain insights into future predictions based on expert analysis and current trends.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Updates ordered by date (newest first).</span>
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
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No AI updates available at this time.</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-2">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="timeline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                  <span className="sm:hidden">Time</span>
                </TabsTrigger>
                <TabsTrigger value="visualizations" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Charts</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="features" className="gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Features</span>
                  <span className="sm:hidden">Feat</span>
                </TabsTrigger>
                <TabsTrigger value="competitive" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Competitive</span>
                  <span className="sm:hidden">Comp</span>
                </TabsTrigger>
                <TabsTrigger value="predictions" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Predictions</span>
                  <span className="sm:hidden">Future</span>
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  All
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="timeline" className="space-y-6">
              <AIPulseTimeline items={items} />
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-6">
              <AIVisualizations items={items} />
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <AIFeatureOverview items={items} />
            </TabsContent>

            <TabsContent value="competitive" className="space-y-6">
              <AICompetitiveAnalysis items={items} />
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <AIFuturePredictions items={items} />
            </TabsContent>

            <TabsContent value="all" className="space-y-12">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display font-bold text-2xl mb-4 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Interactive Timeline
                  </h2>
                  <AIPulseTimeline items={items} />
                </div>
                
                <div className="border-t border-border pt-8">
                  <h2 className="font-display font-bold text-2xl mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Visualizations & Analytics
                  </h2>
                  <AIVisualizations items={items} />
                </div>
                
                <div className="border-t border-border pt-8">
                  <AIFeatureOverview items={items} />
                </div>
                
                <div className="border-t border-border pt-8">
                  <AICompetitiveAnalysis items={items} />
                </div>
                
                <div className="border-t border-border pt-8">
                  <AIFuturePredictions items={items} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
