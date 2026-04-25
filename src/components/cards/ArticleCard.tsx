import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tag } from '@/components/ui/badge';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    category: 'tech' | 'security' | 'gaming';
    coverImage: string;
    author: string;
    publishedAt: string;
    readingTimeMinutes: number;
    isBreaking?: boolean;
    isFeatured?: boolean;
  };
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function ArticleCard({ article, variant = 'default', className }: ArticleCardProps) {
  const categoryColors = {
    tech: 'var(--accent-cyan)',
    security: 'var(--accent-violet)',
    gaming: 'var(--accent-amber)'
  };

  if (variant === 'featured') {
    return (
      <Link
        to={`/${article.category}/${article.slug}`}
        className={cn(
          'group block bg-[var(--bg-surface)] border border-[var(--border-cyan)] rounded-[var(--radius-lg)] overflow-hidden transition-all duration-180ms ease-out',
          'hover:-translate-y-1 hover:shadow-[var(--shadow-glow-cyan)]',
          className
        )}
      >
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative aspect-[3/2] md:aspect-auto overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-280ms ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              {article.isBreaking ? (
                <Tag variant="breaking">BREAKING</Tag>
              ) : (
                <Tag variant="category-tech">FEATURED</Tag>
              )}
            </div>
          </div>
          <div className="p-6 flex flex-col">
            <Tag variant={`category-${article.category}`} className="mb-3 w-fit">
              {article.category.toUpperCase()}
            </Tag>
            <h3 className="font-[var(--font-heading)] font-semibold text-xl text-[var(--text-primary)] mb-3 leading-tight group-hover:text-[var(--accent-cyan)] transition-colors">
              {article.title}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="text-[var(--text-tertiary)] text-xs flex items-center gap-2">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.publishedAt}</span>
                <span>·</span>
                <Clock className="h-3 w-3" />
                <span>{article.readingTimeMinutes} min read</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] transition-all duration-180ms translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[var(--accent-cyan)]" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/${article.category}/${article.slug}`}
        className={cn(
          'group block bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-md)] overflow-hidden transition-all duration-180ms ease-out p-4',
          'hover:border-[var(--border-cyan)]',
          className
        )}
      >
        <div className="flex gap-4">
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Tag variant={`category-${article.category}`} className="mb-1 w-fit text-[10px]">
              {article.category.toUpperCase()}
            </Tag>
            <h4 className="font-[var(--font-heading)] font-semibold text-sm text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent-cyan)] transition-colors">
              {article.title}
            </h4>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/${article.category}/${article.slug}`}
      className={cn(
        'group block bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden transition-all duration-180ms ease-out',
        'hover:-translate-y-1 hover:border-[var(--border-cyan)] hover:shadow-[var(--shadow-glow-cyan)]',
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-280ms ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          {article.isBreaking ? (
            <Tag variant="breaking">BREAKING</Tag>
          ) : (
            <Tag variant={`category-${article.category}`}>
              {article.category.toUpperCase()}
            </Tag>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--text-primary)] mb-2 leading-tight group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-[var(--text-tertiary)] text-xs flex items-center gap-2">
            <span>{article.publishedAt}</span>
            <span>·</span>
            <Clock className="h-3 w-3" />
            <span>{article.readingTimeMinutes} min</span>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] transition-all duration-180ms translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[var(--accent-cyan)]" />
        </div>
      </div>
    </Link>
  );
}