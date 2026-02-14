/**
 * Nexus Risk-to-Reward Gaming Index (nexus-001)
 * Radar chart: Fun Factor vs Security Risk, plus Nexus Security Score.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Smartphone, FileText } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { securityRiskFromNexusScore } from '@/lib/nexus/nexusSecurityScore';

export interface GameSecurityRatingProps {
  gameTitle: string;
  nexusSecurityScore: number; // 0–100
  funFactor?: number; // 0–100
  dataEncryption: boolean;
  accountMFA: boolean;
  dataSharingPolicy: 'minimal' | 'standard' | 'extensive' | 'unknown';
  className?: string;
}

const POLICY_LABELS: Record<string, string> = {
  minimal: 'Minimal',
  standard: 'Standard',
  extensive: 'Extensive',
  unknown: 'Unknown',
};

function scoreBadgeClass(score: number): string {
  if (score >= 90) return 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400';
  if (score >= 70) return 'border-gaming/30 bg-gaming/10 text-gaming';
  if (score >= 50) return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
  return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400';
}

export function GameSecurityCard({
  gameTitle,
  nexusSecurityScore,
  funFactor = 70,
  dataEncryption,
  accountMFA,
  dataSharingPolicy,
  className,
}: GameSecurityRatingProps) {
  const securityRisk = securityRiskFromNexusScore(nexusSecurityScore);

  const radarData = [
    { subject: 'Fun Factor', value: funFactor, fullMark: 100 },
    { subject: 'Security Risk', value: securityRisk, fullMark: 100 },
    { subject: 'Encryption', value: dataEncryption ? 100 : 0, fullMark: 100 },
    { subject: 'MFA', value: accountMFA ? 100 : 0, fullMark: 100 },
    { subject: 'Privacy', value: dataSharingPolicy === 'minimal' ? 100 : dataSharingPolicy === 'standard' ? 70 : dataSharingPolicy === 'extensive' ? 30 : 50, fullMark: 100 },
  ];

  return (
    <Card className={cn('overflow-hidden border-gaming/20 bg-card', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gaming/10">
              <Shield className="h-4 w-4 text-gaming" />
            </span>
            {gameTitle}
          </CardTitle>
          <Badge className={cn('shrink-0 text-sm font-semibold', scoreBadgeClass(nexusSecurityScore))}>
            {nexusSecurityScore}/100
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Nexus Security Score • Fun vs Risk</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(var(--gaming))"
                fill="hsl(var(--gaming))"
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontSize: 12,
                }}
                formatter={(value: number) => [value, '']}
                labelFormatter={(label) => label}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
            <Lock className={cn('h-3.5 w-3', dataEncryption ? 'text-green-600' : 'text-muted-foreground')} />
            <span className="text-muted-foreground">Encryption</span>
            <span className="font-medium ml-auto">{dataEncryption ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
            <Smartphone className={cn('h-3.5 w-3', accountMFA ? 'text-green-600' : 'text-muted-foreground')} />
            <span className="text-muted-foreground">MFA</span>
            <span className="font-medium ml-auto">{accountMFA ? 'Yes' : 'No'}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
            <FileText className="h-3.5 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Data sharing</span>
            <span className="font-medium ml-auto">{POLICY_LABELS[dataSharingPolicy] ?? dataSharingPolicy}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
