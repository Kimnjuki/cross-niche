/**
 * Verge / Dark Reading / The Hacker News style: Latest Updates feed with category tabs.
 * Reverse chronological, category filtering, optional refresh indicator.
 */

import { useState } from 'react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

type LatestFilter = 'all' | 'tech' | 'security' | 'gaming';

const FILTERS: { value: LatestFilter; label: string }[] = [
  { value: 'all', label: 'Breaking News' },
  { value: 'tech', label: 'Tech' },
  { value: 'security', label: 'Security' },
  { value: 'gaming', label: 'Gaming' },
];

interface LatestUpdatesSectionProps {
  articles: Article[];
  /** Skip first N (e.g. top story already in hero) */
  skipFirst?: number;
  maxItems?: number;
}

export function LatestUpdatesSection({
  articles,
  skipFirst = 1,
  maxItems = 12,
}: LatestUpdatesSectionProps) {
  const [filter, setFilter] = useState<LatestFilter>('all');

  const filtered = articles
    .slice(skipFirst)
    .filter((a) => (filter === 'all' ? true : a.niche === filter))
    .slice(0, maxItems);

  return (
    <section className="py-10 bg-background border-b border-border" aria-labelledby="latest-updates-heading">
      <div className="container mx-auto px-4 max-w-[var(--container-max,1440px)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 id="latest-updates-heading" className="font-display font-bold text-h2">
            Latest Updates
          </h2>
          <Link
            to="/blog-series"
            className="text-primary hover:underline text-sm font-medium shrink-0"
            aria-label="View all articles"
          >
            View All →
          </Link>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as LatestFilter)} className="mb-6">
          <TabsList className="flex flex-wrap h-auto gap-2 p-1 bg-muted/50">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="rounded-lg px-4 py-2 text-sm">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Tabs>

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No articles in this category yet.</p>
        )}
      </div>
    </section>
  );
}
