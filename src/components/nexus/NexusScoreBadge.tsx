import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Shield, AlertTriangle } from 'lucide-react';
import { getNexusRiskRating, getNexusBorderClass, type NexusRiskRating } from '@/lib/nexus/riskRating';
import { cn } from '@/lib/utils';

interface NexusScoreBadgeProps {
  cvssScore?: number;
  nexusScore?: number; // Direct score if already calculated
  affectsGamingHardware?: boolean;
  affectsGamingSoftware?: boolean;
  affectsStreaming?: boolean;
  requiresHardwareReplacement?: boolean;
  variant?: 'default' | 'compact' | 'gauge';
  className?: string;
}

export function NexusScoreBadge({
  cvssScore,
  nexusScore,
  affectsGamingHardware = false,
  affectsGamingSoftware = false,
  affectsStreaming = false,
  requiresHardwareReplacement = false,
  variant = 'default',
  className,
}: NexusScoreBadgeProps) {
  const rating: NexusRiskRating = nexusScore
    ? getNexusRiskRating(nexusScore, affectsGamingHardware, affectsGamingSoftware, affectsStreaming, requiresHardwareReplacement)
    : cvssScore
    ? getNexusRiskRating(cvssScore, affectsGamingHardware, affectsGamingSoftware, affectsStreaming, requiresHardwareReplacement)
    : getNexusRiskRating(0);

  if (variant === 'gauge') {
    return <NexusGauge rating={rating} className={className} />;
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={cn(getNexusBorderClass(rating.score), className)}>
              <Shield className="h-3 w-3 mr-1" />
              {rating.score}/5
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">{rating.label} Risk</p>
              <p className="text-xs">{rating.description}</p>
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold">Gamer Impact:</p>
                <p className="text-xs">{rating.gamerImpact}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={cn(getNexusBorderClass(rating.score), 'gap-2', className)}>
            <Shield className="h-4 w-4" />
            <span className="font-semibold">Nexus {rating.score}/5</span>
            <span className="text-xs opacity-80">{rating.label}</span>
            {rating.score >= 4 && <AlertTriangle className="h-3 w-3" />}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-sm mb-1">{rating.label} Risk Rating</p>
              <p className="text-xs text-muted-foreground">{rating.description}</p>
            </div>
            <div className="border-t pt-2 space-y-2">
              <div>
                <p className="text-xs font-semibold mb-1">🎮 Gamer Impact:</p>
                <p className="text-xs">{rating.gamerImpact}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">🏢 Enterprise Impact:</p>
                <p className="text-xs">{rating.enterpriseImpact}</p>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function NexusGauge({ rating, className }: { rating: NexusRiskRating; className?: string }) {
  const percentage = (rating.score / 5) * 100;
  const colors = {
    1: 'from-green-500 to-green-600',
    2: 'from-lime-500 to-lime-600',
    3: 'from-yellow-500 to-yellow-600',
    4: 'from-orange-500 to-orange-600',
    5: 'from-red-500 to-red-600',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('relative w-16 h-16', className)}>
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${percentage * 1.76} 176`}
                className={cn('transition-all duration-500', colors[rating.score as keyof typeof colors])}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{rating.score}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-semibold">{rating.label} Risk</p>
            <p className="text-xs">{rating.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}



