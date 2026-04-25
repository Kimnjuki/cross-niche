import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  title?: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  title,
  subtitle,
  eyebrow,
  ctaLabel,
  ctaHref,
  onCtaClick,
  children,
  className
}: SectionWrapperProps) {
  return (
    <section className={cn('py-16', className)}>
      <div className="container-tokens">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            {eyebrow && (
              <p className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--accent-cyan)] text-xs mb-2">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-[var(--font-heading)] text-[clamp(1.375rem,2.5vw,1.875rem)] text-[var(--text-primary)] leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {ctaLabel && (
            <Button
              variant="ghost"
              onClick={onCtaClick}
              className="flex-shrink-0"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}