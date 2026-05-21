import React from 'react';

interface TrustScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const sizeMap = {
  sm: { container: 'w-10 h-10', text: 'text-xs', ring: 'ring-2' },
  md: { container: 'w-14 h-14', text: 'text-sm', ring: 'ring-2' },
  lg: { container: 'w-20 h-20', text: 'text-lg font-bold', ring: 'ring-3' },
};

export function TrustScoreBadge({ score, size = 'md', showLabel = false, animated = true }: TrustScoreBadgeProps) {
  const [displayScore, setDisplayScore] = React.useState(animated ? 0 : score);

  React.useEffect(() => {
    if (!animated) { setDisplayScore(score); return; }
    const duration = 800;
    const steps = 20;
    const increment = score / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [score, animated]);

  const getColor = (s: number) => {
    if (s >= 80) return { ring: 'ring-emerald-500', fill: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'High Trust' };
    if (s >= 60) return { ring: 'ring-amber-500', fill: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Moderate' };
    return { ring: 'ring-red-500', fill: 'text-red-400', bg: 'bg-red-500/10', label: 'Review Needed' };
  };

  const colors = getColor(score);
  const sz = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 ${showLabel ? '' : ''}`}>
      <div className={`${sz.container} rounded-full ${sz.ring} ${colors.ring} ${colors.bg} flex items-center justify-center`}>
        <span className={`${sz.text} ${colors.fill} font-mono tabular-nums`}>
          {displayScore}
        </span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${colors.fill}`}>{colors.label}</span>
          <span className="text-[10px] text-zinc-500">Trust Score</span>
        </div>
      )}
    </div>
  );
}
