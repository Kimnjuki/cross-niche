import { MessageSquare, Eye, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleStatsProps {
  viewCount?: number;
  commentCount?: number;
  readTime?: number;
  isTrending?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function ArticleStats({
  viewCount,
  commentCount,
  readTime,
  isTrending = false,
  className,
  size = 'md',
}: ArticleStatsProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={cn('flex items-center gap-4 text-muted-foreground', sizeClasses[size], className)}>
      {isTrending && (
        <div className="flex items-center gap-1 text-orange-500">
          <TrendingUp className={iconSize} />
          <span className="font-medium">Trending</span>
        </div>
      )}
      
      {viewCount !== undefined && (
        <div className="flex items-center gap-1">
          <Eye className={iconSize} />
          <span>{formatNumber(viewCount)}</span>
        </div>
      )}
      
      {commentCount !== undefined && (
        <div className="flex items-center gap-1">
          <MessageSquare className={iconSize} />
          <span>{commentCount}</span>
        </div>
      )}
      
      {readTime !== undefined && (
        <div className="flex items-center gap-1">
          <Clock className={iconSize} />
          <span>{readTime} min</span>
        </div>
      )}
    </div>
  );
}

