import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockArticles } from '@/data/mockData';
import { useContentBySlug, useContentByFeed, usePublishedContent, useRelatedContent } from '@/hooks/useContent';
import type { ContentItem } from '@/hooks/useContent';
import { mapContentToArticle, mapContentToArticles } from '@/lib/contentMapper';
import { NexusScrollBridge } from '@/components/nexus/NexusScrollBridge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentSection } from '@/components/comments/CommentSection';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleSkeleton } from '@/components/articles/ArticleSkeleton';
import {
  ArrowLeft,
  Clock,
  Bookmark,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReadingTracker, useUserBehavior } from '@/hooks/useUserBehavior';
import { AITools } from '@/components/ai/AITools';
import { EnhancedShareBar } from '@/components/sharing/EnhancedShareBar';
import { SEOHead } from '@/components/seo/SEOHead';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FAQSection } from '@/components/seo/FAQSection';
import { LazyImage } from '@/components/ui/lazy-image';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { cn, authorSlug } from '@/lib/utils';
import {
  trackArticleView,
  trackArticleReadTime,
  trackSocialShare,
  trackRelatedArticleClick,
} from '@/lib/analytics/ga4';
import { getPlaceholderByNiche } from '@/lib/placeholderImages';
import { prepareArticleContent } from '@/lib/markdownToHtml';
import { getRelatedClusterContent } from '@/lib/seo/topicClusters';
import type { Article as ArticleType } from '@/types';

const nicheStyles = {
  tech: { badge: 'bg-tech/10 text-tech border-tech/20', color: 'text-tech' },
  security: { badge: 'bg-security/10 text-security border-security/20', color: 'text-security' },
  gaming: { badge: 'bg-gaming/10 text-gaming border-gaming/20', color: 'text-gaming' },
};

const nicheLabels = { tech: 'Innovate', security: 'Secured', gaming: 'Play' };
const nicheRoutes = { tech: '/tech', security: '/security', gaming: '/gaming' };

// Safe article ID helper
const getArticleId = (a: ArticleType | null | undefined): string =>
  (a as ArticleType & { _id?: string })?._id ?? a?.id ?? a?.slug ?? '';

export default function Article() {
  const params = useParams<{ slug?: string; id?: string }>();
  const slugOrId = (params.slug ?? params.id ?? '').trim();

  // All hooks must run unconditionally (no early return before hooks — fixes React #300)
  const { data: contentData, isLoading } = useContentBySlug(slugOrId, { enabled: slugOrId.length > 0 });
  const feedSlug = contentData?.feed_slug ?? '';
  const { data: relatedContent } = useContentByFeed(feedSlug, 4);
  const { data: publishedForCross } = usePublishedContent(30);
  const convexContentId = contentData?.id ?? null;
  const { data: relatedByTags } = useRelatedContent(convexContentId, 6);
  const { user, toggleBookmark } = useAuth();

  // 2. MEMOIZED ARTICLE MAPPING
  const article: ArticleType | null = useMemo(() => {
    if (contentData) {
      return mapContentToArticle(contentData) ?? null;
    }
    if (!slugOrId) return null;
    return mockArticles.find((a) => (a?.slug ?? a?.id) === slugOrId) ?? null;
  }, [contentData, slugOrId]);

  // 3. SAFE ARTICLE ID (compute before using in hooks/memos)
  const articleId = getArticleId(article);
  const hasArticle = !!article && !!articleId;

  // 4. RELATED ARTICLES (feed-based fallback)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const convexArticles = relatedContent ? mapContentToArticles(relatedContent as ContentItem[]) : [];
    const mockFallback = mockArticles.filter((a) => a?.niche === article?.niche);
    const combined: ArticleType[] = [...convexArticles, ...mockFallback];
    const seen = new Set<string>();
    return combined
      .filter((a): a is ArticleType => {
        if (!a) return false;
        const id = getArticleId(a);
        if (!id || id === articleId || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 6);
  }, [relatedContent, article, articleId]);

  // 4b. RELATED INTELLIGENCE (tag-based from Convex, fixes orphan pages)
  const relatedIntelligence = useMemo(() => {
    const byTags = relatedByTags ? mapContentToArticles(relatedByTags) : [];
    const seen = new Set<string>();
    const fromTags = byTags.filter((a) => {
      if (!a) return false;
      const id = getArticleId(a);
      if (!id || id === articleId || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    if (fromTags.length >= 3) return fromTags.slice(0, 6);
    for (const a of relatedArticles) {
      const id = getArticleId(a);
      if (id && !seen.has(id)) {
        seen.add(id);
        fromTags.push(a);
        if (fromTags.length >= 6) break;
      }
    }
    return fromTags;
  }, [relatedByTags, relatedArticles, articleId]);

  // 5. CROSS SECTION ARTICLE (for cross-niche internal linking / SEO)
  const crossSectionArticle = useMemo(() => {
    if (!article || !articleId) return null;
    
    // Get Convex articles if available
    const convexArticles = publishedForCross ? mapContentToArticles(publishedForCross as ContentItem[]) : [];
    
    // Combine with mock articles as fallback
    const combined = [...convexArticles, ...mockArticles];
    
    // Find an article from a DIFFERENT niche (cross-section linking)
    const other = combined.find(
      (a) => a && getArticleId(a) && a.niche !== article.niche && getArticleId(a) !== articleId
    );
    return other && getArticleId(other) ? other : null;
  }, [article, articleId, publishedForCross]);

  // 6. BEHAVIOR TRACKING HOOKS (must always be called, unconditionally)
  const { trackArticleBookmark, trackArticleShare } = useUserBehavior(user?.id ?? 'demo-user');

  // 6b. GA4 article tracking (when article is loaded)
  useEffect(() => {
    if (!hasArticle || !article) return;
    trackArticleView(articleId, article.title ?? 'Untitled', article.niche);
    trackArticleReadTime(articleId, article.readTime ?? 5);
  }, [hasArticle, article, articleId]);

  // 7. READING TRACKER (only track if article exists and has id)
  useReadingTracker(hasArticle ? article : undefined, user?.id ?? 'demo-user');

  // 8. LOADING STATE - AFTER ALL HOOKS
  if (isLoading) {
    return <ArticleSkeleton />;
  }

  // 9. NOT FOUND STATE - AFTER ALL HOOKS
  if (!hasArticle) {
    return (
      <Layout>
        <SEOHead
          title="Article Not Found | The Grid Nexus"
          description="The article you're looking for doesn't exist."
          noindex={true}
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display font-bold text-4xl mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // 11. SAFE DERIVED VALUES (article is guaranteed to exist here)
  const safeNiche: 'tech' | 'security' | 'gaming' =
    article.niche === 'tech' || article.niche === 'security' || article.niche === 'gaming'
      ? article.niche
      : 'tech';
  const styles = nicheStyles[safeNiche];
  const tags = Array.isArray(article.tags) ? article.tags : [];
  const isBookmarked = user?.bookmarks?.includes(articleId);

  // 11. EVENT HANDLERS
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title ?? '';
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    trackArticleShare(article);
    trackSocialShare(platform, articleId, article.title ?? undefined);
  };

  const handleBookmark = async () => {
    if (articleId) {
      await toggleBookmark(articleId);
      trackArticleBookmark(article);
    }
  };

  // 12. RENDER (article is guaranteed to exist and have an ID)
  return (
    <Layout>
      <SEOHead
        title={undefined}
        description={undefined}
        keywords={tags}
        image={article.imageUrl ?? getPlaceholderByNiche(article.niche, article.slug ?? article.id)}
        url={`${window.location.origin}/article/${article.slug ?? articleId}`}
        type="article"
        article={article}
        publishedTime={article.publishedAt}
        author={article.author ?? 'Anonymous'}
        section={safeNiche}
        tags={tags}
        autoGenerate={true}
      />

      <article className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: nicheLabels[safeNiche], href: nicheRoutes[safeNiche] },
            { label: article.title ?? 'Untitled', href: window.location.pathname },
          ]}
        />

        <Link
          to={nicheRoutes[safeNiche]}
          className={cn('inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity', styles.color)}
          aria-label={`View more ${nicheLabels[safeNiche]} articles`}
        >
          <ArrowLeft className="h-4 w-4" />
          View more {nicheLabels[safeNiche]} articles
        </Link>

        <header className="max-w-4xl mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={styles.badge}>{nicheLabels[safeNiche]}</Badge>
            {article.isSponsored && <Badge variant="secondary">Sponsored</Badge>}
            {article.impactLevel && (
              <Badge variant={article.impactLevel === 'high' ? 'destructive' : 'secondary'} className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {article.impactLevel.toUpperCase()} IMPACT
              </Badge>
            )}
            {article.securityScore !== undefined && (
              <Badge className="bg-gaming/10 text-gaming border-gaming/20 gap-1">
                <Shield className="h-3 w-3" />
                Security Score: {article.securityScore}
              </Badge>
            )}
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl mb-4">
            {article.title ?? 'Untitled'}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {article.excerpt ?? ''}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link
              to={`/author/${authorSlug(article.author ?? '')}`}
              className="font-medium text-foreground hover:underline"
            >
              {article.author ?? 'Anonymous'}
            </Link>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime ?? 5} min read
            </span>
          </div>
        </header>

        <div className="max-w-4xl mb-8">
          <LazyImage
            src={article.imageUrl ?? getPlaceholderByNiche(article.niche, article.slug ?? article.id)}
            alt={article.title ?? 'Article'}
            className="w-full aspect-video rounded-xl"
          />
        </div>

        <div className="max-w-4xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedShareBar article={article} variant="inline" />
            </div>

            <div className="flex justify-end">
              {user && (
                <Button
                  variant={isBookmarked ? 'default' : 'outline'}
                  size="lg"
                  onClick={handleBookmark}
                  className="gap-2 w-full lg:w-auto"
                >
                  <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
                  {isBookmarked ? 'Saved' : 'Save Article'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <EnhancedShareBar article={article} variant="floating" className="hidden lg:block" />

        <NexusScrollBridge
          currentNiche={safeNiche}
          crossSectionArticle={crossSectionArticle}
          className="max-w-4xl"
        >
          <div className="mb-12">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-lg leading-relaxed text-foreground article-content"
                dangerouslySetInnerHTML={{
                  __html: prepareArticleContent(article.content) || prepareArticleContent(article.excerpt) || '<p class="text-muted-foreground">No content available for this article.</p>',
                }}
              />
            </div>

            <AdPlacement position="in-article" />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mb-12">
            <AITools
              articleContent={article.content ?? article.excerpt ?? ''}
              articleTitle={article.title ?? 'Article'}
            />
          </div>

          <div className="mb-16">
            <CommentSection articleId={articleId} />
          </div>

          {/* Topic Cluster Links - Hub-and-Spoke Internal Linking */}
          {(() => {
            const cluster = getRelatedClusterContent(
              article.tags || [],
              safeNiche
            );
            if (cluster) {
              return (
                <section className="border-t border-border pt-12 mb-12" aria-label="Topic Cluster">
                  <h2 className="font-display font-bold text-2xl mb-4">
                    Explore {cluster.hub.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Dive deeper into this topic with our comprehensive coverage:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                      <Link to={cluster.hub.url} className="text-primary hover:underline">
                        {cluster.hub.title} →
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4">{cluster.hub.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cluster.spokes.map((spoke, idx) => (
                        <Link
                          key={idx}
                          to={spoke.url}
                          className="text-sm text-primary hover:underline flex items-center gap-2"
                        >
                          <span>•</span>
                          <span>{spoke.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }
            return null;
          })()}

          {relatedIntelligence.length > 0 && (
            <section className="border-t border-border pt-12" aria-label="Related Intelligence">
              <h2 className="font-display font-bold text-2xl mb-4">
                Related Intelligence
              </h2>
              <p className="text-muted-foreground mb-8">
                Discover connected coverage across tech, security, and gaming. Every article links to related content for deeper exploration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {relatedIntelligence
                  .filter((r): r is ArticleType => r != null && !!getArticleId(r))
                  .map((related) => (
                    <ArticleCard
                      key={getArticleId(related) || related.title}
                      article={related}
                      onArticleClick={() =>
                        trackRelatedArticleClick(
                          articleId,
                          getArticleId(related),
                          related.title ?? undefined
                        )
                      }
                    />
                  ))}
              </div>
              <div className="text-center">
                <Link
                  to={nicheRoutes[safeNiche]}
                  className="text-primary hover:underline font-medium"
                  aria-label={`View all ${nicheLabels[safeNiche]} articles`}
                >
                  View all {nicheLabels[safeNiche]} articles →
                </Link>
              </div>
            </section>
          )}
        </NexusScrollBridge>

        <FAQSection
          faqs={[
            {
              question: `What is ${article.title ?? 'this article'}?`,
              answer: article.excerpt || 'Learn more with The Grid Nexus.',
            },
            {
              question: `How does this relate to ${safeNiche === 'tech' ? 'technology' : safeNiche === 'security' ? 'cybersecurity' : 'gaming'}?`,
              answer: `This article is part of our ${nicheLabels[safeNiche]} coverage.`,
            },
            {
              question: 'Where can I find more related content?',
              answer: `Explore our ${nicheLabels[safeNiche]} section or the full blog series.`,
            },
          ]}
          title={`Frequently Asked Questions about ${article.title ?? 'this article'}`}
        />
      </article>
    </Layout>
  );
}
