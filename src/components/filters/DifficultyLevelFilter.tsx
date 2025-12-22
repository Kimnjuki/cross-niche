import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GraduationCap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface DifficultyLevelFilterProps {
  selectedLevels: DifficultyLevel[];
  onLevelsChange: (levels: DifficultyLevel[]) => void;
  variant?: 'badges' | 'dropdown';
  className?: string;
}

const difficultyConfig: Record<DifficultyLevel, { label: string; color: string; description: string }> = {
  beginner: {
    label: 'Beginner',
    color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    description: 'Basic concepts, easy to understand',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    description: 'Some technical knowledge required',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    description: 'Deep technical understanding needed',
  },
  expert: {
    label: 'Expert',
    color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    description: 'Professional-level technical expertise',
  },
};

export function DifficultyLevelFilter({
  selectedLevels,
  onLevelsChange,
  variant = 'badges',
  className,
}: DifficultyLevelFilterProps) {
  const toggleLevel = (level: DifficultyLevel) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter(l => l !== level));
    } else {
      onLevelsChange([...selectedLevels, level]);
    }
  };

  const clearAll = () => {
    onLevelsChange([]);
  };

  if (variant === 'dropdown') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={className}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Difficulty
            {selectedLevels.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedLevels.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Difficulty Level</Label>
              {selectedLevels.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-6 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            {Object.entries(difficultyConfig).map(([level, config]) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={selectedLevels.includes(level as DifficultyLevel)}
                  onCheckedChange={() => toggleLevel(level as DifficultyLevel)}
                />
                <Label
                  htmlFor={level}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span>{config.label}</span>
                    <Badge className={cn('text-xs', config.color)}>
                      {config.label.charAt(0)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.description}
                  </p>
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {Object.entries(difficultyConfig).map(([level, config]) => {
        const isSelected = selectedLevels.includes(level as DifficultyLevel);
        return (
          <Badge
            key={level}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all',
              isSelected && config.color
            )}
            onClick={() => toggleLevel(level as DifficultyLevel)}
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            {config.label}
            {isSelected && (
              <X className="h-3 w-3 ml-1" onClick={(e) => {
                e.stopPropagation();
                toggleLevel(level as DifficultyLevel);
              }} />
            )}
          </Badge>
        );
      })}
      {selectedLevels.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-6 text-xs"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}



