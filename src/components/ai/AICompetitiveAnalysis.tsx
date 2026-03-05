/**
 * Competitive Analysis Component
 * Compares how industry leaders implement similar features and identifies gaps/opportunities
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIUpdate } from '@/data/aiUpdates';

interface AICompetitiveAnalysisProps {
  items: AIUpdate[];
}

export function AICompetitiveAnalysis({ items }: AICompetitiveAnalysisProps) {
  const competitiveData = useMemo(() => {
    const analysis: Array<{
      update: AIUpdate;
      competitive: typeof items[0]['competitiveAnalysis'];
    }> = [];

    items.forEach((item) => {
      if (item.competitiveAnalysis && item.competitiveAnalysis.length > 0) {
        analysis.push({
          update: item,
          competitive: item.competitiveAnalysis,
        });
      }
    });

    return analysis;
  }, [items]);

  if (competitiveData.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display font-bold text-2xl mb-2">Competitive Analysis</h2>
          <p className="text-muted-foreground">
            Analysis of how industry leaders implement similar features and opportunities for differentiation.
          </p>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Competitive analysis data coming soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-2">Competitive Analysis</h2>
        <p className="text-muted-foreground">
          How industry leaders in AI and ML implement similar features. Identifies gaps and opportunities for differentiation.
        </p>
      </div>

      <div className="space-y-4">
        {competitiveData.map(({ update, competitive }) => (
          <Card key={update.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{update.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{update.description}</p>
                </div>
                <Badge variant="outline" className="ml-4">
                  {update.category.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {competitive?.map((comp, idx) => (
                <div key={idx} className="border-l-2 border-primary/30 pl-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{comp.company}</span>
                  </div>
                  {comp.similarFeature && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Similar Feature:</p>
                        <p className="text-sm text-muted-foreground">{comp.similarFeature}</p>
                      </div>
                    </div>
                  )}
                  {comp.differentiation && (
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Differentiation:</p>
                        <p className="text-sm text-muted-foreground">{comp.differentiation}</p>
                      </div>
                    </div>
                  )}
                  {comp.gap && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Opportunity Gap:</p>
                        <p className="text-sm text-muted-foreground">{comp.gap}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
