import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { LiveThreatFeed } from './LiveThreatFeed';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Brain, 
  Activity, 
  ChevronRight, 
  Zap,
  Cpu,
  Gamepad2,
  Lock
} from 'lucide-react';

interface HeroSectionProps {
  featuredArticle: Article;
}

export function HeroSection({ featuredArticle }: HeroSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Preload background images and handle scroll
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    img1.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';
    img2.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop';
    img1.onload = () => setImageLoaded(true);
    img2.onload = () => setImageLoaded(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryStats = [
    { name: 'Tech', icon: Cpu, count: 1234, color: 'text-tech-green', bgColor: 'bg-tech-green/10' },
    { name: 'Security', icon: Lock, count: 892, color: 'text-security-red', bgColor: 'bg-security-red/10' },
    { name: 'Gaming', icon: Gamepad2, count: 756, color: 'text-gaming-purple', bgColor: 'bg-gaming-purple/10' },
    { name: 'AI', icon: Brain, count: 445, color: 'text-blue-400', bgColor: 'bg-blue-400/10' }
  ];

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px]" style={{ contentVisibility: 'auto' }}>
      {/* Background Image/Video Layer */}
      <div className="absolute inset-0 z-0">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-nexus-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Elements */}
        <div 
          className="absolute top-20 left-10 glass-subtle p-4 rounded-xl transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <Shield className="h-8 w-8 text-security-red" />
        </div>
        <div 
          className="absolute top-40 right-20 glass-subtle p-4 rounded-xl transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <Gamepad2 className="h-8 w-8 text-gaming-purple" />
        </div>
        <div 
          className="absolute bottom-20 left-20 glass-subtle p-4 rounded-xl transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <Zap className="h-8 w-8 text-tech-green" />
        </div>

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
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-4 text-white animate-fade-in-up">
            The Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan to-blue-400 ml-2 md:ml-4">
              Tech Intelligence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Experience the intersection of technology, security, and gaming with AI-powered insights, 
            real-time updates, and interactive security tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/tools"
              className="group px-8 py-4 bg-gradient-to-r from-nexus-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-nexus-cyan/25 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 glass-medium"
            >
              <Shield className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Try Security Tools
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/live"
              className="group px-8 py-4 glass border border-white/20 text-white rounded-lg font-semibold hover:border-nexus-cyan transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <Activity className="w-5 h-5 transition-transform group-hover:scale-110" />
              View Live Updates
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats Grid with Glass Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {categoryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard 
                  key={index} 
                  className="text-center p-6 hover:scale-105 transition-all duration-300"
                  hover
                >
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3', stat.bgColor)}>
                    <Icon className={cn('w-8 h-8', stat.color)} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.count.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{stat.name} Articles</div>
                </GlassCard>
              );
            })}
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

      {/* Breaking News Ticker */}
      <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold text-sm">BREAKING</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll-left whitespace-nowrap">
                <span className="text-gray-300 text-sm">
                  Critical vulnerability discovered in popular software • AI breakthrough achieves human-level performance • Gaming industry sees record-breaking quarter • New cybersecurity threats emerge • Tech giants announce major innovations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-left {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

