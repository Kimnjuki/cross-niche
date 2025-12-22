import { useState, useEffect } from 'react';
import { useThreatAlerts } from '@/hooks/useThreatAlerts';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function NexusScoreWidget() {
  const { data: alerts = [] } = useThreatAlerts(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [globalScore, setGlobalScore] = useState(3);

  useEffect(() => {
    // Calculate global threat level based on active alerts
    if (alerts.length === 0) {
      setGlobalScore(1);
      return;
    }

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const highCount = alerts.filter(a => a.severity === 'high').length;
    const mediumCount = alerts.filter(a => a.severity === 'medium').length;

    // Weighted calculation
    const weightedScore = 
      (criticalCount * 5 + highCount * 4 + mediumCount * 3) / alerts.length;
    
    setGlobalScore(Math.min(Math.ceil(weightedScore), 5));
  }, [alerts]);

  const getScoreColor = (score: number) => {
    if (score <= 1) return 'text-green-500';
    if (score <= 2) return 'text-lime-500';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGlow = (score: number) => {
    if (score <= 1) return 'shadow-[0_0_20px_rgba(34,197,94,0.4)]';
    if (score <= 2) return 'shadow-[0_0_20px_rgba(132,204,22,0.4)]';
    if (score <= 3) return 'shadow-[0_0_20px_rgba(234,179,8,0.4)]';
    if (score <= 4) return 'shadow-[0_0_20px_rgba(249,115,22,0.4)]';
    return 'shadow-[0_0_20px_rgba(239,68,68,0.4)]';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 1) return 'Low';
    if (score <= 2) return 'Moderate';
    if (score <= 3) return 'Elevated';
    if (score <= 4) return 'High';
    return 'Critical';
  };

  const percentage = (globalScore / 5) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full',
              'bg-card border-2 border-border',
              'flex items-center justify-center',
              'transition-all duration-300 hover:scale-110',
              getScoreGlow(globalScore),
              getScoreColor(globalScore)
            )}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90 absolute inset-0">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="opacity-20"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${percentage * 1.256} 125.6`}
                  className="transition-all duration-500"
                />
              </svg>
              <Shield className="h-6 w-6 relative z-10" />
              <span className="absolute bottom-1 text-xs font-bold">{globalScore}</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="w-64">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Cyber-Gaming Threat Level</span>
              <span className={cn('text-sm font-bold', getScoreColor(globalScore))}>
                {getScoreLabel(globalScore)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Global Nexus Score: {globalScore}/5</p>
              <p className="mt-1">
                {alerts.length} active threat{alerts.length !== 1 ? 's' : ''} detected
              </p>
            </div>
            {alerts.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold mb-1">Recent Threats:</p>
                <div className="space-y-1">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center gap-2 text-xs">
                      <AlertTriangle className={cn(
                        'h-3 w-3',
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        'text-yellow-500'
                      )} />
                      <span className="line-clamp-1">{alert.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

