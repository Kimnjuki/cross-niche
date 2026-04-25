import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '@/types';

interface BreakingNewsTickerProps {
  articles: Article[];
}

function articleLink(article: Article): string {
  return `/article/${article.slug ?? article.id ?? ''}`;
}

export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
  if (!articles || articles.length === 0) return null;

  const items = [...articles, ...articles]; // double for seamless loop

  return (
    <div
      className="w-full bg-[#FF007A] overflow-hidden flex items-center"
      style={{ height: '40px' }}
      aria-label="Breaking news ticker"
    >
      {/* Static label */}
      <div className="shrink-0 flex items-center gap-2 px-4 bg-black h-full z-10 border-r border-[rgba(255,255,255,0.2)]">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="font-mono text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
          Breaking
        </span>
      </div>

      {/* Scrolling items */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          {items.map((article, i) => (
            <React.Fragment key={`${article.id ?? article.slug}-${i}`}>
              <Link
                to={articleLink(article)}
                className="font-mono text-white text-xs hover:text-black hover:bg-white px-1 py-0.5 transition-colors whitespace-nowrap"
              >
                {article.title}
              </Link>
              <span className="font-mono text-white/50 text-xs px-4">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
