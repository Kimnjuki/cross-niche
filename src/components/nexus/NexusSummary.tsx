/**
 * Nexus Summary (nexus-004): bridges Tech, Security, and Gaming via a common keyword.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Cpu, Shield, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface NexusSummaryProps {
  tech: Article | null;
  security: Article | null;
  gaming: Article | null;
  commonKeyword: string;
  className?: string;
}

const nicheConfig = {
  tech: { label: 'Tech', icon: Cpu, class: 'text-tech border-tech/30' },
  security: { label: 'Security', icon: Shield, class: 'text-security border-security/30' },
  gaming: { label: 'Gaming', icon: Gamepad2, class: 'text-gaming border-gaming/30' },
};

export function NexusSummary({ tech, security, gaming, commonKeyword, className }: NexusSummaryProps) {
  const items = [
    { article: tech, niche: 'tech' as const },
    { article: security, niche: 'security' as const },
    { article: gaming, niche: 'gaming' as const },
  ].filter((i) => i.article);

  if (items.length === 0) {
    return (
      <Card className={cn('border-primary/20 bg-primary/5', className)}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No cross-section content available. Publish one Tech, one Security, and one Gaming article to see the Nexus Summary.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-primary/20 bg-primary/5 dark:bg-primary/10', className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Nexus Summary</h2>
          <Badge variant="secondary" className="ml-auto">
            {commonKeyword}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-4">
          This cross-section links <strong>Tech</strong>, <strong>Security</strong>, and <strong>Gaming</strong> through the theme of{' '}
          <strong className="text-foreground">{commonKeyword}</strong>. One article from each niche is shown below.
        </p>
        <ul className="space-y-2">
          {items.map(({ article, niche }) => {
            const config = nicheConfig[niche];
            const Icon = config.icon;
            return (
              <li key={article.id}>
                <Link
                  to={`/article/${article.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50',
                    config.class
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium truncate">{article.title}</span>
                  <Badge variant="outline" className={cn('shrink-0 text-xs', config.class)}>
                    {config.label}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
