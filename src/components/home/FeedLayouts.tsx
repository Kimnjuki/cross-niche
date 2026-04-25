import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';
import { getPlaceholderByNiche, secureImageUrl } from '@/lib/placeholderImages';
import type { Article } from '@/types';

function articleLink(a: Article) { return `/article/${a.slug ?? a.id ?? ''}`; }
function safeTime(val: string | number | null | undefined): string {
  if (!val) return '';
  try {
    return typeof val === 'number'
      ? formatRelativeTime(new Date(val).toISOString())
      : formatRelativeTime(String(val));
  } catch { return ''; }
}

/* ─── Dense List (TechCrunch-style) ─────────────────────────────── */
export function DenseListFeed({ articles, title }: { articles: Article[]; title?: string }) {
  return (
    <div className="divide-y divide-[#27272A]">
      {title && (
        <h3 className="font-display font-bold text-sm text-white px-0 pb-3">{title}</h3>
      )}
      {articles.map((article) => {
        const niche = article.niche ?? 'tech';
        const img = secureImageUrl(article.imageUrl, getPlaceholderByNiche(niche, article.slug ?? article.id));
        return (
          <Link
            key={article.id ?? article.slug}
            to={articleLink(article)}
            className="group flex items-start gap-4 bg-[#16161A] hover:bg-[#1A1A1E] px-4 py-3 transition-colors"
          >
            <div className="w-20 h-16 shrink-0 overflow-hidden">
              <img src={img} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-semibold text-xs text-white line-clamp-2 group-hover:text-[#00F0FF] transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-zinc-600">
                <span>{niche.toUpperCase()}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{safeTime(article.publishedAt)}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author ?? 'GridNexus'}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Magazine Grid (Verge-style) ────────────────────────────────── */
export function MagazineGridFeed({ articles, title }: { articles: Article[]; title?: string }) {
  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-xl text-white">{title}</h3>
          <Link to="/explore" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF]">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, 9).map((article) => {
          const niche = article.niche ?? 'tech';
          const img = secureImageUrl(article.imageUrl, getPlaceholderByNiche(niche, article.slug ?? article.id));
          return (
            <Link
              key={article.id ?? article.slug}
              to={articleLink(article)}
              className="group bg-[#16161A] border border-[#27272A] hover:border-[rgba(0,240,255,0.35)] flex flex-col transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="overflow-hidden aspect-[16/9]">
                <img src={img} alt={article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
              </div>
              <div className="p-4">
                <span className={`niche-tag-${niche} font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 mb-2 inline-block`}>
                  {niche}
                </span>
                <h3 className="font-display font-bold text-sm text-white line-clamp-2 group-hover:text-[#00F0FF] transition-colors">{article.title}</h3>
                {article.excerpt && <p className="text-xs text-zinc-600 line-clamp-2 mt-1">{article.excerpt}</p>}
                <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-zinc-700">
                  <Clock className="h-3 w-3" /> {safeTime(article.publishedAt)}
                  {article.readTime && <span>· {article.readTime}m</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Timeline (Wired-style) ─────────────────────────────────────── */
export function TimelineFeed({ articles, title }: { articles: Article[]; title?: string }) {
  return (
    <div className="max-w-[720px] mx-auto">
      {title && <h3 className="font-display font-bold text-xl text-white mb-6">{title}</h3>}
      <div className="space-y-8">
        {articles.slice(0, 5).map((article) => (
          <Link
            key={article.id ?? article.slug}
            to={articleLink(article)}
            className="group block border-b border-[#27272A] hover:border-[#00F0FF] pb-8 transition-colors"
          >
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider block mb-2">
              {(article.niche ?? 'tech').toUpperCase()} · {safeTime(article.publishedAt)}
            </span>
            <h3 className="font-display font-bold text-xl text-white group-hover:text-[#00F0FF] transition-colors leading-snug mb-2">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 font-serif">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs font-mono text-zinc-700">
              <User className="h-3 w-3" /> {article.author ?? 'GridNexus'}
              {article.readTime && <span>· {article.readTime}m read</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
