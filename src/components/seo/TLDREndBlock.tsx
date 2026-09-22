import { Eye, ListChecks } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function extractKeyPoints(content: string): string[] {
  if (!content) return [];
  const matches = content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  const points: string[] = [];
  for (const m of matches) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&\w+;/g, '').trim();
    if (text.length > 10 && text.length < 300) points.push(text);
  }
  return points.slice(0, 5);
}

function buildSummary(text: string): string {
  const cleaned = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const selected: string[] = [];
  let charCount = 0;
  for (const s of sentences) {
    if (s.length < 20) continue;
    selected.push(s);
    charCount += s.length;
    if (charCount > 450) break;
  }
  return selected.join(' ') || cleaned.slice(0, 400) + '…';
}

interface TLDREndBlockProps {
  content: string;
  articleTitle?: string;
  className?: string;
}

export function TLDREndBlock({ content, articleTitle, className }: TLDREndBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const keyPoints = extractKeyPoints(content);
  const summary = keyPoints.length >= 2 ? keyPoints.slice(0, 2).join(' ') : buildSummary(content);

  return (
    <section className={cn('border-t border-border pt-10 mb-12', className)} aria-label="Too Long; Didn't Read">
      <h2 className="sr-only">TL;DR — {articleTitle ?? 'Article Summary'}</h2>
      <div className="bg-muted/40 border border-border rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">TL;DR</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
            aria-expanded={expanded}
            aria-controls="tldr-expanded-content"
          >
            {expanded ? 'Show less' : 'Show more'}
            <Eye className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
        <div id="tldr-expanded-content" className={cn('overflow-hidden transition-all duration-200', expanded ? 'max-h-96' : 'max-h-24')}>
          <p className="text-sm text-foreground leading-relaxed">{summary}</p>
          {keyPoints.length > 2 && expanded && (
            <ul className="mt-3 space-y-1">
              {keyPoints.slice(2).map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ListChecks className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <meta property="extract" content={summary} />
      {keyPoints.length > 0 && <meta property="extract" content={keyPoints.join(' | ')} />}
    </section>
  );
}