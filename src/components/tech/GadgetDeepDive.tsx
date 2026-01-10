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
  Image as ImageIcon,
  Video,
  ExternalLink,
  ShoppingCart,
  Award,
  TrendingUp,
  Camera,
  Maximize2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/lazy-image';
import type { ProductReview } from '@/types';

interface GadgetDeepDiveProps {
  review: ProductReview;
  className?: string;
}

/**
 * The Verge-style multimedia gadget deep dive component
 * Features: Image galleries, video embeds, interactive specs, detailed analysis
 */
export function GadgetDeepDive({ review, className }: GadgetDeepDiveProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const overallScore = review.scores.overall;
  const scoreColor = overallScore >= 8 ? 'text-green-500' : overallScore >= 6 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero Section with Image Gallery */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
          {review.images.length > 0 && (
            <>
              <LazyImage
                src={review.images[selectedImage]}
                alt={review.productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image Gallery Thumbnails */}
              {review.images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={cn(
                          'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0',
                          selectedImage === idx ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        )}
                      >
                        <LazyImage
                          src={img}
                          alt={`${review.productName} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Expand Button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setIsGalleryOpen(true)}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                View Gallery
              </Button>
            </>
          )}
        </div>

        <CardHeader className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{review.category}</Badge>
                <Badge variant="secondary">{review.brand}</Badge>
                {review.verdict === 'recommended' && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl font-bold mb-2">{review.productName}</CardTitle>
              <p className="text-muted-foreground text-lg">{review.tagline}</p>
            </div>
            <div className="text-right">
              <div className={cn('text-5xl font-bold mb-1', scoreColor)}>
                {overallScore}
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
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

      {/* Key Specs */}
      <Card>
        <CardHeader>
          <CardTitle>Key Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {review.keySpecs.map((spec, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{spec.label}</div>
                <div className="font-semibold">{spec.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pros & Cons */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-500">Pros</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500">Cons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

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
              <div className="flex gap-1">
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

      {/* Affiliate Links */}
      {review.affiliateLinks && review.affiliateLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Where to Buy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {review.affiliateLinks.map((link, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-between"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{link.retailer}</span>
                    </div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: review.currency,
                      }).format(link.price)}
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Screen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="max-w-7xl w-full">
            <LazyImage
              src={review.images[selectedImage]}
              alt={review.productName}
              className="w-full h-auto rounded-lg"
            />
            {review.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {review.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'relative w-24 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all',
                      selectedImage === idx ? 'border-primary scale-105' : 'border-transparent opacity-70'
                    )}
                  >
                    <LazyImage src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

