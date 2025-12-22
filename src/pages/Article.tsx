import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockArticles } from '@/data/mockData';
import { fetchArticleBySlug } from '@/lib/articles/articleFetcher';
import { useContentBySlug, useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticle, mapContentToArticles } from '@/lib/contentMapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentSection } from '@/components/comments/CommentSection';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { AISummarizeButton } from '@/components/ai/AISummarizeButton';
import { NexusScoreBadge } from '@/components/nexus/NexusScoreBadge';
import { ArticleStats } from '@/components/articles/ArticleStats';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  Shield, 
  AlertTriangle,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Article as ArticleType } from '@/types';
import { ReadingProgressBar } from '@/components/layout/ReadingProgressBar';
import { SEOHead } from '@/components/seo/SEOHead';
import { CodeSnippetPreview } from '@/components/articles/CodeSnippetPreview';

const nicheStyles = {
  tech: { badge: 'bg-tech/10 text-tech border-tech/20', color: 'text-tech' },
  security: { badge: 'bg-security/10 text-security border-security/20', color: 'text-security' },
  gaming: { badge: 'bg-gaming/10 text-gaming border-gaming/20', color: 'text-gaming' },
};

const nicheLabels = { tech: 'Innovate', security: 'Secured', gaming: 'Play' };
const nicheRoutes = { tech: '/tech', security: '/security', gaming: '/gaming' };

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const { user, toggleBookmark } = useAuth();
  const [fetchedArticle, setFetchedArticle] = useState<ArticleType | null>(null);
  const [isFetchingArticle, setIsFetchingArticle] = useState(false);
  
  // Check if id looks like a UUID (Supabase ID) or a slug
  const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const isSlug = id && !isUUID && id.includes('-') && id.length > 10;
  
  // Mock article ID patterns (don't query Supabase for these)
  const isMockArticleId = id && (
    id.startsWith('tech-') || 
    id.startsWith('sec-') || 
    id.startsWith('game-') || 
    id.startsWith('expert-interview-') ||
    id.startsWith('guide-') ||
    id.startsWith('tut-') ||
    id === 'uefi-flaw-2024' ||
    id === 'microsoft-365-oauth-phishing' ||
    id === 'forticloud-sso-exposure'
  );
  
  // Try fetching from Supabase by slug if it looks like a slug
  // For mock article IDs (like 'tech-1', 'expert-interview-1'), skip Supabase lookup
  const shouldQuerySupabase = !!id && (isSlug || isUUID) && !isMockArticleId;
  const { data: contentData, isLoading: isLoadingSupabase } = useContentBySlug(id || '', {
    enabled: shouldQuerySupabase,
  });
  
  // Get related content based on feed
  const feedSlug = contentData?.feed_slug || '';
  const { data: relatedContent } = useContentByFeed(feedSlug, 4);
  
  // Fetch article from article fetcher if not found in mock data
  useEffect(() => {
    if (!id || contentData || isLoadingSupabase) return;
    
    // Check if article exists in mock data first
    const mockArticle = mockArticles.find(a => a.id === id);
    if (mockArticle) {
      setFetchedArticle(null);
      setIsFetchingArticle(false);
      return;
    }
    
    // Try fetching from article fetcher
    setIsFetchingArticle(true);
    fetchArticleBySlug(id)
      .then((fetched) => {
        if (fetched) {
          setFetchedArticle({
            id: id,
            title: fetched.title,
            excerpt: fetched.excerpt,
            content: fetched.content,
            niche: fetched.niche,
            author: fetched.author,
            publishedAt: fetched.publishedAt,
            readTime: fetched.readTime,
            imageUrl: fetched.imageUrl,
            tags: fetched.tags,
            impactLevel: fetched.impactLevel,
            securityScore: fetched.securityScore,
            isFeatured: true,
            viewCount: 100000,
            commentCount: 50,
            rating: 9.0,
            isTrending: true,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching article:', error);
      })
      .finally(() => {
        setIsFetchingArticle(false);
      });
  }, [id, contentData, isLoadingSupabase]);
  
  // Map Supabase content to Article type, fallback to mock
  let article: ArticleType | undefined;
  let relatedArticles: ArticleType[] = [];
  
  if (contentData) {
    // Found in Supabase
    article = mapContentToArticle(contentData);
    relatedArticles = relatedContent
      ? mapContentToArticles(relatedContent).filter(a => a.id !== id).slice(0, 3)
      : [];
  } else if (!isLoadingSupabase) {
    // Fallback to mock data - check exact ID match first
    article = mockArticles.find(a => a.id === id) || fetchedArticle || undefined;
    
    // If still not found and id exists, try to find by partial match or slug-like matching
    if (!article && id) {
      // Try matching by creating a slug from title
      const slugMatch = mockArticles.find(a => {
        const articleSlug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
        return articleSlug.includes(id.toLowerCase()) || id.toLowerCase().includes(articleSlug);
      });
      if (slugMatch) article = slugMatch;
    }
    
    // Get related articles
    if (article) {
      relatedArticles = mockArticles
        .filter(a => a.niche === article?.niche && a.id !== article.id)
        .slice(0, 3);
    }
  }
  
  // Only show loading if we're querying Supabase or fetching article
  const isLoading = (isLoadingSupabase && shouldQuerySupabase) || isFetchingArticle;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 text-foreground">
                Article Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                The article you're looking for doesn't exist or may have been moved.
              </p>
              {id && (
                <p className="text-sm text-muted-foreground mb-8">
                  Requested ID: <code className="px-2 py-1 bg-muted rounded text-xs">{id}</code>
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg">
                <Link to="/">Go Home</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/tech">Browse Tech</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/security">Browse Security</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/gaming">Browse Gaming</Link>
              </Button>
            </div>

            {/* Suggest similar articles */}
            {mockArticles.length > 0 && (
              <div className="mt-12 pt-12 border-t border-border">
                <h2 className="text-2xl font-semibold mb-6">You might be interested in:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockArticles.slice(0, 4).map((suggested) => (
                    <ArticleCard key={suggested.id} article={suggested} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const styles = nicheStyles[article.niche];
  const isBookmarked = user?.bookmarks.includes(article.id);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  // Determine difficulty level from readTime (heuristic)
  const difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 
    article.readTime <= 5 ? 'beginner' :
    article.readTime <= 10 ? 'intermediate' :
    article.readTime <= 15 ? 'advanced' : 'expert';

  return (
    <Layout>
      <ReadingProgressBar />
      <SEOHead
        title={article.title}
        description={article.excerpt}
        image={article.imageUrl}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        difficultyLevel={difficultyLevel}
        keywords={article.tags}
        section={nicheLabels[article.niche]}
        author={article.author}
        publishedAt={article.publishedAt}
      />
      <article className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          to={nicheRoutes[article.niche]} 
          className={cn('inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity', styles.color)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {nicheLabels[article.niche]}
        </Link>

        {/* Header */}
        <header className="max-w-4xl mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={styles.badge}>{nicheLabels[article.niche]}</Badge>
            {article.isSponsored && <Badge variant="secondary">Sponsored</Badge>}
            {article.impactLevel && (
              <Badge variant={article.impactLevel === 'high' ? 'destructive' : 'secondary'} className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {article.impactLevel.toUpperCase()} IMPACT
              </Badge>
            )}
            {article.securityScore !== undefined && (
              <NexusScoreBadge
                cvssScore={article.securityScore}
                affectsGamingHardware={article.niche === 'gaming'}
                variant="default"
              />
            )}
          </div>
          
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-4">
            {article.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {article.excerpt}
          </p>
          
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{article.author}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}</span>
                  <ArticleStats
                    viewCount={(article as any).viewCount}
                    commentCount={(article as any).commentCount}
                    readTime={article.readTime}
                    isTrending={(article as any).isTrending}
                  />
                </div>
                
                {(article as any).rating && (
                  <div className="mt-4">
                    <ArticleRating score={(article as any).rating} size="lg" />
                  </div>
                )}
        </header>

        {/* Featured Image */}
        <div className="max-w-4xl mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-xl"
          />
        </div>

        {/* Action Bar */}
        <div className="max-w-4xl mb-8 flex items-center justify-between border-y border-border py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button variant="ghost" size="icon" onClick={() => handleShare('twitter')}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare('facebook')}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare('linkedin')}>
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
          {user && (
            <Button
              variant={isBookmarked ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleBookmark(article.id)}
              className="gap-2"
            >
              <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl mb-12">
          {/* Code Snippet Preview for Technical Deep-Dives */}
          {(article.niche === 'security' || article.niche === 'tech' || 
            article.tags.some(tag => ['exploit', 'vulnerability', 'code', 'technical', 'cve'].includes(tag.toLowerCase()))) && (
            <div className="mb-8 animate-reveal">
              <CodeSnippetPreview
                code={`// Example exploit code snippet
const exploit = () => {
  // Vulnerability demonstration
  return executePayload();
};`}
                language="javascript"
                title="Exploit Preview"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div 
              className="text-lg leading-relaxed text-foreground animate-reveal"
              dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }}
            />
          </div>
          
          {/* AI Summary Section */}
          <div className="mt-8 animate-reveal">
            <AISummarizeButton content={article.content || article.excerpt} title={article.title} />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="max-w-4xl mb-16">
          <CommentSection articleId={article.id} />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-border pt-12">
            <h2 className="font-display font-bold text-2xl mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
