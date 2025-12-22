import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { NicheSection } from '@/components/home/NicheSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { DailyRoundupForm } from '@/components/newsletter/DailyRoundupForm';
import { CommunitySection } from '@/components/community/CommunitySection';
import { ExpertInterview } from '@/components/expert/ExpertInterview';
import { ReportDownload } from '@/components/reports/ReportDownload';
import { mockArticles } from '@/data/mockData';
import { usePublishedContent, useContentByFeed, useTrendingContent } from '@/hooks/useContent';
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
      
      {/* Expert Interviews & Reports Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <ExpertInterview
              expertName="Former NSA Analyst"
              expertTitle="Cybersecurity Expert"
              quote="The intersection of AI and gaming creates unprecedented security challenges. We're seeing state-level actors weaponizing game engines for reconnaissance..."
              articleUrl="/article/expert-interview-1"
            />
            <ReportDownload
              report={{
                id: '1',
                title: 'The Future of Secure Gaming: AI, Quantum, and Zero-Trust Architecture',
                description: 'Our quarterly analysis reveals key trends shaping the convergence of hardware innovation, threat landscape, and player experience in 2025.',
                publishedAt: new Date().toISOString(),
                downloadUrl: '/reports/future-secure-gaming-2025.pdf',
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Newsletter & Community Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
              <p className="text-muted-foreground mb-8">
                Get the latest tech, security, and gaming insights delivered to your inbox weekly.
              </p>
              <NewsletterForm variant="inline" />
            </div>
            <CommunitySection />
          </div>
        </div>
      </section>
      
      {/* Daily Roundup Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-2xl mx-auto px-4">
          <DailyRoundupForm />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
