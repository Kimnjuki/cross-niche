import React, { useState, useEffect, useCallback } from 'react';
import { X, Info, AlertCircle, AlertTriangle, Siren } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertToastProps {
  id: string;
  type: 'breaking' | 'new_article' | 'score_update' | 'patch_notes' | 'threat_advisory' | 'price_drop' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  ctaLink?: string;
  ctaLabel?: string;
  autoDismissMs?: number;
  onDismiss: (id: string) => void;
}

const priorityConfig = {
  low: { color: 'var(--accent-cyan)', icon: Info },
  medium: { color: 'var(--accent-amber)', icon: AlertCircle },
  high: { color: 'var(--accent-red)', icon: AlertTriangle },
  critical: { color: 'var(--accent-red)', icon: Siren }
};

const typeLabels = {
  breaking: 'BREAKING',
  new_article: 'NEW SIGNAL',
  score_update: 'SCORE UPDATE',
  patch_notes: 'PATCH NOTES',
  threat_advisory: 'THREAT ADVISORY',
  price_drop: 'PRICE DROP',
  system: 'SYSTEM'
};

export function AlertToast({
  id,
  priority,
  type,
  title,
  description,
  ctaLink,
  ctaLabel,
  autoDismissMs = 5000,
  onDismiss
}: AlertToastProps) {
  const [progress, setProgress] = useState(100);
  const config = priorityConfig[priority];
  const Icon = config.icon;

  const handleDismiss = useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  useEffect(() => {
    if (!autoDismissMs) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoDismissMs) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [autoDismissMs, handleDismiss]);

  return (
    <div
      className={cn(
        'w-[360px] bg-[var(--bg-elevated)] border border-[var(--border-cyan)] rounded-[var(--radius-md)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-[16px] overflow-hidden animate-toast-enter'
      )}
      style={{ borderLeft: `3px solid ${config.color}` }}
      role="alert"
      aria-live={priority === 'high' || priority === 'critical' ? 'assertive' : 'polite'}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: config.color }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span
                className="font-[var(--font-label)] uppercase tracking-[0.08em] text-xs"
                style={{ color: config.color }}
              >
                {typeLabels[type]}
              </span>
              <button
                onClick={handleDismiss}
                className="ml-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] mt-1 line-clamp-1">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                {description}
              </p>
            )}
            {ctaLink && (
              <a
                href={ctaLink}
                className="text-xs text-[var(--accent-cyan)] mt-2 inline-block hover:underline"
              >
                {ctaLabel || 'View →'}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] w-full bg-[var(--bg-surface)]">
        <div
          className="h-full transition-none"
          style={{
            width: `${progress}%`,
            backgroundColor: config.color
          }}
        />
      </div>
    </div>
  );
}