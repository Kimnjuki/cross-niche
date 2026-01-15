import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ShoppingCart,
  Award,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/lazy-image';
import type { ProductReview } from '@/types';

interface ProductReviewCardProps {
  review: ProductReview;
  variant?: 'featured' | 'compact' | 'full';
  showActions?: boolean;
  className?: string;
}

export function ProductReviewCard({
  review,
  variant = 'compact',
  showActions = true,
  className
}: ProductReviewCardProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const overallScore = review.scores.overall;
  const scoreColor = overallScore >= 8 ? 'text-green-600' : overallScore >= 6 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = overallScore >= 8 ? 'bg-green-50 dark:bg-green-950/20' : overallScore >= 6 ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-red-50 dark:bg-red-950/20';

  const handleVote = (vote: 'up' | 'down') => {
    setUserVote(vote === userVote ? null : vote);
    // In real implementation, this would update the backend
  };

  if (variant === 'featured') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative">
            <LazyImage
              src={review.images[0]}
              alt={review.productName}
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <div className={cn('px-3 py-1 rounded-full text-sm font-bold', scoreBg, scoreColor)}>
                {overallScore}/10
              </div>
            </div>
            {review.verdict === 'recommended' && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-600 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-2">{review.category}</Badge>
                <h3 className="text-xl font-bold mb-2">{review.productName}</h3>
                <p className="text-muted-foreground mb-4">{review.tagline}</p>
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {review.keySpecs.slice(0, 4).map((spec, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{spec.label}:</span>
                  <span className="text-muted-foreground ml-1">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Performance</span>
                <span>{review.scores.performance}/10</span>
              </div>
              <Progress value={review.scores.performance * 10} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>Value</span>
                <span>{review.scores.value}/10</span>
              </div>
              <Progress value={review.scores.value * 10} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>Design</span>
                <span>{review.scores.design}/10</span>
              </div>
              <Progress value={review.scores.design * 10} className="h-2" />
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                <ul className="text-sm space-y-1">
                  {review.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                <ul className="text-sm space-y-1">
                  {review.cons.slice(0, 3).map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex gap-2">
                <Button className="flex-1">
                  Read Full Review
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'full') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <LazyImage
                src={review.images[0]}
                alt={review.productName}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <CardTitle className="text-xl">{review.productName}</CardTitle>
                <p className="text-muted-foreground">{review.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={cn('text-3xl font-bold', scoreColor)}>
                {overallScore}/10
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{review.reviewerCount} reviews</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Detailed Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.entries(review.scores) as [string, number][]).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold">{value}/10</div>
                <div className="text-sm text-muted-foreground capitalize">{key}</div>
                <Progress value={value * 10} className="mt-2 h-1" />
              </div>
            ))}
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Pros
              </h4>
              <ul className="space-y-2">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <ThumbsDown className="h-4 w-4" />
                Cons
              </h4>
              <ul className="space-y-2">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Specs */}
          <div>
            <h4 className="font-semibold mb-3">Key Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {review.keySpecs.map((spec, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="font-medium text-sm">{spec.label}</div>
                  <div className="text-muted-foreground">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={review.reviewer.avatar} />
                <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{review.reviewer.name}</div>
                <div className="text-muted-foreground">{new Date(review.publishDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={userVote === 'up' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {review.helpful.upvotes}
              </Button>
              <Button
                variant={userVote === 'down' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {review.helpful.downvotes}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant (default)
  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <LazyImage
              src={review.images[0]}
              alt={review.productName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <CardTitle className="text-lg leading-tight">{review.productName}</CardTitle>
              <p className="text-sm text-muted-foreground">{review.category}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-xl font-bold', scoreColor)}>
              {overallScore}/10
            </div>
            {review.verdict === 'recommended' && (
              <Badge variant="secondary" className="text-xs mt-1">
                <Award className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {review.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{review.reviewer.name}</span>
          <span>{new Date(review.publishDate).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Read Review
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}