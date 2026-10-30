import type { Grade } from '@/lib/games/types';
import { cn } from '@/lib/utils';
import { Lock, Shield } from 'lucide-react';

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const GRADE_CONFIG: Record<Grade, { label: string; tone: string; icon: typeof Shield }> = {
  A: {
    label: 'Grade A: Strong documented protections',
    tone: 'text-green-700 bg-green-500/10 border-green-500/30 dark:text-green-400',
    icon: Shield,
  },
  B: {
    label: 'Grade B: Good documented protections',
    tone: 'text-blue-700 bg-blue-500/10 border-blue-500/30 dark:text-blue-400',
    icon: Shield,
  },
  C: {
    label: 'Grade C: Documented gaps to address',
    tone: 'text-amber-700 bg-amber-500/10 border-amber-500/30 dark:text-amber-400',
    icon: Lock,
  },
  D: {
    label: 'Grade D: Significant concerns or urgent action needed',
    tone: 'text-red-700 bg-red-500/10 border-red-500/30 dark:text-red-400',
    icon: Shield,
  },
};

export function GradeBadge({
  grade,
  size = 'md',
  showLabel = true,
  className,
}: GradeBadgeProps) {
  const config = GRADE_CONFIG[grade];
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border font-semibold',
        config.tone,
        sizes[size],
        className
      )}
      role="status"
      aria-label={config.label}
    >
      <Shield className="h-3.5 w-3.5" />
      <span className="font-display">{grade}</span>
      {showLabel && <span className="text-xs opacity-90">{config.label}</span>}
    </div>
  );
}
