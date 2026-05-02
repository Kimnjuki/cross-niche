import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Clock, Eye } from 'lucide-react';
import { mockArticles } from '@/data/mockData';
import type { Article } from '@/types';

interface NextArticleProps {
  /** Current article slug to exclude */
  currentSlug: string;
  /** Niche to pull from (gaming, security, tech) */
  niche: string;
}

/**
 * "Next Article" component for the Article page bottom.
 * Shows the next article in the same niche, with an auto-scroll
 * into view on mount to drive session depth.
 */
export function NextArticle({ currentSlug, niche }: NextArticleProps) {
  const next = useMemo(() => {
    const sameNiche = mockArticles
      .filter(a => a.niche === niche && a.slug !== currentSlug)
      .slice(0, 1);
    return sameNiche.length > 0 ? sameNiche[0] : null;
  }, [currentSlug, niche]);

  // Get the niche prefix path
  const nichePath = niche === 'security' ? '/security' : niche === 'gaming' ? '/gaming' : '/tech';

  if (!next) return null;

  return (
    <section className="border-t border-border pt-8 pb-4 mt-8" aria-label="Next article">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
          Keep reading
        </p>
        <Link
          to={`${nichePath}/${next.slug}`}
          className="group inline-flex items-center gap-3 text-xl font-display font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="group-hover:underline decoration-primary/30 underline-offset-4">
            {next.title}
          </span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        {next.excerpt && (
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto line-clamp-1">
            {next.excerpt}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {next.readingTime} min
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {next.views || 0} views
          </span>
        </div>
      </div>
    </section>
  );
}
