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
import { AdPlacement } from '@/components/ads/AdPlacement';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: allContent, isLoading: loadingAll } = usePublishedContent(20);
  const { data: trendingContent, isLoading: loadingTrending } = useTrendingContent(5);
  const { data: techContent } = useContentByFeed('innovate', 4);
  const { data: securityContent } = useContentByFeed('secured', 4);
  const { data: gamingContent } = useContentByFeed('play', 4);

  // Map Supabase content to Article type, fallback to mock if empty
  const hasRealContent = allContent && allContent.length > 0;
  
  // Get all articles
  const allArticles = hasRealContent 
    ? mapContentToArticles(allContent)
    : mockArticles;

  // Helper to estimate word count from content
  const getWordCount = (content: string): number => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  // Get the 5 main articles - prioritize:
  // 1. Featured articles
  // 2. Articles with over 800 words (comprehensive content)
  // 3. Most recent articles
  const sortedArticles = [...allArticles].sort((a, b) => {
    const aWords = getWordCount(a.content || a.excerpt);
    const bWords = getWordCount(b.content || b.excerpt);
    
    // Featured articles first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    
    // Then by word count (longer articles first)
    if (aWords > 800 && bWords <= 800) return -1;
    if (aWords <= 800 && bWords > 800) return 1;
    
    // Then by date (newest first)
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Get top 5 articles for rotation
  const rotatingArticles = sortedArticles.slice(0, 5);

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
      {/* SEO Meta Tags */}
      <SEOHead
        title="The Grid Nexus - Tech • Security • Gaming Intelligence | Breaking News & Expert Analysis"
        description="The Grid Nexus: Your trusted source for breaking technology news, in-depth cybersecurity analysis, and expert gaming guides. Stay ahead with AI-powered insights, security intelligence, and comprehensive tech coverage."
        keywords={[
          'technology news',
          'cybersecurity',
          'gaming',
          'tech intelligence',
          'security analysis',
          'gaming news',
          'AI technology',
          'tech trends',
          'cyber threats',
          'gaming hardware',
          'tech reviews',
          'security updates',
          'gaming industry',
          'tech innovation'
        ]}
        url={window.location.href}
        type="website"
      />

      {/* Main H1 Heading - Hidden visually but present for SEO */}
      <h1 className="sr-only">The Grid Nexus: Technology, Cybersecurity, and Gaming Intelligence</h1>

      {/* Rotating Hero Section with the 5 main articles */}
      {rotatingArticles.length > 0 && (
        <RotatingHeroSection articles={rotatingArticles} autoRotateInterval={8000} />
      )}

      {/* Featured Articles Grid - Show remaining articles if more than 5 */}
      {allArticles.length > 5 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-bold text-3xl mb-2">More Featured Articles</h2>
                <p className="text-muted-foreground">Explore our comprehensive coverage of technology, cybersecurity, and gaming</p>
              </div>
              <Link 
                to="/blog-series" 
                className="text-primary hover:underline text-sm font-medium"
                aria-label="View all articles in blog series"
              >
                View All Articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allArticles.slice(5, 11).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Section */}
      <TrendingSection articles={trendingArticles} />

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

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed with The Grid Nexus</h2>
          <p className="text-muted-foreground mb-8">
            Get personalized technology news, cybersecurity updates, and gaming insights delivered to your inbox.
          </p>
          <NewsletterForm variant="advanced" />
          {/* Internal Links for SEO */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Explore our content:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/tech" className="text-primary hover:underline">Technology News</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/security" className="text-primary hover:underline">Cybersecurity</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
