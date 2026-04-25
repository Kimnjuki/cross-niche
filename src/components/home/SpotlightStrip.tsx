import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';
import { getPlaceholderByNiche, secureImageUrl } from '@/lib/placeholderImages';
import type { Article } from '@/types';

interface SpotlightStripProps {
  articles: Article[];
}

function articleLink(a: Article) { return `/article/${a.slug ?? a.id ?? ''}`; }

function safeTime(val: string | number | null | undefined): string {
  if (!val) return '';
  return typeof val === 'number'
    ? formatRelativeTime(new Date(val).toISOString())
    : formatRelativeTime(String(val));
}

export function SpotlightStrip({ articles }: SpotlightStripProps) {
  const [featured, ...stack] = articles.slice(0, 4);
  if (!featured) return null;

  const featuredImg = secureImageUrl(featured.imageUrl, getPlaceholderByNiche('security', featured.slug ?? featured.id));

  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
      <div className="container mx-auto px-4 max-w-7xl">

        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-[#00F0FF]" />
          <h2 className="font-display font-bold text-xl text-white">Security Spotlight</h2>
          <Link to="/security" className="ml-auto flex items-center gap-1 text-xs font-mono text-[#00F0FF] hover:text-[#00D4E6]">
            All security <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Featured left — 8 cols */}
          <Link
            to={articleLink(featured)}
            className="group lg:col-span-8 relative overflow-hidden border border-[#27272A] hover:border-[rgba(0,240,255,0.4)] transition-all duration-300 block"
            style={{ minHeight: '380px' }}
          >
            <img
              src={featuredImg}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            {/* Cyan verge-style overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,240,255,0.08)] to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <span className="niche-tag-security font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 w-fit mb-3">
                Security
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl line-clamp-3 group-hover:text-[#00F0FF] transition-colors leading-tight">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-sm text-zinc-300 mt-2 line-clamp-2">{featured.excerpt}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-xs font-mono text-zinc-400">
                <Clock className="h-3 w-3" />
                {safeTime(featured.publishedAt)}
                {featured.readTime && <span>· {featured.readTime}m read</span>}
              </div>
            </div>
          </Link>

          {/* Stacked right — 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {stack.slice(0, 3).map((article) => {
              const img = secureImageUrl(article.imageUrl, getPlaceholderByNiche('security', article.slug ?? article.id));
              return (
                <Link
                  key={article.id ?? article.slug}
                  to={articleLink(article)}
                  className="group flex gap-3 bg-[#16161A] border border-[#27272A] hover:border-[rgba(0,240,255,0.35)] p-3 flex-1 transition-all duration-200"
                >
                  <div className="w-20 h-20 shrink-0 overflow-hidden">
                    <img
                      src={img}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-xs text-white line-clamp-3 group-hover:text-[#00F0FF] transition-colors leading-snug">
                      {article.title}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-600 mt-1 block">
                      {safeTime(article.publishedAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
