import React from 'react';
import { cn } from '@/lib/utils';

type Niche = 'tech' | 'security' | 'gaming' | 'ai' | 'breaking' | 'trending' | 'featured' | string;

interface NicheTagBadgeProps {
  niche: Niche;
  className?: string;
  pulse?: boolean;
}

const NICHE_CLASSES: Record<string, string> = {
  tech:     'niche-tag-tech',
  security: 'niche-tag-security',
  gaming:   'niche-tag-gaming',
  ai:       'niche-tag-ai',
  amber:    'niche-tag-amber',
  breaking: 'bg-[#FF007A] text-white border-[#FF007A]',
  trending: 'bg-[#FFB800] text-black border-[#FFB800]',
  featured: 'bg-[#00F0FF] text-black border-[#00F0FF]',
};

const LABEL: Record<string, string> = {
  tech:     'Tech',
  security: 'Security',
  gaming:   'Gaming',
  ai:       'AI',
  breaking: 'Breaking',
  trending: 'Trending',
  featured: 'Featured',
};

export function NicheTagBadge({ niche, className, pulse }: NicheTagBadgeProps) {
  const key = niche.toLowerCase();
  const cls = NICHE_CLASSES[key] ?? 'niche-tag-tech';
  const label = LABEL[key] ?? niche;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5',
        cls,
        className,
      )}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {label}
    </span>
  );
}
