/**
 * Future Predictions Component
 * Insights into potential AI/ML developments based on current trends and expert opinions
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIUpdate } from '@/data/aiUpdates';

interface AIFuturePredictionsProps {
  items: AIUpdate[];
}

const TIMEFRAME_LABELS = {
  short: '0-6 months',
  medium: '6-18 months',
  long: '18+ months',
};

const CONFIDENCE_COLORS = {
  high: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
};

export function AIFuturePredictions({ items }: AIFuturePredictionsProps) {
  const predictions = useMemo(() => {
    return items
      .filter((item) => item.futurePrediction)
      .map((item) => ({
        update: item,
        prediction: item.futurePrediction!,
      }))
      .sort((a, b) => {
        const order = { short: 0, medium: 1, long: 2 };
        return order[a.prediction.timeframe] - order[b.prediction.timeframe];
      });
  }, [items]);

  const groupedByTimeframe = useMemo(() => {
    const groups: Record<string, typeof predictions> = {
      short: [],
      medium: [],
      long: [],
    };
    predictions.forEach((pred) => {
      groups[pred.prediction.timeframe].push(pred);
    });
    return groups;
  }, [predictions]);

  if (predictions.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display font-bold text-2xl mb-2">Future Predictions</h2>
          <p className="text-muted-foreground">
            Insights into potential AI/ML developments based on current trends and expert opinions.
          </p>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Future predictions coming soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl mb-2">Future Predictions</h2>
        <p className="text-muted-foreground">
          Potential AI/ML developments and their implications for various sectors, based on current trends and expert analysis.
        </p>
      </div>

      <div className="space-y-6">
        {(['short', 'medium', 'long'] as const).map((timeframe) => {
          const group = groupedByTimeframe[timeframe];
          if (group.length === 0) return null;

          return (
            <div key={timeframe} className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">{TIMEFRAME_LABELS[timeframe]}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.map(({ update, prediction }) => (
                  <Card key={update.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{update.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={cn('text-xs shrink-0', CONFIDENCE_COLORS[prediction.confidence])}
                        >
                          {prediction.confidence} confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Prediction:</p>
                        <p className="text-sm text-muted-foreground">{prediction.prediction}</p>
                      </div>
                      {prediction.implications && prediction.implications.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Implications:
                          </p>
                          <ul className="space-y-1">
                            {prediction.implications.map((impl, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{impl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
