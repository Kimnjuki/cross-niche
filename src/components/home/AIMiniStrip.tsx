import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ChevronRight, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';
import type { Article } from '@/types';

interface AIMiniItem {
  id?: string;
  title: string;
  category?: string;
  excerpt?: string;
  publishedAt?: string | number | null;
  slug?: string;
  href?: string;
}

interface AIMiniStripProps {
  items?: AIMiniItem[];
  articles?: Article[];
}

function safeTime(val: string | number | null | undefined): string {
  if (!val) return '';
  try {
    return typeof val === 'number'
      ? formatRelativeTime(new Date(val).toISOString())
      : formatRelativeTime(String(val));
  } catch { return ''; }
}

function itemHref(item: AIMiniItem): string {
  if (item.href) return item.href;
  if (item.slug) return `/article/${item.slug}`;
  return '/tech';
}

export function AIMiniStrip({ items = [], articles = [] }: AIMiniStripProps) {
  // Accept either dedicated AI items or fall back to tech articles
  const rawItems: AIMiniItem[] = items.length > 0
    ? items
    : articles.map((a) => ({
        id: a.id ?? a.slug,
        title: a.title,
        category: a.niche ?? 'AI',
        excerpt: a.excerpt,
        publishedAt: a.publishedAt,
        slug: a.slug,
      }));

  const display = rawItems.slice(0, 3);
  if (display.length === 0) return null;

  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
      <div className="container mx-auto px-4 max-w-7xl">

        <div className="flex items-center gap-2 mb-6">
          <Cpu className="h-5 w-5 text-[#B026FF]" />
          <h2 className="font-display font-bold text-xl text-white">AI &amp; Emerging Tech</h2>
          <Link to="/tech" className="ml-auto flex items-center gap-1 text-xs font-mono text-[#B026FF] hover:text-[#9D22E6]">
            All AI news <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {display.map((item, i) => (
            <Link
              key={item.id ?? i}
              to={itemHref(item)}
              className="group bg-[#16161A] border border-[#27272A] hover:border-[rgba(176,38,255,0.4)] p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-[0_0_20px_rgba(176,38,255,0.1)]"
            >
              <div className="flex items-center justify-between">
                <span className="niche-tag-ai font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                  {item.category ?? 'AI'}
                </span>
                {item.publishedAt && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
                    <Clock className="h-3 w-3" />
                    {safeTime(item.publishedAt)}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm text-white line-clamp-3 group-hover:text-[#B026FF] transition-colors leading-snug">
                {item.title}
              </h3>
              {item.excerpt && (
                <p className="text-[11px] text-zinc-600 line-clamp-2">{item.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
