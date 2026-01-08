import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { NicheSection } from '@/components/home/NicheSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { mockArticles } from '@/data/mockData';
import { usePublishedContent, useTrendingContent, useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: allContent, isLoading: loadingAll } = usePublishedContent(20);
  const { data: trendingContent, isLoading: loadingTrending } = useTrendingContent(5);
  const { data: techContent } = useContentByFeed('innovate', 4);
  const { data: securityContent } = useContentByFeed('secured', 4);
  const { data: gamingContent } = useContentByFeed('play', 4);

  // Map Supabase content to Article type, fallback to mock if empty
  const hasRealContent = allContent && allContent.length > 0;
  
  const featuredArticle = hasRealContent 
    ? mapContentToArticles(allContent).find(a => a.isFeatured) || mapContentToArticles(allContent)[0]
    : mockArticles.find(a => a.isFeatured) || mockArticles[0];

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
          <Skeleton className="h-[500px] w-full mb-8" />
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
      <HeroSection featuredArticle={featuredArticle} />
      
      <TrendingSection articles={trendingArticles} />
      
      <NicheSection niche="tech" articles={techArticles} />
      
      <NicheSection niche="security" articles={securityArticles} />
      
      <NicheSection niche="gaming" articles={gamingArticles} />
      
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-muted-foreground mb-8">
            Get the latest tech, security, and gaming insights delivered to your inbox weekly.
          </p>
          <NewsletterForm variant="inline" />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
