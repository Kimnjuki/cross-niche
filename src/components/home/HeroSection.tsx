import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { LiveThreatFeed } from './LiveThreatFeed';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  featuredArticle: Article;
}

export function HeroSection({ featuredArticle }: HeroSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload background images
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    img1.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
    img2.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop';
    img1.onload = () => setImageLoaded(true);
    img2.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px]">
      {/* Background Image/Video Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            backgroundImage: `
              url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'),
              url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')
            `,
            backgroundBlendMode: 'overlay',
            backgroundPosition: 'center, center',
          }}
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/20 via-destructive/20 to-gaming/20 transition-opacity duration-1000",
            imageLoaded ? "opacity-0" : "opacity-100"
          )} />
          <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-background/95 to-background/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        </div>
        
        {/* Animated Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-15">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0 gradient-hero opacity-5" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-4 bg-gradient-to-r from-tech via-security to-gaming bg-clip-text text-transparent drop-shadow-lg">
            Tech • Security • Gaming
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mb-8 font-medium drop-shadow-sm">
            Your trusted source for breaking news, in-depth analysis, and expert guides across technology, cybersecurity, and gaming.
          </p>
          <div className="relative z-20">
            <NewsletterForm variant="hero" />
          </div>
        </div>

        {/* Split-Pane Layout: Featured Story + Live Threat Feed */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Left Side: Primary Featured Story */}
          <div className="space-y-4">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>

          {/* Right Side: Live Threat Feed */}
          <div className="space-y-4">
            <LiveThreatFeed />
          </div>
        </div>
      </div>
    </section>
  );
}

