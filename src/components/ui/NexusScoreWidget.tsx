import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NexusScoreWidgetProps {
  className?: string;
}

/**
 * Floating interactive dial that summarizes the current 'Cyber-Gaming Threat Level' globally
 * Competitive edge feature inspired by security dashboards
 */
export function NexusScoreWidget({ className }: NexusScoreWidgetProps) {
  const [score, setScore] = useState(72); // Mock score 0-100
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        const change = Math.random() * 4 - 2; // -2 to +2
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Low Risk';
    if (score >= 50) return 'Moderate Risk';
    return 'High Risk';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 75) return 'shadow-[0_0_20px_rgba(34,197,94,0.4)]';
    if (score >= 50) return 'shadow-[0_0_20px_rgba(234,179,8,0.4)]';
    return 'shadow-[0_0_20px_rgba(239,68,68,0.4)]';
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card 
      className={cn(
        'fixed bottom-6 right-6 z-50 w-80 transition-all duration-300',
        'bg-background/95 backdrop-blur-lg border-2',
        getScoreGlow(score),
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield className={cn('h-5 w-5', getScoreColor(score))} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="font-semibold text-sm">Nexus Threat Score</span>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs',
              score >= 75 && 'border-green-500/30 text-green-500',
              score >= 50 && score < 75 && 'border-yellow-500/30 text-yellow-500',
              score < 50 && 'border-red-500/30 text-red-500'
            )}
          >
            {getScoreLabel(score)}
          </Badge>
        </div>

        {/* Circular Progress Dial */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-500',
                getScoreColor(score)
              )}
            />
          </svg>
          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold', getScoreColor(score))}>
              {Math.round(score)}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3 pt-4 border-t border-border animate-fade-in">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-muted-foreground">Active Threats:</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-muted-foreground">Critical:</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="text-muted-foreground">Gaming Risk:</span>
                <span className="font-semibold">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-purple-500" />
                <span className="text-muted-foreground">Enterprise:</span>
                <span className="font-semibold">High</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center pt-2">
              Updated: Just now • Global monitoring active
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

