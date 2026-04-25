import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NewsletterBlockProps {
  variant?: 'full' | 'compact' | 'sidebar';
  heading?: string;
  subheading?: string;
  placeholder?: string;
  ctaText?: string;
  onSubscribe?: (email: string) => void;
  className?: string;
}

export function NewsletterBlock({
  variant = 'full',
  heading,
  subheading,
  placeholder,
  ctaText,
  onSubscribe,
  className
}: NewsletterBlockProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await onSubscribe?.(email);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <div
        className={cn(
          'bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5',
          className
        )}
      >
        <h4 className="font-[var(--font-heading)] text-base text-[var(--text-primary)] mb-3">
          {heading || 'Weekly Brief'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder || 'your@email.com'}
            className="h-10"
          />
          <Button type="submit" variant="primary" size="sm" className="w-full" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : ctaText || 'Subscribe'}
          </Button>
          <p className="text-[var(--text-tertiary)] text-xs">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder || 'Weekly intel brief →'}
          className="h-10 flex-1"
        />
        <Button type="submit" variant="primary" size="sm" disabled={isLoading}>
          {isLoading ? '...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  // Full variant
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border-cyan)] p-8',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(0,229,255,0.06), rgba(168,85,247,0.06))'
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="font-[var(--font-heading)] text-2xl text-[var(--text-primary)] mb-3">
          {heading || 'Stay in the Grid'}
        </h3>
        <p className="text-[var(--text-secondary)] mb-6">
          {subheading || 'Weekly intel briefs: top signals in tech, security, and gaming.'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder || 'Enter your email'}
            className="h-12 flex-1"
          />
          <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : ctaText || 'Join the Grid'}
          </Button>
        </form>
        <p className="text-[var(--text-tertiary)] text-xs mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}