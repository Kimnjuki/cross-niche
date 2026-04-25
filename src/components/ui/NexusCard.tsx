import React from 'react';
import { cn } from '@/lib/utils';

type NexusCardVariant = 'featured' | 'glass' | 'standard' | 'minimal';
type NexusCardAccent  = 'cyan' | 'pink' | 'green' | 'purple' | 'amber' | 'none';

interface NexusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NexusCardVariant;
  accent?: NexusCardAccent;
  hoverLift?: boolean;
  children: React.ReactNode;
}

const ACCENT_HOVER: Record<NexusCardAccent, string> = {
  cyan:   'hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]',
  pink:   'hover:border-[rgba(255,0,122,0.4)] hover:shadow-[0_0_20px_rgba(255,0,122,0.15)]',
  green:  'hover:border-[rgba(57,255,20,0.4)] hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]',
  purple: 'hover:border-[rgba(176,38,255,0.4)] hover:shadow-[0_0_20px_rgba(176,38,255,0.15)]',
  amber:  'hover:border-[rgba(255,184,0,0.4)] hover:shadow-[0_0_20px_rgba(255,184,0,0.15)]',
  none:   'hover:border-[#3F3F46]',
};

const BASE: Record<NexusCardVariant, string> = {
  featured: 'bg-[#16161A] border border-[#27272A] overflow-hidden',
  glass:    'backdrop-blur-[12px] saturate-150 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
  standard: 'bg-[#16161A] border border-[#27272A]',
  minimal:  'bg-transparent border-b border-[#27272A] rounded-none shadow-none',
};

export function NexusCard({
  variant = 'standard',
  accent = 'cyan',
  hoverLift = false,
  className,
  children,
  ...props
}: NexusCardProps) {
  return (
    <div
      className={cn(
        BASE[variant],
        ACCENT_HOVER[accent],
        hoverLift && 'hover:-translate-y-1',
        'transition-all duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function NexusCardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
      />
    </div>
  );
}

export function NexusCardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4 flex flex-col gap-2', className)}>{children}</div>;
}
