import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  variant?: 'homepage' | 'category' | 'topic' | 'article' | 'generic';
  title?: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  ctas?: {
    label: string;
    variant: 'primary' | 'secondary' | 'ghost';
    onClick?: () => void;
    href?: string;
  }[];
  stats?: { value: string; label: string }[];
  coverImage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HeroSection({
  variant = 'generic',
  title,
  subtitle,
  eyebrow,
  ctas,
  stats,
  coverImage,
  children,
  className
}: HeroSectionProps) {
  if (variant === 'homepage') {
    return (
      <section
        className={cn(
          'relative min-h-[90vh] max-h-[680px] flex items-center justify-center overflow-hidden',
          className
        )}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-[var(--bg-base)]">
          <div className="absolute top-1/2 left-1/5 w-[600px] h-[600px] rounded-full bg-[var(--accent-cyan)] opacity-[0.06] blur-[100px] -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/5 right-1/5 w-[500px] h-[500px] rounded-full bg-[var(--accent-violet)] opacity-[0.05] blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] bg-repeat pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-[0.025] bg-repeat pointer-events-none" />
        </div>

        <div className="relative z-10 container-tokens max-w-4xl text-center px-4">
          {eyebrow && (
            <p className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--accent-cyan)] text-xs mb-4" style={{ animationDelay: '0ms' }}>
              {eyebrow}
            </p>
          )}

          <h1
            className="font-[var(--font-display)] mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
              lineHeight: '1.0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #F0F4FF 0%, #00E5FF 60%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animationDelay: '120ms'
            }}
          >
            {title || (
              <>
                Track the Grid.<br />
                Own the Signal.
              </>
            )}
          </h1>

          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mb-8" style={{ animationDelay: '240ms' }}>
            {subtitle || 'Exclusive tech, security & gaming intelligence for analysts and power users.'}
          </p>

          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-10" style={{ animationDelay: '360ms' }}>
              {ctas.map((cta, index) => (
                <Button
                  key={index}
                  variant={cta.variant}
                  size="lg"
                  onClick={cta.onClick}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto" style={{ animationDelay: '480ms' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-[var(--font-display)] text-2xl text-[var(--text-primary)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[var(--text-tertiary)] text-xs uppercase tracking-[0.08em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-indicator">
            <ChevronDown className="h-6 w-6 text-[var(--text-tertiary)]" />
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'category' || variant === 'topic') {
    return (
      <section
        className={cn(
          'relative py-20 overflow-hidden',
          variant === 'category' ? 'min-h-[320px]' : 'min-h-[280px]',
          className
        )}
      >
        <div className="absolute inset-0 bg-[var(--bg-base)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--accent-cyan)] opacity-[0.04] blur-[80px] pointer-events-none" />
        </div>

        <div className="relative z-10 container-tokens px-4">
          {eyebrow && (
            <p className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--accent-cyan)] text-xs mb-3">
              {eyebrow}
            </p>
          )}

          <h1 className="font-[var(--font-heading)] text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--text-primary)] mb-3">
            {title}
          </h1>

          <p className="text-[var(--text-secondary)] text-base max-w-[560px]">
            {subtitle}
          </p>
        </div>
      </section>
    );
  }

  if (variant === 'article') {
    return (
      <section className={cn('relative min-h-[480px] flex items-end overflow-hidden', className)}>
        {coverImage && (
          <div className="absolute inset-0">
            <img
              src={coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(3,5,10,0.92)] via-[rgba(3,5,10,0.2)] to-transparent" />
          </div>
        )}

        <div className="relative z-10 container-tokens px-4 pb-16">
          {children}
        </div>
      </section>
    );
  }

  // Generic variant
  return (
    <section className={cn('relative py-16 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-[var(--bg-base)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--accent-cyan)] opacity-[0.03] blur-[60px] pointer-events-none" />
      </div>

      <div className="relative z-10 container-tokens max-w-3xl text-center px-4">
        {eyebrow && (
          <p className="font-[var(--font-label)] font-bold uppercase tracking-[0.1em] text-[var(--accent-cyan)] text-xs mb-3">
            {eyebrow}
          </p>
        )}

        <h1 className="font-[var(--font-heading)] font-bold text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--text-primary)] mb-3">
          {title}
        </h1>

        {subtitle && (
          <p className="text-[var(--text-secondary)] text-base">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}