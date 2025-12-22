import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, Clock, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ArticleStats } from '@/components/articles/ArticleStats';
import { ArticleRating } from '@/components/articles/ArticleRating';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

const nicheStyles = {
  tech: {
    badge: 'bg-tech/10 text-tech border-tech/20',
    accent: 'group-hover:shadow-glow-tech',
  },
  security: {
    badge: 'bg-security/10 text-security border-security/20',
    accent: 'group-hover:shadow-glow-security',
  },
  gaming: {
    badge: 'bg-gaming/10 text-gaming border-gaming/20',
    accent: 'group-hover:shadow-glow-gaming',
  },
};

const nicheLabels = {
  tech: 'Innovate',
  security: 'Secured',
  gaming: 'Play',
};

// Determine difficulty level based on readTime
const getDifficultyLevel = (readTime: number): 'Beginner' | 'Expert' => {
  return readTime <= 10 ? 'Beginner' : 'Expert';
};

// Get security score glow color
const getSecurityGlow = (score?: number): string => {
  if (!score) return '';
  if (score <= 1) return 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]';
  if (score <= 2) return 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]';
  if (score <= 3) return 'group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]';
  if (score <= 4) return 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]';
  return 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'; // score 5
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { user, toggleBookmark } = useAuth();
  const styles = nicheStyles[article.niche];
  const isBookmarked = user?.bookmarks.includes(article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      toggleBookmark(article.id);
    }
  };

  if (variant === 'featured') {
    const securityGlow = getSecurityGlow(article.securityScore);
    return (
      <Link to={`/article/${article.id}`}>
        <Card className={cn(
          'group overflow-hidden border-0 bg-card transition-all duration-200 hover:scale-[1.02]',
          styles.accent,
          securityGlow
        )}>
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80'}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={styles.badge}>{nicheLabels[article.niche]}</Badge>
              {article.isSponsored && (
                <Badge variant="secondary">Sponsored</Badge>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2 text-foreground">
                {article.title}
              </h2>
              <p className="text-muted-foreground line-clamp-2 mb-3">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.id}`}>
        <div className="group flex gap-4 py-4 border-b border-border last:border-0 transition-all duration-200 hover:scale-[1.02]">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop&q=80'}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop&q=80';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <Badge className={cn('mb-2', styles.badge)} variant="outline">
              {nicheLabels[article.niche]}
            </Badge>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <span className="text-sm text-muted-foreground">{article.readTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  const difficulty = getDifficultyLevel(article.readTime);
  const securityGlow = getSecurityGlow(article.securityScore);

  return (
    <Link to={`/article/${article.id}`}>
      <Card className={cn(
        'group overflow-hidden border border-border bg-card transition-all duration-200 hover:scale-[1.02] hover:border-border/80',
        styles.accent,
        securityGlow
      )}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80';
            }}
          />
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex gap-2 flex-wrap">
              <Badge className={styles.badge}>{nicheLabels[article.niche]}</Badge>
              {article.isSponsored && (
                <Badge variant="secondary">Sponsored</Badge>
              )}
              {article.impactLevel && (
                <Badge 
                  variant={article.impactLevel === 'high' ? 'destructive' : 'secondary'}
                  className="gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {article.impactLevel.toUpperCase()}
                </Badge>
              )}
            </div>
            {user && (
              <button
                onClick={handleBookmark}
                className={cn(
                  'p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors',
                  isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
              </button>
            )}
          </div>
          {article.securityScore !== undefined && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
              <Shield className="h-4 w-4 text-gaming" />
              <span className="text-sm font-medium">{article.securityScore}</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          
          {/* Actionability Bar */}
          <div className="space-y-2 mb-3 pt-3 border-t border-border">
            <ArticleStats
              viewCount={(article as any).viewCount}
              commentCount={(article as any).commentCount}
              readTime={article.readTime}
              isTrending={(article as any).isTrending}
              size="sm"
            />
            {(article as any).rating && (
              <ArticleRating score={(article as any).rating} size="sm" showLabel={false} />
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Difficulty Pill */}
                <Badge 
                  variant="outline" 
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    difficulty === 'Beginner' 
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' 
                      : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
                  )}
                >
                  {difficulty}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{article.author}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
