import { Link } from 'react-router-dom';
import { Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { Article } from '@/types';

interface LiveFeedWidgetProps {
  articles: Article[];
  maxItems?: number;
}

export function LiveFeedWidget({ articles, maxItems = 5 }: LiveFeedWidgetProps) {
  const liveArticles = articles.slice(0, maxItems);
  
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Live Feed
        </h3>
        <Link 
          to="/live-updates" 
          className="text-primary hover:underline text-sm flex items-center gap-1"
        >
          View All
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {liveArticles.map((article, index) => (
          <div key={article.id} className="flex gap-3 p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0">
              {article.imageUrl && (
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <Link to={`/article/${article.slug || article.id}`} className="hover:text-primary transition-colors">
                    <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                      {article.title}
                    </h4>
                  </Link>
                  {article.isBreaking && (
                    <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium ml-2">
                      BREAKING
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <time className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(article.publishedAt).toLocaleTimeString()}
                  </time>
                  <span>·</span>
                  <span>{article.niche}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
