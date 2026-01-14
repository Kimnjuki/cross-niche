import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import { Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RotatingHeroSectionProps {
  articles: Article[];
  autoRotateInterval?: number; // in milliseconds, default 5000ms
}

const nicheStyles = {
  tech: { 
    badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    label: 'Innovate'
  },
  security: { 
    badge: 'bg-red-500/10 text-red-500 border-red-500/20',
    label: 'Secured'
  },
  gaming: { 
    badge: 'bg-green-500/10 text-green-500 border-green-500/20',
    label: 'Play'
  },
};

export function RotatingHeroSection({ 
  articles, 
  autoRotateInterval = 8000 
}: RotatingHeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Filter to only show articles that exist
  const validArticles = articles.filter(a => a && a.id);

  // Auto-rotate functionality
  useEffect(() => {
    if (validArticles.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validArticles.length);
      setDirection('forward');
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [validArticles.length, autoRotateInterval, isPaused]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + validArticles.length) % validArticles.length);
    setDirection('backward');
    setIsPaused(true);
    // Resume after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validArticles.length);
    setDirection('forward');
    setIsPaused(true);
    // Resume after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleGoToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  if (validArticles.length === 0) {
    return null;
  }

  const currentArticle = validArticles[currentIndex];

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-4 bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent">
            2026 Tech & Gaming Series
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Comprehensive insights into the latest technology, cybersecurity, and gaming innovations
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{currentIndex + 1} of {validArticles.length}</span>
            <span>•</span>
            <span>Auto-rotating every {autoRotateInterval / 1000}s</span>
          </div>
        </div>

        {/* Main Article Display */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Article Cards Container */}
            <div className="relative overflow-hidden rounded-2xl bg-card border shadow-2xl">
              {/* Article Content */}
              <div 
                key={currentArticle.id}
                className={cn(
                  "transition-all duration-700 ease-in-out",
                  direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                )}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative aspect-video md:aspect-auto md:h-[500px] overflow-hidden">
                    <LazyImage
                      src={currentArticle.imageUrl}
                      alt={currentArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={nicheStyles[currentArticle.niche].badge}>
                        {nicheStyles[currentArticle.niche].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-12 flex flex-col justify-center bg-card">
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-4">
                        Featured Article
                      </Badge>
                      <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 leading-tight">
                        {currentArticle.title}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                        {currentArticle.excerpt}
                      </p>
                    </div>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="font-medium text-foreground">{currentArticle.author}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{currentArticle.readTime} min read</span>
                      </div>
                      <span>•</span>
                      <span>
                        {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Tags */}
                    {currentArticle.tags && currentArticle.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {currentArticle.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button asChild size="lg" className="w-full md:w-auto">
                      <Link to={`/article/${currentArticle.id}`}>
                        Read Full Article →
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Play/Pause Button */}
            <div className="absolute bottom-4 right-4 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Article Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {validArticles.map((article, index) => (
              <button
                key={article.id}
                onClick={() => handleGoToIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>

          {/* Article Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {validArticles.map((article, index) => (
              <button
                key={article.id}
                onClick={() => handleGoToIndex(index)}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300",
                  index === currentIndex
                    ? "border-primary shadow-lg scale-105"
                    : "border-transparent hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
                )}
              >
                <LazyImage
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-medium text-white line-clamp-2 drop-shadow-lg">
                    {article.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-in-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-in-out;
        }
      `}</style>
    </section>
  );
}


