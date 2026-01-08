import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { mockArticles } from '@/data/mockData';
import { useContentBySlug, useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticle, mapContentToArticles } from '@/lib/contentMapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentSection } from '@/components/comments/CommentSection';
import { ArticleCard } from '@/components/articles/ArticleCard';
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
import { useReadingTracker, useUserBehavior } from '@/hooks/useUserBehavior';
import { cn } from '@/lib/utils';
import type { Article as ArticleType } from '@/types';

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

  // Try to fetch from Supabase by slug
  const { data: contentData, isLoading } = useContentBySlug(id || '');

  // Get related content based on feed
  const feedSlug = contentData?.feed_slug || '';
  const { data: relatedContent } = useContentByFeed(feedSlug, 4);

  // Map Supabase content to Article type, fallback to mock
  let article: ArticleType | undefined;
  let relatedArticles: ArticleType[] = [];

  if (contentData) {
    article = mapContentToArticle(contentData);
    relatedArticles = relatedContent
      ? mapContentToArticles(relatedContent).filter(a => a.id !== id).slice(0, 3)
      : [];
  } else if (!isLoading) {
    // Fallback to mock data
    article = mockArticles.find(a => a.id === id);
    relatedArticles = mockArticles
      .filter(a => a.niche === article?.niche && a.id !== id)
      .slice(0, 3);
  }

  // Track user behavior and reading progress
  const { trackArticleBookmark, trackArticleShare } = useUserBehavior(user?.id || 'demo-user');
  useReadingTracker(article!, user?.id || 'demo-user');

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

    // Track share behavior
    trackArticleShare(article);
  };

  const handleBookmark = async () => {
    await toggleBookmark(article.id);
    // Track bookmark behavior
    trackArticleBookmark(article);
  };

  return (
    <Layout>
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
              <Badge className="bg-gaming/10 text-gaming border-gaming/20 gap-1">
                <Shield className="h-3 w-3" />
                Security Score: {article.securityScore}
              </Badge>
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
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} min read
            </span>
          </div>
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
              onClick={handleBookmark}
              className="gap-2"
            >
              <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl mb-12">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-lg leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }}
            />
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
