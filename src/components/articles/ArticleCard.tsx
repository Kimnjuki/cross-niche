import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, Clock, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

const nicheStyles = {
  tech: {
    badge: 'bg-tech/10 text-tech border-tech/20',
    accent: 'group-hover:shadow-glow-tech',
    glow: 'group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]',
  },
  security: {
    badge: 'bg-security/10 text-security border-security/20',
    accent: 'group-hover:shadow-glow-security',
    glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  },
  gaming: {
    badge: 'bg-gaming/10 text-gaming border-gaming/20',
    accent: 'group-hover:shadow-glow-gaming',
    glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  },
};

const nicheLabels = {
  tech: 'Innovate',
  security: 'Secured',
  gaming: 'Play',
};

// Get difficulty level from article tags or content
const getDifficultyLevel = (article: Article): 'beginner' | 'intermediate' | 'advanced' | null => {
  const tags = article.tags.map(t => t.toLowerCase());
  if (tags.some(t => t.includes('beginner') || t.includes('basic') || t.includes('intro'))) {
    return 'beginner';
  }
  if (tags.some(t => t.includes('advanced') || t.includes('expert') || t.includes('pro'))) {
    return 'advanced';
  }
  if (tags.some(t => t.includes('intermediate') || t.includes('medium'))) {
    return 'intermediate';
  }
  return null;
};

// Get security score glow color
const getSecurityGlow = (score?: number): string => {
  if (!score) return '';
  if (score <= 2) return 'shadow-[0_0_15px_rgba(239,68,68,0.4)]';
  if (score >= 4) return 'shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  return 'shadow-[0_0_15px_rgba(234,179,8,0.4)]';
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { user, toggleBookmark } = useAuth();
  const styles = nicheStyles[article.niche];
  const isBookmarked = user?.bookmarks.includes(article.id);
  const difficulty = getDifficultyLevel(article);
  const securityGlow = getSecurityGlow(article.securityScore);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await toggleBookmark(article.id);
    }
  };

  if (variant === 'featured') {
    return (
      <Link to={`/article/${article.id}`}>
        <Card className={cn(
          'group overflow-hidden border-0 bg-card transition-all duration-300 transform hover:scale-[1.02]',
          styles.accent,
          styles.glow,
          securityGlow
        )}>
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              {/* Actionability Bar */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground bg-background/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{article.readTime} min</span>
                </div>
                {difficulty && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      difficulty === 'beginner' && 'border-green-500/30 text-green-500 bg-green-500/10',
                      difficulty === 'intermediate' && 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10',
                      difficulty === 'advanced' && 'border-red-500/30 text-red-500 bg-red-500/10'
                    )}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                )}
                {article.securityScore !== undefined && (
                  <div className={cn(
                    'flex items-center gap-1 bg-background/60 backdrop-blur-sm rounded-full px-3 py-1',
                    article.securityScore <= 2 && 'text-red-500',
                    article.securityScore >= 4 && 'text-green-500',
                    article.securityScore === 3 && 'text-yellow-500'
                  )}>
                    <Shield className="h-3.5 w-3.5" />
                    <span className="font-medium font-mono text-xs">{article.securityScore}/5</span>
                  </div>
                )}
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
        <div className="group flex gap-4 py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-all duration-200">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn('text-xs', styles.badge)} variant="outline">
                {nicheLabels[article.niche]}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{article.readTime} min</span>
              </div>
            </div>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`}>
      <Card className={cn(
        'group overflow-hidden border border-border bg-card transition-all duration-300 hover:border-border/80 transform hover:scale-[1.02]',
        styles.accent,
        styles.glow,
        securityGlow
      )}>
        <div className="relative aspect-video overflow-hidden" style={{ minHeight: '225px' }}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
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
            <div className={cn(
              'absolute bottom-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1',
              article.securityScore <= 2 && 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
              article.securityScore >= 4 && 'text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]',
              article.securityScore === 3 && 'text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
            )}>
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium font-mono">{article.securityScore}/5</span>
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
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{article.author}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">{article.readTime} min</span>
              </div>
              {difficulty && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-xs px-2 py-0.5',
                    difficulty === 'beginner' && 'border-green-500/30 text-green-500 bg-green-500/10',
                    difficulty === 'intermediate' && 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10',
                    difficulty === 'advanced' && 'border-red-500/30 text-red-500 bg-red-500/10'
                  )}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

