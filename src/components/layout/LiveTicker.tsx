import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { mapContentToArticles } from '@/lib/contentMapper';
import type { Article } from '@/types';
import type { ContentItem } from '@/hooks/useContent';
import { useLatestContent } from '@/hooks/useContent';

/**
 * TechCrunch-style live ticker for latest headlines.
 * High-density, horizontally scrolling list with niche accents.
 */
export function LiveTicker() {
  const { data: latest, isLoading } = useLatestContent(12);

  const articles: Article[] =
    Array.isArray(latest) && latest.length > 0
      ? mapContentToArticles(latest as ContentItem[])
      : [];

  const headlines = articles.slice(0, 5);

  if (!headlines.length && !isLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1 uppercase tracking-[0.18em] text-[10px] font-semibold text-cyan-300">
        <Zap className="h-3 w-3 text-cyan-400" />
        <span>Live Ticker</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-ticker-scroll">
          {(headlines.length ? headlines : Array.from({ length: 5 })).map((item, idx) => {
            if (!item) {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-muted-foreground/60"
                >
                  <span className="inline-block w-28 h-3 rounded-full bg-muted/40" />
                </span>
              );
            }

            const niche = item.niche ?? '';
            const nicheBadge =
              niche === 'security'
                ? '[SEC]'
                : niche === 'gaming'
                ? '[GAME]'
                : niche === 'tech'
                ? '[TECH]'
                : '';

            return (
              <Link
                key={item.id ?? item.slug ?? idx}
                to={`/article/${item.slug ?? item.id ?? ''}`}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                {nicheBadge && (
                  <span
                    className={
                      niche === 'security'
                        ? 'text-cyan-300'
                        : niche === 'gaming'
                        ? 'text-pink-400'
                        : 'text-emerald-300'
                    }
                  >
                    {nicheBadge}
                  </span>
                )}
                <span className="max-w-xs truncate">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

