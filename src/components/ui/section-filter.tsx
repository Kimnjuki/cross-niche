/**
 * Ars Technica / WIRED style: section filter chips (All, Tech, Security, Gaming).
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SectionFilterValue = 'all' | 'tech' | 'security' | 'gaming';

const SECTIONS: { value: SectionFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tech', label: 'Tech' },
  { value: 'security', label: 'Security' },
  { value: 'gaming', label: 'Gaming' },
];

interface SectionFilterProps {
  value: SectionFilterValue;
  onChange: (value: SectionFilterValue) => void;
  className?: string;
  ariaLabel?: string;
}

export function SectionFilter({ value, onChange, className, ariaLabel = 'Filter by section' }: SectionFilterProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex flex-wrap gap-2', className)}>
      {SECTIONS.map((section) => (
        <Button
          key={section.value}
          variant={value === section.value ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'rounded-full text-xs font-medium',
            value === section.value && section.value === 'tech' && 'bg-tech text-tech-foreground hover:bg-tech/90',
            value === section.value && section.value === 'security' && 'bg-security text-security-foreground hover:bg-security/90',
            value === section.value && section.value === 'gaming' && 'bg-gaming text-gaming-foreground hover:bg-gaming/90'
          )}
          onClick={() => onChange(section.value)}
          aria-pressed={value === section.value}
        >
          {section.label}
        </Button>
      ))}
    </div>
  );
}
