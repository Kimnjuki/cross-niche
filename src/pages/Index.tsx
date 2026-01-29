import { Layout } from '@/components/layout/Layout';
import { RotatingHeroSection } from '@/components/home/RotatingHeroSection';
import { NicheSection } from '@/components/home/NicheSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { mockArticles } from '@/data/mockData';
import { usePublishedContent, useTrendingContent, useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ViewToggle } from '@/components/ui/view-toggle';
import { SectionFilter } from '@/components/ui/section-filter';
import type { SectionFilterValue } from '@/components/ui/section-filter';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { SEOHead } from '@/components/seo/SEOHead';
import { FAQSection } from '@/components/seo/FAQSection';
import { BreakingNewsSection } from '@/components/home/BreakingNewsSection';
import { TopStoryHero } from '@/components/home/TopStoryHero';
import { LatestUpdatesSection } from '@/components/home/LatestUpdatesSection';
import { ThreatIntelligenceDashboard } from '@/components/security/ThreatIntelligenceDashboard';
import { TrendingTopicsWidget } from '@/components/home/TrendingTopicsWidget';
import { StartupVCSection } from '@/components/startups/StartupVCSection';
import { ProductReviewsSection } from '@/components/reviews/ProductReviewsSection';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ContentDiagnostics } from '@/components/admin/ContentDiagnostics';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<SectionFilterValue>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const queryClient = useQueryClient();
  const { data: allContent, isLoading: loadingAll, error: contentError } = usePublishedContent(20);
  const { data: trendingContent, isLoading: loadingTrending } = useTrendingContent(5);
  const { data: techContent } = useContentByFeed('innovate', 4);
  const { data: securityContent } = useContentByFeed('secured', 4);
  const { data: gamingContent } = useContentByFeed('play', 4);

  // Refresh content on mount with cache busting
  useEffect(() => {
    // Force refresh on mount with timestamp to bust cache
    const timestamp = Date.now();
    queryClient.invalidateQueries({ queryKey: ['content'] });
    queryClient.refetchQueries({ queryKey: ['content'] });
    
    if (import.meta.env.DEV) {
      console.log(`🔄 Content refresh triggered at ${new Date(timestamp).toLocaleTimeString()}`);
    }
  }, [queryClient]);

  // Map Supabase content to Article type, fallback to mock if empty
  const hasRealContent = allContent && allContent.length > 0;
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('📊 Content Fetch Status:', {
      allContentCount: allContent?.length || 0,
      hasRealContent,
      loadingAll,
      firstArticle: allContent?.[0] ? {
        id: allContent[0].id,
        title: allContent[0].title,
        status: allContent[0].status,
        published_at: allContent[0].published_at,
        hasBody: !!allContent[0].body,
        hasExcerpt: !!allContent[0].excerpt,
        feed_slug: allContent[0].feed_slug,
      } : null,
    });
  }
  
  // Get all articles
  const allArticles = hasRealContent 
    ? mapContentToArticles(allContent)
    : mockArticles;

  // Helper to estimate word count from content
  const getWordCount = (content: string): number => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  // Sort articles - NEWEST FIRST (automatic top placement for new articles)
  // Simple, clear priority: Most recent published_at wins, period.
  // This ensures articles inserted with NOW() appear at the top immediately.
  const sortedArticles = [...allArticles].sort((a, b) => {
    const aDate = new Date(a.publishedAt).getTime();
    const bDate = new Date(b.publishedAt).getTime();
    
    // Primary and only sort: newest first
    // Articles with more recent published_at appear first
    return bDate - aDate;
  });

  // Get top 5 articles for rotation
  const rotatingArticles = sortedArticles.slice(0, 5);

  // Featured grid: exclude hero items, filter by section (Ars / WIRED style)
  const afterHero = sortedArticles.slice(5);
  const featuredPool = sectionFilter === 'all'
    ? afterHero
    : afterHero.filter((a) => a.niche === sectionFilter);
  const featuredArticles = featuredPool.slice(0, 9);

  // Today's Picks (WIRED style): curated strip of top stories
  const todaysPicks = sortedArticles.slice(0, 6);

  const trendingArticles = trendingContent && trendingContent.length > 0
    ? mapContentToArticles(trendingContent)
    : mockArticles.slice(0, 5);

  const techArticles = techContent && techContent.length > 0
    ? mapContentToArticles(techContent)
    : mockArticles.filter(a => a.niche === 'tech').slice(0, 4);

  const securityArticles = securityContent && securityContent.length > 0
    ? mapContentToArticles(securityContent)
    : mockArticles.filter(a => a.niche === 'security').slice(0, 4);

  const gamingArticles = gamingContent && gamingContent.length > 0
    ? mapContentToArticles(gamingContent)
    : mockArticles.filter(a => a.niche === 'gaming').slice(0, 4);

  // Show diagnostics if there's an error or no content
  if (contentError || (!loadingAll && (!allContent || allContent.length === 0))) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Content Loading Issue</h1>
              <p className="text-muted-foreground">
                {contentError 
                  ? `Error loading content: ${contentError.message || 'Unknown error'}`
                  : 'No articles found in database. Check diagnostics below.'}
              </p>
              <Button onClick={() => setShowDiagnostics(!showDiagnostics)}>
                {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
              </Button>
            </div>
            {showDiagnostics && <ContentDiagnostics />}
          </div>
        </div>
      </Layout>
    );
  }

  if (loadingAll || loadingTrending) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-[600px] w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO Meta Tags + FAQPage schema for rich snippets */}
      <SEOHead
        title="The Grid Nexus - Tech, Security & Gaming News"
        description="Breaking technology news, cybersecurity analysis, and gaming guides. AI insights, security intelligence, and comprehensive tech coverage."
        keywords={[
          'artificial intelligence',
          'machine learning',
          'cybersecurity',
          'cyber security',
          'cloud computing',
          'gaming',
          'blockchain',
          'robotics',
          'latest tech news',
          'technology trends',
          'data privacy',
          'quantum computing',
          'virtual reality',
          'internet of things',
          'big data',
          'network security',
          'cyber security news',
          'gaming news',
          'tech innovations 2026',
          'cybersecurity threats latest',
          'technology news',
          'tech intelligence',
          'security analysis',
          'gaming hardware',
          'tech reviews',
          'security updates',
          'gaming industry',
          'tech innovation'
        ]}
        url={window.location.href}
        type="website"
        faqs={[
          { question: 'What is The Grid Nexus?', answer: 'The Grid Nexus is your trusted source for breaking technology news, in-depth cybersecurity analysis, and expert gaming guides. We provide comprehensive coverage of the latest tech trends, security threats, and gaming innovations to help you stay ahead of the curve.' },
          { question: 'What topics does The Grid Nexus cover?', answer: 'We cover three main niches: Technology (Innovate) - latest hardware, software, and tech innovations; Cybersecurity (Secured) - security threats, best practices, and industry analysis; and Gaming (Play) - game reviews, hardware, esports, and gaming industry news.' },
          { question: 'How often is content updated?', answer: 'We publish fresh content daily, with comprehensive articles covering breaking news, in-depth analysis, and expert guides. Our team ensures you have access to the latest information in technology, cybersecurity, and gaming.' },
          { question: 'Can I bookmark articles for later?', answer: 'Yes! Registered users can bookmark articles to read later. Simply click the bookmark icon on any article card or article page to save it to your personal collection.' },
          { question: 'How do I stay updated with new content?', answer: 'You can subscribe to our newsletter to receive personalized tech, security, and gaming insights delivered directly to your inbox. We also recommend following us on social media for real-time updates.' },
          { question: 'Is The Grid Nexus content free?', answer: 'Yes, most of our content is free to access. We provide comprehensive articles, news, and guides at no cost. Some premium features may be available for registered users.' },
        ]}
      />

      {/* Main H1 - SEO only, minimal on homepage when hero present */}
      <section className="container mx-auto px-4 py-4 text-center sr-only md:not-sr-only md:py-6">
        <h1 className="font-display font-bold text-h1 mb-2">
          Technology, Cybersecurity, and Gaming Intelligence
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-body">
          Your trusted source for breaking technology news, in-depth cybersecurity analysis, and expert gaming guides.
        </p>
      </section>

      {/* Top Story Hero (Verge / Ars / WIRED: 60–70vh, reverse-chron lead) */}
      {sortedArticles.length > 0 && (
        <TopStoryHero article={sortedArticles[0]} />
      )}

      {/* Today's Picks (WIRED-style curated strip) */}
      {todaysPicks.length > 0 && (
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-6">
            <h2 className="font-display font-bold text-xl mb-4">Today&apos;s Picks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysPicks.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Breaking News Section (TechCrunch-style) */}
      <BreakingNewsSection articles={allArticles} maxItems={6} />

      {/* Latest Updates (Verge / Dark Reading: dynamic feed, category tabs) */}
      <LatestUpdatesSection articles={sortedArticles} />

      {/* Rotating Hero Section with the 5 main articles */}
      {rotatingArticles.length > 0 && (
        <RotatingHeroSection articles={rotatingArticles} autoRotateInterval={8000} />
      )}

      {/* Featured Articles Grid - Section filter + view toggle (Ars / WIRED style) */}
      {allArticles.length > 5 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display font-bold text-3xl mb-2">Featured Technology and Cybersecurity Articles</h2>
                <p className="text-muted-foreground">
                  Explore our comprehensive coverage of artificial intelligence, machine learning, 
                  cloud computing, cybersecurity, gaming, blockchain, robotics, and latest tech news
                </p>
              </div>
              <Link 
                to="/blog-series" 
                className="text-primary hover:underline text-sm font-medium shrink-0"
                aria-label="View all articles in blog series"
              >
                View All Articles →
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <SectionFilter value={sectionFilter} onChange={setSectionFilter} ariaLabel="Filter featured by section" />
              <ViewToggle value={viewMode} onChange={setViewMode} ariaLabel="Featured layout" />
            </div>
            <ArticleGrid articles={featuredArticles} columns={3} viewMode={viewMode} />
            {/* Additional Internal Links */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/tech" className="text-primary hover:underline">Technology News</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/security" className="text-primary hover:underline">Cybersecurity Updates</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/gaming" className="text-primary hover:underline">Gaming News</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/topics?q=artificial+intelligence" className="text-primary hover:underline">AI & Machine Learning</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/topics?q=cloud+computing" className="text-primary hover:underline">Cloud Computing</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/topics?q=blockchain" className="text-primary hover:underline">Blockchain Technology</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Section */}
      <TrendingSection articles={trendingArticles} />

      {/* Trending Topics Widget with High-Volume Keywords */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendingTopicsWidget />
            </div>
            <div className="lg:col-span-1">
              <ThreatIntelligenceDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement - Between Sections */}
      <AdPlacement position="between-content" />

      {/* Niche Sections */}
      <NicheSection niche="tech" articles={techArticles} />
      
      {/* Ad Placement - Between Sections */}
      <AdPlacement position="in-feed" />

      <NicheSection niche="security" articles={securityArticles} />
      
      {/* Ad Placement - Between Sections */}
      <AdPlacement position="in-feed" />

      <NicheSection niche="gaming" articles={gamingArticles} />

      {/* Startup & VC Section (TechCrunch-style) */}
      <StartupVCSection articles={techArticles.filter(a => 
        a.title.toLowerCase().includes('startup') || 
        a.title.toLowerCase().includes('funding') ||
        a.title.toLowerCase().includes('venture')
      )} />

      {/* Product Reviews Section (CNET-style) */}
      <ProductReviewsSection articles={allArticles.filter(a => 
        a.title.toLowerCase().includes('review') || 
        a.title.toLowerCase().includes('comparison') ||
        a.tags.some(tag => ['hardware', 'software', 'product'].includes(tag.toLowerCase()))
      )} />

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed with Latest Technology and Cybersecurity News</h2>
          <p className="text-muted-foreground mb-8">
            Get personalized technology news, cybersecurity updates, artificial intelligence insights, 
            machine learning trends, cloud computing news, and gaming guides delivered to your inbox.
          </p>
          <NewsletterForm variant="advanced" />
          {/* Internal Links for SEO */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Explore our technology, cybersecurity, and gaming content:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/tech" className="text-primary hover:underline">Technology News</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/security" className="text-primary hover:underline">Cybersecurity</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/topics" className="text-primary hover:underline">Topics</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/guides" className="text-primary hover:underline">Guides</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resources / internal links for SEO (reduces orphan pages) */}
      <section className="container mx-auto px-4 py-8 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/security-score" className="text-primary hover:underline">Security Score</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/disclosure" className="text-primary hover:underline">Disclosure</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/roadmap" className="text-primary hover:underline">Roadmap</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/tutorials" className="text-primary hover:underline">Tutorials</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/about" className="text-primary hover:underline">About</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/contact" className="text-primary hover:underline">Contact</Link>
        </div>
      </section>

      {/* FAQ Section for LSI Keywords */}
      <FAQSection
        faqs={[
          {
            question: 'What is The Grid Nexus?',
            answer: 'The Grid Nexus is your trusted source for breaking technology news, in-depth cybersecurity analysis, and expert gaming guides. We provide comprehensive coverage of the latest tech trends, security threats, and gaming innovations to help you stay ahead of the curve.',
          },
          {
            question: 'What topics does The Grid Nexus cover?',
            answer: 'We cover three main niches: Technology (Innovate) - latest hardware, software, and tech innovations; Cybersecurity (Secured) - security threats, best practices, and industry analysis; and Gaming (Play) - game reviews, hardware, esports, and gaming industry news.',
          },
          {
            question: 'How often is content updated?',
            answer: 'We publish fresh content daily, with comprehensive articles covering breaking news, in-depth analysis, and expert guides. Our team ensures you have access to the latest information in technology, cybersecurity, and gaming.',
          },
          {
            question: 'Can I bookmark articles for later?',
            answer: 'Yes! Registered users can bookmark articles to read later. Simply click the bookmark icon on any article card or article page to save it to your personal collection.',
          },
          {
            question: 'How do I stay updated with new content?',
            answer: 'You can subscribe to our newsletter to receive personalized tech, security, and gaming insights delivered directly to your inbox. We also recommend following us on social media for real-time updates.',
          },
          {
            question: 'Is The Grid Nexus content free?',
            answer: 'Yes, most of our content is free to access. We provide comprehensive articles, news, and guides at no cost. Some premium features may be available for registered users.',
          },
        ]}
      />
    </Layout>
  );
};

export default Index;
