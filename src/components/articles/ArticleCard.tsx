import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, Clock, Shield, AlertTriangle } from 'lucide-react';
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

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { user, toggleBookmark } = useAuth();
  const styles = nicheStyles[article.niche];
  const isBookmarked = user?.bookmarks.includes(article.id);

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
          'group overflow-hidden border-0 bg-card transition-all duration-300',
          styles.accent
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
        <div className="group flex gap-4 py-4 border-b border-border last:border-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

  return (
    <Link to={`/article/${article.id}`}>
      <Card className={cn(
        'group overflow-hidden border border-border bg-card transition-all duration-300 hover:border-border/80',
        styles.accent
      )}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{article.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} min
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
