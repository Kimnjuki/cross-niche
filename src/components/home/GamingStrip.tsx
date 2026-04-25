import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ChevronRight, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';
import { getPlaceholderByNiche, secureImageUrl } from '@/lib/placeholderImages';
import type { Article } from '@/types';

interface GamingStripProps {
  articles: Article[];
}

function articleLink(a: Article) { return `/article/${a.slug ?? a.id ?? ''}`; }

function safeTime(val: string | number | null | undefined): string {
  if (!val) return '';
  return typeof val === 'number'
    ? formatRelativeTime(new Date(val).toISOString())
    : formatRelativeTime(String(val));
}

export function GamingStrip({ articles }: GamingStripProps) {
  const items = articles.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
      <div className="container mx-auto px-4 max-w-7xl">

        <div className="flex items-center gap-2 mb-6">
          <Gamepad2 className="h-5 w-5 text-[#FF007A]" />
          <h2 className="font-display font-bold text-xl text-white">Gaming &amp; Esports</h2>
          <Link to="/gaming" className="ml-auto flex items-center gap-1 text-xs font-mono text-[#FF007A] hover:text-[#E6006D]">
            All gaming <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((article) => {
            const img = secureImageUrl(article.imageUrl, getPlaceholderByNiche('gaming', article.slug ?? article.id));
            return (
              <Link
                key={article.id ?? article.slug}
                to={articleLink(article)}
                className="group shrink-0 w-64 bg-[#16161A] border border-[#27272A] hover:border-[rgba(255,0,122,0.4)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,0,122,0.1)] flex flex-col"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={img}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] to-transparent opacity-60" />
                  <span className="absolute top-2 left-2 niche-tag-gaming font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                    Gaming
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col gap-1.5">
                  <h3 className="font-display font-bold text-xs text-white line-clamp-3 group-hover:text-[#FF007A] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-[11px] text-zinc-600 line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="mt-auto flex items-center gap-1 text-[10px] font-mono text-zinc-700">
                    <Clock className="h-3 w-3" />
                    {safeTime(article.publishedAt)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
