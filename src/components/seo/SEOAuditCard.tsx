/**
 * SEO Audit Card – checklist for auditing pages targeting low-hanging fruit keywords.
 * Use in admin/dashboard or content audit workflows.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SEOAuditFields {
  url: string;
  wordCount?: number;
  keywordCoverage?: 'low' | 'medium' | 'high';
  internalLinks?: number;
  metaTitle?: string;
  metaDesc?: string;
  targetKeyword?: string;
  notes?: string;
}

interface SEOAuditCardProps {
  audit: SEOAuditFields;
  targetWordCount?: number;
  className?: string;
}

const keywordCoverageLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const keywordCoverageColors = {
  low: 'bg-red-500/10 text-red-600 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  high: 'bg-green-500/10 text-green-600 border-green-500/20',
};

export function SEOAuditCard({ audit, targetWordCount = 1000, className }: SEOAuditCardProps) {
  const wordCountOk = (audit.wordCount ?? 0) >= targetWordCount;
  const hasMetaTitle = !!audit.metaTitle && audit.metaTitle.length >= 30;
  const hasMetaDesc = !!audit.metaDesc && audit.metaDesc.length >= 120;
  const hasInternalLinks = (audit.internalLinks ?? 0) >= 2;
  const coverageOk = audit.keywordCoverage === 'high' || audit.keywordCoverage === 'medium';

  const checks = [
    { label: 'Word count', ok: wordCountOk, value: audit.wordCount ? `${audit.wordCount}+` : '—' },
    { label: 'Keyword coverage', ok: coverageOk, value: audit.keywordCoverage ? keywordCoverageLabels[audit.keywordCoverage] : '—' },
    { label: 'Internal links', ok: hasInternalLinks, value: audit.internalLinks ?? '—' },
    { label: 'Meta title', ok: hasMetaTitle, value: audit.metaTitle ? `${audit.metaTitle.length} chars` : '—' },
    { label: 'Meta description', ok: hasMetaDesc, value: audit.metaDesc ? `${audit.metaDesc.length} chars` : '—' },
  ];

  return (
    <Card className={cn('border-border', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center justify-between gap-2">
          <a href={audit.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
            {audit.url.replace(/^https?:\/\/[^/]+/, '') || '/'}
          </a>
          {audit.targetKeyword && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {audit.targetKeyword}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {checks.map(({ label, ok, value }) => (
            <div key={label} className="flex items-center gap-2">
              {ok ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="text-muted-foreground">{label}:</span>
              <span className={cn(!ok && 'text-amber-600')}>{value}</span>
            </div>
          ))}
        </div>
        {audit.notes && (
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {audit.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
