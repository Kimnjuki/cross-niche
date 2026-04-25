import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ChevronRight, AlertTriangle } from 'lucide-react';
import type { Article } from '@/types';

interface ThreatIntelWidgetProps {
  articles: Article[];
}

type Severity = 'critical' | 'high' | 'medium' | 'low';

const SEVERITY_CLASSES: Record<Severity, string> = {
  critical: 'severity-critical',
  high:     'severity-high',
  medium:   'severity-medium',
  low:      'severity-low',
};

function getSeverity(article: Article): Severity {
  const level = (article.impactLevel ?? '').toLowerCase();
  if (level === 'critical' || level === 'high') return 'critical';
  if (level === 'medium')                        return 'high';
  if (level === 'low')                           return 'medium';
  // Fallback: guess from niche
  if (article.niche === 'security') return 'high';
  return 'low';
}

function articleLink(a: Article) { return `/article/${a.slug ?? a.id ?? ''}`; }

export function ThreatIntelWidget({ articles }: ThreatIntelWidgetProps) {
  const threats = articles.filter((a) => a.niche === 'security' || a.impactLevel).slice(0, 5);

  return (
    <div className="bg-[#16161A] border border-[#27272A] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-[#FFB800]" />
          <h3 className="font-display font-bold text-sm text-white">Threat Intel</h3>
        </div>
        <Link to="/security" className="flex items-center gap-1 text-[10px] font-mono text-[#FFB800] hover:text-[#E6A500]">
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {threats.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono py-2">
          <AlertTriangle className="h-4 w-4" /> No active threats in feed
        </div>
      ) : (
        <ul className="space-y-2">
          {threats.map((article) => {
            const severity = getSeverity(article);
            return (
              <li key={article.id ?? article.slug}>
                <Link
                  to={articleLink(article)}
                  className="group flex items-start gap-2 hover:bg-[rgba(255,184,0,0.04)] -mx-1 px-1 py-1.5 transition-colors"
                >
                  <span className={`shrink-0 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 mt-0.5 ${SEVERITY_CLASSES[severity]}`}>
                    {severity}
                  </span>
                  <span className="text-xs text-zinc-400 group-hover:text-white line-clamp-2 transition-colors leading-snug">
                    {article.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
