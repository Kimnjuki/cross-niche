/**
 * Grid Nexus 2026 – NexusScrollBridge (ContextualScrollLogic)
 * HOC: when user reaches bottom 20% of a category article, slide in a cross-section
 * recommendation linking current topic to another pillar (e.g. Gaming → Security).
 */

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';
import type { Article, Niche } from '@/types';

const PILLAR_LABELS: Record<Niche, string> = {
  tech: 'Tech',
  security: 'Security',
  gaming: 'Gaming',
};

const PILLAR_LINKS: Record<Niche, string> = {
  tech: '/tech',
  security: '/security',
  gaming: '/gaming',
};

const CROSS_PILLAR: Record<Niche, Niche[]> = {
  tech: ['security', 'gaming'],
  security: ['tech', 'gaming'],
  gaming: ['security', 'tech'],
};

interface CrossSectionRecommendationProps {
  currentNiche: Niche;
  recommended: Article;
  onDismiss?: () => void;
}

function CrossSectionRecommendation({
  currentNiche,
  recommended,
  onDismiss,
}: CrossSectionRecommendationProps) {
  const recId = recommended?._id ?? recommended?.id ?? recommended?.slug;
  if (!recommended || !recId) return null;
  const targetNiche = recommended?.niche ?? 'tech';
  const label = PILLAR_LABELS[targetNiche];
  const href = `/article/${recommended?.slug ?? recommended?.id ?? recId}`;

  return (
    <motion.div
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden shadow-lg',
        'flex flex-col sm:flex-row gap-4 p-4'
      )}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sm:w-32 shrink-0 rounded-lg overflow-hidden bg-muted aspect-video sm:aspect-square">
        <LazyImage
          src={recommended?.imageUrl ?? '/placeholder.svg'}
          alt={recommended?.title ?? 'Article'}
          className="w-full h-full object-cover"
          width={128}
          height={128}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Cross-section · From {PILLAR_LABELS[currentNiche]} to {label}
        </p>
        <Link to={href} className="font-display font-bold text-lg line-clamp-2 text-foreground hover:text-primary hover:underline">
          {recommended?.title ?? 'Untitled'}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{recommended?.excerpt ?? ''}</p>
        <div className="flex items-center gap-3 mt-3">
          <Link
            to={href}
            className="text-sm font-medium text-primary hover:underline"
          >
            Read in {label} →
          </Link>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface NexusScrollBridgeProps {
  children: ReactNode;
  /** Current article/category niche */
  currentNiche: Niche;
  /** Cross-section recommendation (article from another pillar) */
  crossSectionArticle: Article | null;
  /** Optional class for the wrapper */
  className?: string;
}

/**
 * Wraps content and shows a cross-section recommendation when the user
 * scrolls into the bottom 20% of the content (via Intersection Observer).
 */
export function NexusScrollBridge({
  children,
  currentNiche,
  crossSectionArticle,
  className,
}: NexusScrollBridgeProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const inView = useInView(sentinelRef, {
    amount: 0.2,
    once: false,
    margin: '0px 0px -20% 0px', // trigger when bottom 20% of viewport is in view
  });

  useEffect(() => {
    if (inView && crossSectionArticle && crossSectionArticle?.niche !== currentNiche && !dismissed) {
      setShowRecommendation(true);
    }
  }, [inView, crossSectionArticle, currentNiche, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowRecommendation(false);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {children}

      {/* Sentinel: when this enters bottom 20% of viewport, show recommendation */}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden />

      <AnimatePresence>
        {showRecommendation && crossSectionArticle && (
          <CrossSectionRecommendation
            currentNiche={currentNiche}
            recommended={crossSectionArticle}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export { CROSS_PILLAR, PILLAR_LABELS, PILLAR_LINKS };
