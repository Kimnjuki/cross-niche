import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Eye, MessageCircle, Bookmark, TrendingUp, Shield, Gamepad2, Cpu, AlertTriangle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    author: {
      name: string;
      avatar?: string;
    };
    publishedAt: string;
    readTime: number;
    category: string;
    niche: 'tech' | 'security' | 'gaming' | 'ai';
    imageUrl: string;
    viewCount?: number;
    commentCount?: number;
    featured?: boolean;
    trending?: boolean;
    breaking?: boolean;
  };
  variant?: 'vertical' | 'horizontal' | 'minimal' | 'hero';
  className?: string;
}

const categoryConfig = {
  tech: {
    icon: Cpu,
    color: 'text-tech-green',
    bgColor: 'bg-tech-green/10',
    borderColor: 'border-tech-green/20'
  },
  security: {
    icon: Shield,
    color: 'text-security-red',
    bgColor: 'bg-security-red/10',
    borderColor: 'border-security-red/20'
  },
  gaming: {
    icon: Gamepad2,
    color: 'text-gaming-purple',
    bgColor: 'bg-gaming-purple/10',
    borderColor: 'border-gaming-purple/20'
  },
  ai: {
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  }
};

export function ArticleCard({ article, variant = 'vertical', className }: ArticleCardProps) {
  const config = categoryConfig[article.niche];
  const Icon = config.icon;
  
  const isHorizontal = variant === 'horizontal';
  const isMinimal = variant === 'minimal';
  const isHero = variant === 'hero';
  
  return (
    <GlassCard
      hover
      className={cn(
        'group cursor-pointer overflow-hidden',
        isHorizontal && 'flex gap-6 p-6',
        isMinimal && 'p-4',
        isHero && 'relative h-96',
        !isHorizontal && !isMinimal && !isHero && 'p-6',
        className
      )}
    >
      <Link to={`/article/${article.slug}`} className="block w-full h-full">
        {/* Breaking News Banner */}
        {article.breaking && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-security-red text-white rounded-full text-sm font-semibold animate-pulse-glow">
            <AlertTriangle className="w-4 h-4" />
            BREAKING
          </div>
        )}
        
        {/* Trending Badge */}
        {article.trending && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 bg-news-orange text-white rounded-full text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            Trending
          </div>
        )}
        
        <div className={cn(
          'relative overflow-hidden',
          isHorizontal ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48 mb-4',
          isMinimal && 'w-16 h-16 mb-3',
          isHero && 'w-full h-full'
        )}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Category Badge */}
          <div className={cn(
            'absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold',
            config.bgColor,
            config.color,
            config.borderColor,
            'border backdrop-blur-sm'
          )}>
            <Icon className="w-3 h-3" />
            {article.category}
          </div>
        </div>
        
        <div className={cn(
          'flex-1',
          isMinimal && 'flex items-center justify-between'
        )}>
          {/* Title */}
          <h3 className={cn(
            'font-bold text-text-primary group-hover:text-nexus-cyan transition-colors duration-200 line-clamp-2',
            isHero && 'text-3xl mb-4',
            !isMinimal && !isHero && 'text-lg mb-2',
            isMinimal && 'text-sm'
          )}>
            {article.title}
          </h3>
          
          {/* Excerpt */}
          {!isMinimal && (
            <p className={cn(
              'text-text-secondary line-clamp-3 mb-4',
              isHero && 'text-lg line-clamp-4',
              !isHero && 'text-sm'
            )}>
              {article.excerpt}
            </p>
          )}
          
          {/* Metadata */}
          <div className={cn(
            'flex items-center justify-between text-xs text-text-tertiary',
            isMinimal && 'text-xs',
            !isMinimal && 'text-sm'
          )}>
            <div className="flex items-center gap-4">
              {/* Author */}
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <User className="w-3 h-3" />
                <span>{article.author.name}</span>
              </div>
              
              {/* Read Time */}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime} min</span>
              </div>
            </div>
            
            {/* Engagement Metrics */}
            {!isMinimal && (
              <div className="flex items-center gap-3">
                {article.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{article.viewCount}</span>
                  </div>
                )}
                
                {article.commentCount && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{article.commentCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        {!isMinimal && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle bookmark
              }}
              className="p-2 rounded-lg glass-subtle hover:glass transition-all duration-200"
            >
              <Bookmark className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        )}
      </Link>
    </GlassCard>
  );
}
