import React from 'react';
import { Zap, AlertTriangle, Wrench, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutBlockProps {
  variant: 'intel_brief' | 'threat_advisory' | 'patch_note' | 'tip';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  intel_brief: {
    label: 'INTEL BRIEF',
    icon: Zap,
    borderColor: 'var(--accent-cyan)',
    bg: 'rgba(0, 229, 255, 0.04)'
  },
  threat_advisory: {
    label: 'THREAT ADVISORY',
    icon: AlertTriangle,
    borderColor: 'var(--accent-red)',
    bg: 'rgba(239, 68, 68, 0.06)'
  },
  patch_note: {
    label: 'PATCH NOTE',
    icon: Wrench,
    borderColor: 'var(--accent-amber)',
    bg: 'rgba(245, 158, 11, 0.04)'
  },
  tip: {
    label: 'TIP',
    icon: Lightbulb,
    borderColor: 'var(--accent-violet)',
    bg: 'rgba(168, 85, 247, 0.04)'
  }
};

export function CalloutBlock({
  variant,
  title,
  children,
  className
}: CalloutBlockProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'my-8 p-6 rounded-[var(--radius-md)] border-l-3',
        className
      )}
      style={{
        backgroundColor: config.bg,
        borderLeftColor: config.borderColor
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-5 w-5" style={{ color: config.borderColor }} />
        <span
          className="font-[var(--font-label)] uppercase tracking-[0.1em] text-xs"
          style={{ color: config.borderColor }}
        >
          {config.label}
        </span>
      </div>

      {title && (
        <h4 className="font-[var(--font-heading)] text-base text-[var(--text-primary)] mb-2">
          {title}
        </h4>
      )}

      <div className="text-[var(--text-secondary)] text-sm">
        {children}
      </div>
    </div>
  );
}