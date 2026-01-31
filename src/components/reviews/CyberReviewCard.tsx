/**
 * Grid Nexus 2026 – CyberReviewCard
 * Modular card: category border (Security/Tech/Gaming), Nexus Score gauge top-right,
 * on-hover overlay with technical specs (JetBrains Mono). overflow-hidden for image zoom.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';
import type { ProductReview } from '@/types';

export type CyberCategory = 'Security' | 'Tech' | 'Gaming';

const categoryStyles: Record<
  CyberCategory,
  { border: string; glow: string; badge: string }
> = {
  Security: {
    border: 'border-[var(--nexus-accent-security)]',
    glow: 'nexus-glow-security',
    badge: 'bg-[var(--nexus-accent-security)]/20 text-[var(--nexus-accent-security)] border-[var(--nexus-accent-security)]/50',
  },
  Tech: {
    border: 'border-[var(--nexus-accent-tech)]',
    glow: 'nexus-glow-tech',
    badge: 'bg-[var(--nexus-accent-tech)]/20 text-[var(--nexus-accent-tech)] border-[var(--nexus-accent-tech)]/50',
  },
  Gaming: {
    border: 'border-[var(--nexus-accent-gaming)]',
    glow: 'nexus-glow-gaming',
    badge: 'bg-[var(--nexus-accent-gaming)]/20 text-[var(--nexus-accent-gaming)] border-[var(--nexus-accent-gaming)]/50',
  },
};

interface CyberReviewCardProps {
  review: ProductReview;
  /** Override category for border/glow (default: derived from review.category or Tech) */
  category?: CyberCategory;
  /** Nexus Score 0–100 for gauge (default: overall * 10) */
  nexusScore?: number;
  /** Link target (e.g. /reviews/:id) */
  to?: string;
  className?: string;
}

function deriveCategory(review: ProductReview): CyberCategory {
  const c = (review.category || '').toLowerCase();
  if (c.includes('security') || c.includes('vpn') || c.includes('antivirus')) return 'Security';
  if (c.includes('gaming') || c.includes('gpu') || c.includes('game')) return 'Gaming';
  return 'Tech';
}

export function CyberReviewCard({
  review,
  category: categoryProp,
  nexusScore: nexusScoreProp,
  to = '/reviews',
  className,
}: CyberReviewCardProps) {
  const [hover, setHover] = useState(false);
  const category = categoryProp ?? deriveCategory(review);
  const styles = categoryStyles[category];
  const nexusScore = nexusScoreProp ?? Math.round(review.scores.overall * 10);
  const specs = review.keySpecs ?? [];

  const content = (
    <motion.article
      className={cn(
        'relative rounded-xl overflow-hidden border-2 bg-card',
        styles.border,
        styles.glow,
        'transition-shadow duration-300',
        className
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={false}
    >
      {/* Image with inner zoom – clipped by overflow-hidden */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <LazyImage
          src={review.images[0]}
          alt={review.productName}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500',
            hover && 'scale-110'
          )}
          width={400}
          height={300}
        />
        {/* Nexus Score gauge – top right */}
        <div className="absolute top-3 right-3 flex flex-col items-center">
          <NexusScoreGauge value={nexusScore} category={category} />
          <span className="text-[10px] font-medium text-white/90 mt-0.5 drop-shadow-md">Nexus</span>
        </div>
        <Badge className={cn('absolute top-3 left-3', styles.badge)} variant="outline">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-lg line-clamp-2 text-foreground">
          {review.productName}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{review.tagline}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="font-mono text-sm font-semibold text-foreground">
            {review.scores.overall}/10
          </span>
          <span className="text-xs text-muted-foreground">· {review.verdict}</span>
        </div>
      </div>

      {/* On-hover overlay – technical specs (JetBrains Mono) */}
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col justify-end p-4 pointer-events-none"
        initial={false}
        animate={{
          opacity: hover ? 1 : 0,
          visibility: hover ? 'visible' : 'hidden',
        }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wider">
          Technical specs
        </p>
        <ul className="space-y-1 font-mono text-xs text-white/80" style={{ fontFamily: 'var(--nexus-font-data)' }}>
          {specs.slice(0, 6).map((s) => (
            <li key={s.label}>
              <span className="text-white/60">{s.label}:</span> {s.value}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.article>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

function NexusScoreGauge({ value, category }: { value: number; category: CyberCategory }) {
  const circumference = 2 * Math.PI * 18;
  const stroke = (value / 100) * circumference;
  const color =
    category === 'Security'
      ? 'var(--nexus-accent-security)'
      : category === 'Tech'
        ? 'var(--nexus-accent-tech)'
        : 'var(--nexus-accent-gaming)';

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40" className="absolute inset-0 rotate-[-90deg]">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="rgba(0,0,0,0.5)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - stroke}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="relative text-[10px] font-bold text-white drop-shadow-md font-mono"
        style={{ fontFamily: 'var(--nexus-font-data)' }}
      >
        {value}
      </span>
    </div>
  );
}
