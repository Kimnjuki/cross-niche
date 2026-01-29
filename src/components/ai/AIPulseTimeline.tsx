/**
 * Interactive AI-Pulse Roadmap (nexus-002)
 * Vertical timeline for AI/ML tech trends with filter (Productivity | Creative | Gaming AI)
 * and Hype vs Utility toggle.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sparkles, BarChart3, Palette, Gamepad2, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIUpdate, AICategory } from '@/data/aiUpdates';
import { formatDistanceToNow } from 'date-fns';

interface AIPulseTimelineProps {
  items: AIUpdate[];
  className?: string;
}

const CATEGORY_OPTIONS: { value: AICategory | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Sparkles },
  { value: 'productivity', label: 'Productivity', icon: Zap },
  { value: 'creative', label: 'Creative', icon: Palette },
  { value: 'gaming_ai', label: 'Gaming AI', icon: Gamepad2 },
];

export function AIPulseTimeline({ items, className }: AIPulseTimelineProps) {
  const [category, setCategory] = useState<AICategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'hype' | 'utility'>('utility');

  const filtered = useMemo(() => {
    let list = items;
    if (category !== 'all') list = list.filter((i) => i.category === category);
    return [...list].sort((a, b) => b.publishedAt - a.publishedAt);
  }, [items, category]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filter: Productivity | Creative | Gaming AI */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs value={category} onValueChange={(v) => setCategory(v as AICategory | 'all')}>
          <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-grid">
            {CATEGORY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <TabsTrigger key={opt.value} value={opt.value} className="gap-1.5 text-xs sm:text-sm">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {opt.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Hype vs Utility toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">View:</span>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as 'hype' | 'utility')}
            className="gap-0"
          >
            <ToggleGroupItem value="hype" aria-label="Hype view" className="text-xs sm:text-sm">
              Hype
            </ToggleGroupItem>
            <ToggleGroupItem value="utility" aria-label="Utility view" className="text-xs sm:text-sm">
              Utility
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Center line */}
        <div
          className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border"
          aria-hidden
        />

        <ul className="space-y-0">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const isDimmed = viewMode === 'hype' && item.isHype;
              const isHighlighted = viewMode === 'utility' && item.hasBenchmarks;

              return (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative pl-12 sm:pl-14 pb-8 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      'absolute left-0 top-2 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center bg-background',
                      isHighlighted && 'border-primary ring-2 ring-primary/20',
                      isDimmed && 'opacity-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full',
                        item.category === 'productivity' && 'bg-tech',
                        item.category === 'creative' && 'bg-purple-500',
                        item.category === 'gaming_ai' && 'bg-gaming'
                      )}
                    />
                  </div>

                  <Card
                    className={cn(
                      'transition-all duration-200',
                      isDimmed && 'opacity-60',
                      isHighlighted && 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                    )}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            item.category === 'productivity' && 'border-tech/30 text-tech',
                            item.category === 'creative' && 'border-purple-500/30 text-purple-600 dark:text-purple-400',
                            item.category === 'gaming_ai' && 'border-gaming/30 text-gaming'
                          )}
                        >
                          {item.category === 'productivity' && <Zap className="h-3 w-3 mr-1" />}
                          {item.category === 'creative' && <Palette className="h-3 w-3 mr-1" />}
                          {item.category === 'gaming_ai' && <Gamepad2 className="h-3 w-3 mr-1" />}
                          {item.category.replace('_', ' ')}
                        </Badge>
                        {item.hasBenchmarks && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Benchmarks
                          </Badge>
                        )}
                        {item.isHype && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Marketing
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No updates in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
