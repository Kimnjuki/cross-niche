import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { ThreatAlertSidebar, type ThreatAlert } from '@/components/threats/ThreatAlertSidebar';
import { useThreatAlerts } from '@/hooks/useThreatAlerts';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  featuredArticle: Article;
}

export function HeroSection({ featuredArticle }: HeroSectionProps) {
  const { data: threatAlerts = [] } = useThreatAlerts(5);
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
        {/* Background Image - Tech/Security/Gaming Theme */}
        {/* Using tech-focused images: circuit boards, code, digital elements */}
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
          {/* Fallback gradient while images load */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/20 via-destructive/20 to-gaming/20 transition-opacity duration-1000",
            imageLoaded ? "opacity-0" : "opacity-100"
          )} />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-background/95 to-background/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        </div>
        
        {/* Animated Grid Pattern Overlay - Tech Theme */}
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
        
        {/* Hexagonal Pattern Overlay - Security Theme */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1) rotate(0)">
                <polygon points="24.8,22 37.3,14.2 37.3,7.1 24.8,0 12.3,7.1 12.3,14.2" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
        
        {/* Animated Particles Effect - Gaming Theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const colors = [
              'rgba(14, 165, 233, 0.4)',   // Tech blue
              'rgba(239, 68, 68, 0.4)',     // Security red
              'rgba(34, 197, 94, 0.4)',     // Gaming green
            ];
            return (
              <div
                key={i}
                className="absolute rounded-full blur-sm"
                style={{
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: colors[i % 3],
                  boxShadow: `0 0 ${Math.random() * 10 + 5}px ${colors[i % 3]}`,
                  animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            );
          })}
        </div>
        
        {/* Subtle Scanline Effect */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(14, 165, 233, 0.1) 2px, rgba(14, 165, 233, 0.1) 4px)',
          }}
        />
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0 gradient-hero opacity-5" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
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

        {/* Split-Pane Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Featured Story */}
          <div className="lg:col-span-1">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>

          {/* Right: Live Threat Feed */}
          <div className="lg:col-span-1">
            <div className="h-full flex flex-col">
              {/* Threat Feed Header */}
              <div className="mb-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h2 className="font-display font-bold text-xl">Live Threat Feed</h2>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs text-muted-foreground">LIVE</span>
                  </span>
                </div>
              </div>

              {/* Scrolling Ticker */}
              {threatAlerts.length > 0 && (
                <div className="mb-4 overflow-hidden bg-surface-elevated rounded-lg p-3 border border-border relative">
                  <div className="flex animate-ticker-scroll whitespace-nowrap">
                    {/* First set */}
                    {threatAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center gap-4 mr-8 flex-shrink-0">
                        <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded',
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        )}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-foreground">{alert.title}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                      </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {threatAlerts.map((alert) => (
                      <div key={`dup-${alert.id}`} className="flex items-center gap-4 mr-8 flex-shrink-0">
                        <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded',
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        )}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-foreground">{alert.title}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threat Alert Sidebar */}
              <div className="flex-1">
                <ThreatAlertSidebar alerts={threatAlerts} maxAlerts={4} className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
