/**
 * Comprehensive Feature Overview Component
 * Highlights how AI/ML features contribute to gaming, security, and other technologies
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Shield, Zap, Palette, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIUpdate, AIFeature } from '@/data/aiUpdates';

interface AIFeatureOverviewProps {
  items: AIUpdate[];
}

const SECTOR_ICONS = {
  gaming: Gamepad2,
  security: Shield,
  productivity: Zap,
  creative: Palette,
  other: TrendingUp,
};

const IMPACT_COLORS = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
};

const SECTOR_DESCRIPTIONS: Record<string, string> = {
  gaming: 'AI technologies revolutionizing game development, NPC behavior, procedural content generation, and player experience enhancement.',
  security: 'Machine learning applications in cybersecurity, threat detection, fraud prevention, and secure authentication systems.',
  productivity: 'AI-powered tools and automation that enhance workflow efficiency, decision-making, and business process optimization.',
  creative: 'Generative AI and ML models enabling new forms of artistic expression, content creation, and creative workflows.',
  other: 'Emerging AI/ML applications across various industries and use cases.',
};

export function AIFeatureOverview({ items }: AIFeatureOverviewProps) {
  const featuresBySector = useMemo(() => {
    const sectorMap: Record<string, AIFeature[]> = {};
    
    items.forEach((item) => {
      if (item.features && Array.isArray(item.features)) {
        item.features.forEach((feature) => {
          if (!sectorMap[feature.sector]) {
            sectorMap[feature.sector] = [];
          }
          sectorMap[feature.sector].push(feature);
        });
      }
    });

    // Sort features by impact (high -> medium -> low)
    Object.keys(sectorMap).forEach((sector) => {
      sectorMap[sector].sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      });
    });

    return sectorMap;
  }, [items]);

  const sectors = Object.keys(featuresBySector) as Array<keyof typeof SECTOR_ICONS>;
  
  // Calculate sector statistics
  const sectorStats = useMemo(() => {
    const stats: Record<string, { total: number; high: number; medium: number; low: number }> = {};
    sectors.forEach((sector) => {
      const features = featuresBySector[sector] || [];
      stats[sector] = {
        total: features.length,
        high: features.filter(f => f.impact === 'high').length,
        medium: features.filter(f => f.impact === 'medium').length,
        low: features.filter(f => f.impact === 'low').length,
      };
    });
    return stats;
  }, [sectors, featuresBySector]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-2">Feature Overview</h2>
        <p className="text-muted-foreground">
          How AI and ML features contribute to advancement across gaming, security, productivity, and creative sectors.
        </p>
      </div>

      {sectors.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Feature overview data coming soon.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((sector) => {
            const Icon = SECTOR_ICONS[sector] || TrendingUp;
            const features = featuresBySector[sector] || [];
            const stats = sectorStats[sector];

            if (features.length === 0) return null;

          return (
            <Card key={sector} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="capitalize text-lg">{sector}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {SECTOR_DESCRIPTIONS[sector] || 'AI/ML features in this sector.'}
                      </p>
                    </div>
                  </div>
                </div>
                {stats && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {stats.total} feature{stats.total !== 1 ? 's' : ''}
                    </Badge>
                    {stats.high > 0 && (
                      <Badge variant="outline" className={cn('text-xs', IMPACT_COLORS.high)}>
                        {stats.high} high impact
                      </Badge>
                    )}
                    {stats.medium > 0 && (
                      <Badge variant="outline" className={cn('text-xs', IMPACT_COLORS.medium)}>
                        {stats.medium} medium
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {features.map((feature, idx) => (
                  <div key={idx} className="space-y-2 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{feature.name}</h4>
                      <Badge
                        variant="outline"
                        className={cn('text-xs shrink-0', IMPACT_COLORS[feature.impact])}
                      >
                        {feature.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}
    </div>
  );
}
