import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock } from 'lucide-react';
import { ArticleStats } from '@/components/articles/ArticleStats';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface PopularStoriesWidgetProps {
  articles: Article[];
  title?: string;
  maxItems?: number;
  className?: string;
}

const nicheLabels = {
  tech: 'Innovate',
  security: 'Secured',
  gaming: 'Play',
};

const nicheColors = {
  tech: 'bg-tech/10 text-tech border-tech/20',
  security: 'bg-security/10 text-security border-security/20',
  gaming: 'bg-gaming/10 text-gaming border-gaming/20',
};

export function PopularStoriesWidget({ 
  articles, 
  title = 'Popular Stories',
  maxItems = 5,
  className 
}: PopularStoriesWidgetProps) {
  const popularArticles = articles
    .sort((a, b) => {
      // Sort by view count, then by published date
      const aViews = (a as any).viewCount || 0;
      const bViews = (b as any).viewCount || 0;
      if (bViews !== aViews) return bViews - aViews;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, maxItems);

  if (popularArticles.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Most viewed articles this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularArticles.map((article, index) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="block group"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    'bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors'
                  )}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={cn('text-xs', nicheColors[article.niche])}>
                      {nicheLabels[article.niche]}
                    </Badge>
                  </div>
                  <h4 className={cn(
                    'font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors',
                    'text-sm'
                  )}>
                    {article.title}
                  </h4>
                  <ArticleStats
                    viewCount={(article as any).viewCount}
                    readTime={article.readTime}
                    size="sm"
                  />
                </div>
              </div>
              {index < popularArticles.length - 1 && (
                <div className="mt-4 border-b border-border" />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

