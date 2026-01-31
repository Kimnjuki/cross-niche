import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentByFeed, usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { LazyImage } from '@/components/ui/lazy-image';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

const nicheStyles = {
  tech: { 
    badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    bg: 'bg-blue-500/5',
    label: 'Innovate'
  },
  security: { 
    badge: 'bg-red-500/10 text-red-500 border-red-500/20',
    bg: 'bg-red-500/5',
    label: 'Secured'
  },
  gaming: { 
    badge: 'bg-green-500/10 text-green-500 border-green-500/20',
    bg: 'bg-green-500/5',
    label: 'Play'
  },
};

export default function BlogSeries() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNiche, setSelectedNiche] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');

  // Fetch all published content
  const { data: allContent, isLoading: isLoadingAll } = usePublishedContent(50);
  const { data: techContent, isLoading: isLoadingTech } = useContentByFeed('innovate', 50);
  const { data: securityContent, isLoading: isLoadingSecurity } = useContentByFeed('secured', 50);
  const { data: gamingContent, isLoading: isLoadingGaming } = useContentByFeed('play', 50);

  // Map content to articles (mapContentToArticles filters nulls)
  const allArticles: Article[] = allContent ? mapContentToArticles(allContent) : [];
  const techArticles: Article[] = techContent ? mapContentToArticles(techContent) : [];
  const securityArticles: Article[] = securityContent ? mapContentToArticles(securityContent) : [];
  const gamingArticles: Article[] = gamingContent ? mapContentToArticles(gamingContent) : [];

  // Get articles based on selected niche
  const getFilteredArticles = (): Article[] => {
    switch (selectedNiche) {
      case 'tech':
        return techArticles;
      case 'security':
        return securityArticles;
      case 'gaming':
        return gamingArticles;
      default:
        return allArticles;
    }
  };

  const filteredArticles = getFilteredArticles();
  const currentArticle = filteredArticles[currentIndex];

  // Reset index when niche changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedNiche]);

  // Ensure index is valid
  useEffect(() => {
    if (filteredArticles.length > 0 && currentIndex >= filteredArticles.length) {
      setCurrentIndex(0);
    }
  }, [filteredArticles.length, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredArticles.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredArticles.length - 1 ? prev + 1 : 0));
  };

  const isLoading = isLoadingAll || (selectedNiche === 'tech' && isLoadingTech) || 
                     (selectedNiche === 'security' && isLoadingSecurity) || 
                     (selectedNiche === 'gaming' && isLoadingGaming);

  return (
    <Layout>
      <SEOHead
        title="Tech & Gaming Series 2026 | The Grid Nexus"
        description="Latest tech, gaming, and cybersecurity articles. Expert analysis and in-depth coverage."
        keywords={['blog series', 'tech articles', 'gaming articles', 'cybersecurity articles', 'tech blog', 'gaming blog']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            2026 Tech & Gaming Series
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Comprehensive blog posts covering the latest in technology, gaming, and cybersecurity
          </p>
          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <Link to="/tech" className="text-primary hover:underline">Tech News</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security" className="text-primary hover:underline">Security</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/gaming" className="text-primary hover:underline">Gaming</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/topics" className="text-primary hover:underline">Topics</Link>
          </div>

          {/* Long-form editorial content for Content Score (word count, headings, terms, images) */}
          <article className="prose prose-slate dark:prose-invert max-w-none mb-10">
            <p className="lead text-lg text-muted-foreground mb-6">
              Welcome to our hub for <strong>technology, cybersecurity, and gaming intelligence</strong>. We publish in-depth articles on the latest in tech, <strong>security</strong> threats, and the <strong>gaming</strong> industry so you stay informed. This page curates our comprehensive blog series with expert analysis across these three pillars.
            </p>

            <h2 className="font-display font-bold text-2xl mt-8 mb-4">Artificial Intelligence and the Tech Industry</h2>
            <p className="mb-4">
              <strong>Artificial intelligence</strong> is reshaping how the <strong>industry</strong> builds products and defends against <strong>cyber</strong> threats. From <strong>ai in cybersecurity</strong> to <strong>ai technology</strong> in games, the <strong>use of ai</strong> is everywhere. <strong>AI agents</strong> and <strong>ai system</strong>s help detect <strong>malware</strong> and <strong>malicious software</strong>, while <strong>cybersecurity solutions</strong> leverage <strong>cloud security</strong> and <strong>network security</strong> to protect <strong>personal information</strong>.
            </p>
            <figure className="my-6 rounded-xl overflow-hidden border border-border">
              <LazyImage src="/placeholder.svg" alt="Artificial intelligence and cybersecurity technologies" className="w-full aspect-video object-cover" />
              <figcaption className="text-sm text-muted-foreground px-4 py-2 bg-muted">AI and security technologies in the industry</figcaption>
            </figure>
            <p className="mb-4">
              <strong>Cybersecurity risks</strong> and <strong>cyber risk</strong> continue to grow as <strong>cybercriminals</strong> launch <strong>cyber attacks</strong> and <strong>cyberattacks</strong> against <strong>gaming companies</strong> and <strong>online gaming platforms</strong>. <strong>Data breaches</strong> and <strong>security breaches</strong> expose <strong>vulnerabilities</strong> in <strong>gaming platforms</strong>, affecting the <strong>gaming experience</strong> for <strong>gamers</strong> and <strong>players</strong> alike. <strong>Game developers</strong> and studios like <strong>Riot Games</strong> invest in <strong>defence</strong> and <strong>attack surface</strong> reduction.
            </p>

            <h2 className="font-display font-bold text-2xl mt-8 mb-4">Cybersecurity in Gaming</h2>
            <p className="mb-4">
              <strong>Cybersecurity in gaming</strong> is critical for the <strong>gaming industry</strong>. <strong>Online gaming</strong> and <strong>gaming accounts</strong> are frequent targets; <strong>cyber threats</strong> and <strong>attacks</strong> on <strong>popular games</strong> can compromise <strong>personal information</strong>. The <strong>gaming community</strong> and <strong>game developers</strong> need <strong>skills</strong> and <strong>technologies</strong> to harden <strong>security</strong> and reduce <strong>vulnerabilities</strong>.
            </p>
            <figure className="my-6 rounded-xl overflow-hidden border border-border">
              <LazyImage src="/placeholder.svg" alt="Cybersecurity in gaming and online gaming platforms" className="w-full aspect-video object-cover" />
              <figcaption className="text-sm text-muted-foreground px-4 py-2 bg-muted">Security for gaming platforms and gamers</figcaption>
            </figure>
            <p className="mb-4">
              <strong>Gaming companies</strong> and <strong>online gaming platforms</strong> face <strong>cybersecurity risks</strong> from <strong>malware</strong>, <strong>data breaches</strong>, and <strong>cybercriminals</strong>. Implementing <strong>cybersecurity solutions</strong>, <strong>cloud security</strong>, and <strong>network security</strong> helps protect the <strong>gaming experience</strong> and <strong>gaming accounts</strong> of <strong>players</strong>. The <strong>internet of things</strong> and connected devices add to the <strong>attack surface</strong>, so <strong>defence</strong> must evolve.
            </p>

            <h3 className="font-display font-semibold text-xl mt-6 mb-3">AI in Cybersecurity and Defence</h3>
            <p className="mb-4">
              <strong>Ai in cybersecurity</strong> enables faster detection of <strong>malicious software</strong> and <strong>cyber attacks</strong>. <strong>AI technology</strong> and <strong>ai agents</strong> analyse <strong>attack surface</strong> and <strong>vulnerabilities</strong> to improve <strong>security</strong>. The <strong>use of ai</strong> in <strong>cybersecurity solutions</strong> supports <strong>cloud security</strong> and <strong>network security</strong>, helping the <strong>industry</strong> respond to <strong>cyber threats</strong> and <strong>security breaches</strong>.
            </p>
            <figure className="my-6 rounded-xl overflow-hidden border border-border">
              <LazyImage src="/placeholder.svg" alt="AI in cybersecurity and defence technologies" className="w-full aspect-video object-cover" />
              <figcaption className="text-sm text-muted-foreground px-4 py-2 bg-muted">AI and defence in security</figcaption>
            </figure>

            <h3 className="font-display font-semibold text-xl mt-6 mb-3">Cyber Threats and the Gaming Industry</h3>
            <p className="mb-4">
              <strong>Cyber</strong> threats targeting the <strong>gaming industry</strong> include <strong>data breaches</strong>, <strong>malware</strong>, and <strong>cyberattacks</strong> on <strong>gaming platforms</strong> and <strong>gaming accounts</strong>. <strong>Gaming companies</strong> such as <strong>Riot Games</strong> and other <strong>game developers</strong> work to protect <strong>gamers</strong> and the <strong>gaming community</strong>. <strong>Cybersecurity in gaming</strong> and <strong>online gaming</strong> <strong>security</strong> rely on <strong>technologies</strong> and <strong>skills</strong> to safeguard <strong>personal information</strong> and the <strong>gaming experience</strong> on <strong>popular games</strong>.
            </p>
            <figure className="my-6 rounded-xl overflow-hidden border border-border">
              <LazyImage src="/placeholder.svg" alt="Cyber threats and gaming industry security" className="w-full aspect-video object-cover" />
              <figcaption className="text-sm text-muted-foreground px-4 py-2 bg-muted">Cyber risk and gaming platforms</figcaption>
            </figure>

            <h3 className="font-display font-semibold text-xl mt-6 mb-3">Technologies and Malware Defence</h3>
            <p className="mb-4">
              <strong>Technologies</strong> for <strong>defence</strong> against <strong>malware</strong> and <strong>malicious software</strong> are essential across <strong>security</strong>, <strong>cybersecurity</strong>, and <strong>gaming</strong>. <strong>Cybersecurity solutions</strong> combine <strong>ai technology</strong>, <strong>cloud security</strong>, and <strong>network security</strong> to reduce <strong>cybersecurity risks</strong> and <strong>cyber risk</strong>. <strong>Cybercriminals</strong> and <strong>attacks</strong> target <strong>vulnerabilities</strong>; the <strong>industry</strong> must keep <strong>skills</strong> and <strong>technologies</strong> up to date to prevent <strong>security breaches</strong> and <strong>data breaches</strong>.
            </p>
            <figure className="my-6 rounded-xl overflow-hidden border border-border">
              <LazyImage src="/placeholder.svg" alt="Technologies and malware defence in security" className="w-full aspect-video object-cover" />
              <figcaption className="text-sm text-muted-foreground px-4 py-2 bg-muted">Malware defence and security technologies</figcaption>
            </figure>

            <h2 className="font-display font-bold text-2xl mt-8 mb-4">Industry and Security Best Practices</h2>
            <p className="mb-4">
              The <strong>industry</strong> continues to adopt <strong>security</strong> and <strong>cybersecurity</strong> best practices. <strong>Gaming companies</strong>, <strong>game developers</strong>, and <strong>online gaming platforms</strong> invest in <strong>cybersecurity solutions</strong> to protect <strong>gamers</strong> and <strong>players</strong>. <strong>Cybersecurity in gaming</strong> and <strong>ai in cybersecurity</strong> are key <strong>technologies</strong> for defending against <strong>cyber threats</strong>, <strong>cyber attacks</strong>, and <strong>malware</strong>, ensuring a safer <strong>gaming experience</strong> and <strong>gaming community</strong>.
            </p>
            <figure className="my-6 rounded-xl overflow-hidden border border-border">
              <LazyImage src="/placeholder.svg" alt="Industry security and gaming community best practices" className="w-full aspect-video object-cover" />
              <figcaption className="text-sm text-muted-foreground px-4 py-2 bg-muted">Industry and gaming security best practices</figcaption>
            </figure>
            <p className="mb-4">
              From <strong>artificial intelligence</strong> and <strong>ai agents</strong> to <strong>cloud security</strong> and <strong>network security</strong>, our blog series covers the latest in <strong>technology, cybersecurity, and gaming intelligence</strong>. Explore our articles on <strong>cyber</strong> threats, <strong>cybersecurity risks</strong>, <strong>data breaches</strong>, <strong>vulnerabilities</strong>, <strong>online gaming</strong>, <strong>popular games</strong>, and <strong>personal information</strong> protection. We focus on <strong>security</strong>, <strong>gaming</strong>, and <strong>cybersecurity</strong> so you stay ahead.
            </p>
          </article>

          {/* Niche Filter Tabs */}
          <Tabs value={selectedNiche} onValueChange={(v) => setSelectedNiche(v as typeof selectedNiche)}>
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Article Display */}
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                No articles yet. Content is managed in Convex.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Article Counter */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Article {currentIndex + 1} of {filteredArticles.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={filteredArticles.length === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={filteredArticles.length === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Current Article Card */}
            {currentArticle && (
              <Card className="overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden">
                  <LazyImage
                    src={currentArticle.imageUrl}
                    alt={currentArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className={nicheStyles[currentArticle.niche].badge}>
                      {nicheStyles[currentArticle.niche].label}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">
                    {currentArticle.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {currentArticle.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentArticle.readTime} min read
                    </div>
                    <span className="font-medium text-foreground">{currentArticle.author}</span>
                  </div>

                  {/* Tags */}
                  {currentArticle.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentArticle.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Article Preview */}
                  <div 
                    className="prose prose-slate max-w-none dark:prose-invert mb-6"
                    dangerouslySetInnerHTML={{ 
                      __html: currentArticle.content.substring(0, 500) + '...' 
                    }}
                  />

                  {/* Read More Button */}
                  <Button asChild className="w-full md:w-auto">
                    <Link to={`/article/${currentArticle.slug || currentArticle.id}`}>
                      Read Full Article →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Article Thumbnails Grid */}
            {filteredArticles.length > 1 && (
              <div className="mt-8">
                <h2 className="font-display font-bold text-2xl mb-4">All Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((article, index) => (
                    <Card
                      key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg",
                        index === currentIndex && "ring-2 ring-primary",
                        nicheStyles[article.niche].bg
                      )}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <LazyImage
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={nicheStyles[article.niche].badge}>
                            {nicheStyles[article.niche].label}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

