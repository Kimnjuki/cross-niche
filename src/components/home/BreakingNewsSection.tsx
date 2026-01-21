import { Article } from '@/types';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BreakingNewsSectionProps {
  articles: Article[];
  maxItems?: number;
}

export function BreakingNewsSection({ articles, maxItems = 5 }: BreakingNewsSectionProps) {
  // Get most recent articles (breaking news)
  const breakingNews = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, maxItems);

  if (breakingNews.length === 0) return null;

  return (
    <section className="py-8 bg-destructive/5 border-b-2 border-destructive/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl text-destructive">Breaking News</h2>
          <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {breakingNews.map((article, index) => (
            <Link
              key={article.id}
              to={`/article/${article.slug || article.id}`}
              className={cn(
                'group p-4 rounded-lg border border-border hover:border-primary transition-all',
                'bg-card hover:bg-muted/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-destructive mt-2 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/blog-series?filter=latest"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all latest tech news →
          </Link>
        </div>
      </div>
    </section>
  );
}

