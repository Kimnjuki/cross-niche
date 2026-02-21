import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Gamepad2,
  Video,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/lazy-image';
import type { GameReview } from '@/types';

interface GameReviewWithTrailersProps {
  review: GameReview;
  className?: string;
}

/**
 * IGN-style game review with trailers component
 * Features: Video trailers, detailed scoring, user ratings, platform info
 */
export function GameReviewWithTrailers({ review, className }: GameReviewWithTrailersProps) {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const overallScore = review.scores.overall;
  const scoreColor = overallScore >= 8 ? 'text-green-500' : overallScore >= 6 ? 'text-yellow-500' : 'text-red-500';

  const verdictConfig = {
    'must-play': { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Must Play' },
    'recommended': { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Recommended' },
    'mixed': { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Mixed' },
    'avoid': { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Avoid' }
  };

  const verdict = verdictConfig[review.verdict];

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero Section with Trailer */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
          {review.videos.length > 0 ? (
            <>
              <iframe
                src={review.videos[selectedVideo].url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {review.videos.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.videos.map((video, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVideo(idx)}
                        className={cn(
                          'relative w-32 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0',
                          selectedVideo === idx ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        )}
                      >
                        <LazyImage
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/60 px-1 rounded truncate">
                          {video.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : review.images.length > 0 ? (
            <LazyImage
              src={review.images[selectedImage]}
              alt={review.gameTitle}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {review.genre.map((g, idx) => (
                  <Badge key={idx} variant="outline">{g}</Badge>
                ))}
                <Badge className={verdict.bg + ' ' + verdict.color}>
                  {verdict.label}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold mb-2">{review.gameTitle}</CardTitle>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{review.developer}</span>
                <span>•</span>
                <span>{review.publisher}</span>
                <span>•</span>
                <span>{new Date(review.releaseDate).getFullYear()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={cn('text-5xl font-bold mb-1', scoreColor)}>
                {overallScore}
              </div>
              <div className="text-sm text-muted-foreground">Review Score</div>
              {review.userScore && (
                <div className="mt-2 text-sm">
                  <div className="font-semibold">User Score</div>
                  <div className="text-lg">{review.userScore.toFixed(1)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-2">
            {review.platforms.map((platform, idx) => (
              <Badge key={idx} variant="secondary">{platform}</Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Review Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(review.scores).map(([key, value]) => {
            if (key === 'overall') return null;
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <span className="text-sm font-bold">{value}/10</span>
                </div>
                <Progress value={value * 10} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Review Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-6">{review.summary}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-semibold text-green-500 mb-2">Pros</div>
              <ul className="space-y-1">
                {review.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-red-500 mb-2">Cons</div>
              <ul className="space-y-1">
                {review.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screenshots Gallery */}
      {review.images.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Screenshots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {review.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    'relative aspect-video rounded-lg overflow-hidden border-2 transition-all',
                    selectedImage === idx ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <LazyImage
                    src={img}
                    alt={`${review.gameTitle} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Videos */}
      {review.videos.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Videos & Trailers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {review.videos.map((video, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                    <iframe
                      src={video.url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{video.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviewer Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={review.reviewer.avatar} />
              <AvatarFallback>{review.reviewer.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-lg">{review.reviewer.name}</div>
              <div className="text-sm text-muted-foreground">
                {review.reviewer.reviewCount} reviews • {review.reviewer.credibility}% credibility
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{overallScore}/10</div>
              <div className="flex gap-1 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.round(overallScore / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Scores */}
      {(review.metacriticScore || review.steamScore) && (
        <Card>
          <CardHeader>
            <CardTitle>Other Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {review.metacriticScore && (
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Metacritic</div>
                  <div className="text-2xl font-bold">{review.metacriticScore}</div>
                </div>
              )}
              {review.steamScore && (
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Steam</div>
                  <div className="text-2xl font-bold">{review.steamScore}%</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

