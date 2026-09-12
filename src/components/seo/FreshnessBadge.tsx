import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FreshnessBadgeProps {
  updatedAt?: string;
  publishedAt: string;
  className?: string;
}

export function FreshnessBadge({ updatedAt, publishedAt, className }: FreshnessBadgeProps) {
  const now = new Date();
  const updated = updatedAt ? new Date(updatedAt) : new Date(publishedAt);
  const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));

  const currentYear = now.getFullYear();
  const isCurrentYear = updated.getFullYear() === currentYear;

  let label: string;
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'topic' | 'breaking';

  if (diffDays <= 30) {
    label = 'Updated Recently';
    variant = 'topic';
  } else if (diffDays <= 90) {
    label = 'Updated This Quarter';
    variant = 'topic';
  } else if (isCurrentYear) {
    label = `Updated for ${currentYear}`;
    variant = 'topic';
  } else {
    label = `Last updated ${updated.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    variant = 'secondary';
  }

  return (
    <Badge variant={variant} className={cn('gap-1', className)}>
      <CheckCircle className="h-3 w-3" />
      {label}
    </Badge>
  );
}
