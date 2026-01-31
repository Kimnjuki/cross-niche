import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  Play,
  ThumbsUp,
  ThumbsDown,
  Award,
  Calendar,
  Users,
  Gamepad2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/lazy-image';
import type { GameReview } from '@/types';

interface GameReviewCardProps {
  review: GameReview;
  variant?: 'featured' | 'compact' | 'detailed';
  showTrailer?: boolean;
  className?: string;
}

export function GameReviewCard({
  review,
  variant = 'compact',
  showTrailer = true,
  className
}: GameReviewCardProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [playingTrailer, setPlayingTrailer] = useState(false);

  const overallScore = review.scores.overall;
  const scoreColor = overallScore >= 9 ? 'text-green-600' : overallScore >= 7 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = overallScore >= 9 ? 'bg-green-50 dark:bg-green-950/20' : overallScore >= 7 ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-red-50 dark:bg-red-950/20';

  const verdictConfig = {
    'must-play': { label: 'Must Play', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-950/30' },
    recommended: { label: 'Recommended', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
    mixed: { label: 'Mixed', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-950/30' },
    avoid: { label: 'Avoid', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-950/30' }
  };

  const verdict = verdictConfig[review.verdict];

  const handleVote = (vote: 'up' | 'down') => {
    setUserVote(vote === userVote ? null : vote);
  };

  if (variant === 'featured') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <div className="relative">
          <LazyImage
            src={review.images[0]}
            alt={review.gameTitle}
            className="w-full h-64 object-cover"
          />

          {/* Overlay with score and verdict */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className={cn('text-6xl font-bold mb-2', scoreColor)}>
                {overallScore}/10
              </div>
              <Badge className={cn('text-lg px-4 py-2', verdict.bg, verdict.color)}>
                {verdict.label}
              </Badge>
            </div>
          </div>

          {/* Play trailer button */}
          {showTrailer && review.videos.length > 0 && (
            <Button
              size="lg"
              className="absolute bottom-4 right-4"
              onClick={() => setPlayingTrailer(true)}
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Trailer
            </Button>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{review.gameTitle}</h3>
              <p className="text-muted-foreground mb-2">{review.developer} • {review.publisher}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(review.releaseDate).toLocaleDateString()}</span>
                <span>•</span>
                <div className="flex gap-1">
                  {review.platforms.slice(0, 3).map(platform => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(review.scores).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-xl font-bold">{value}/10</div>
                <div className="text-sm text-muted-foreground capitalize">{key}</div>
                <Progress value={value * 10} className="mt-1 h-1" />
              </div>
            ))}
          </div>

          {/* Summary */}
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {review.summary}
          </p>

          {/* External scores */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            {review.metacriticScore && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Metacritic:</span>
                <span className="text-green-600 font-bold">{review.metacriticScore}</span>
              </div>
            )}
            {review.steamScore && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Steam:</span>
                <span className="text-blue-600 font-bold">{review.steamScore}%</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              Read Full Review
            </Button>
            <Button variant="outline">
              <Gamepad2 className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <LazyImage
              src={review.images[0]}
              alt={review.gameTitle}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-2xl">{review.gameTitle}</CardTitle>
                <div className="text-right">
                  <div className={cn('text-4xl font-bold', scoreColor)}>
                    {overallScore}/10
                  </div>
                  <Badge className={cn('mt-1', verdict.bg, verdict.color)}>
                    {verdict.label}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">
                {review.developer} • {review.publisher}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{new Date(review.releaseDate).toLocaleDateString()}</span>
                <div className="flex gap-1">
                  {review.platforms.map(platform => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Detailed Scores */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(review.scores).map(([key, value]) => (
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
              <h4 className="font-semibold text-green-600 mb-3">Pros</h4>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Cons</h4>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2">Review Summary</h4>
            <p className="text-muted-foreground">{review.summary}</p>
          </div>

          {/* Genres and User Score */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-2">Genres</h4>
              <div className="flex gap-1">
                {review.genre.map(g => (
                  <Badge key={g} variant="outline" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
            {review.userScore && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {review.userScore}/10
                </div>
                <div className="text-sm text-muted-foreground">
                  User Score ({review.userReviewCount?.toLocaleString()} reviews)
                </div>
              </div>
            )}
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
                <div className="text-muted-foreground">
                  {new Date(review.publishDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={userVote === 'up' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful
              </Button>
              <Button
                variant={userVote === 'down' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Not Helpful
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
              alt={review.gameTitle}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <CardTitle className="text-lg leading-tight">{review.gameTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">{review.developer}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-xl font-bold', scoreColor)}>
              {overallScore}/10
            </div>
            <Badge className={cn('text-xs mt-1', verdict.bg, verdict.color)}>
              {verdict.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {new Date(review.releaseDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-1 mb-3">
          {review.platforms.slice(0, 3).map(platform => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {review.summary}
        </p>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Read Review
          </Button>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}