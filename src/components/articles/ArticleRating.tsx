import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleRatingProps {
  score: number; // 1-10 scale
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getRatingColor = (score: number): string => {
  if (score >= 9) return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
  if (score >= 7) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
  if (score >= 5) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
  if (score >= 3) return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
  return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
};

const getRatingLabel = (score: number): string => {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Very Good';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Average';
  if (score >= 4) return 'Below Average';
  if (score >= 3) return 'Poor';
  return 'Very Poor';
};

export function ArticleRating({ score, showLabel = true, size = 'md', className }: ArticleRatingProps) {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));
  const filledStars = Math.floor(normalizedScore / 2); // Convert 1-10 to 0-5 stars
  const hasHalfStar = (normalizedScore % 2) === 1;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge className={cn(getRatingColor(normalizedScore), 'gap-1 font-semibold', sizeClasses[size])}>
        <Star className={cn('h-3 w-3 fill-current', size === 'lg' && 'h-4 w-4')} />
        {normalizedScore}/10
      </Badge>
      {showLabel && (
        <span className={cn('text-muted-foreground', sizeClasses[size])}>
          {getRatingLabel(normalizedScore)}
        </span>
      )}
    </div>
  );
}

