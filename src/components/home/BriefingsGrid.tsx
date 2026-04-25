import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';
import { getPlaceholderByNiche, secureImageUrl } from '@/lib/placeholderImages';
import type { Article } from '@/types';

interface BriefingsGridProps {
  articles: Article[];
  title?: string;
}

const NICHE_TAG: Record<string, string> = {
  tech:     'niche-tag-tech',
  security: 'niche-tag-security',
  gaming:   'niche-tag-gaming',
  ai:       'niche-tag-ai',
};

function articleLink(a: Article) {
  return `/article/${a.slug ?? a.id ?? ''}`;
}

function safeTime(val: string | number | null | undefined): string {
  if (!val) return '';
  return typeof val === 'number'
    ? formatRelativeTime(new Date(val).toISOString())
    : formatRelativeTime(String(val));
}

export function BriefingsGrid({ articles, title = 'Latest Briefings' }: BriefingsGridProps) {
  const items = articles.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-white">{title}</h2>
          <Link to="/explore" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF] hover:text-[#00D4E6] transition-colors">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((article) => {
            const niche = article.niche ?? 'tech';
            const tagClass = NICHE_TAG[niche] ?? 'niche-tag-tech';
            const imgSrc = secureImageUrl(
              article.imageUrl,
              getPlaceholderByNiche(niche, article.slug ?? article.id)
            );

            return (
              <Link
                key={article.id ?? article.slug}
                to={articleLink(article)}
                className="group bg-[#16161A] border border-[#27272A] hover:border-[rgba(0,240,255,0.35)] flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={imgSrc}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] via-transparent to-transparent opacity-60" />
                  <span className={`absolute top-3 left-3 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${tagClass}`}>
                    {niche}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col gap-2 p-4">
                  <h3 className="font-display font-bold text-sm text-white line-clamp-2 group-hover:text-[#00F0FF] transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#27272A]">
                    <div className="flex items-center gap-1 text-zinc-600 text-[10px] font-mono">
                      <User className="h-3 w-3" />
                      {article.author ?? 'GridNexus'}
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime ?? 4}m
                      </span>
                      <span>{safeTime(article.publishedAt)}</span>
                    </div>
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
