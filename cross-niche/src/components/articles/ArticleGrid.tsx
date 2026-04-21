import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';
import type { ViewMode } from '@/components/ui/view-toggle';

interface ArticleGridProps {
  articles: Article[];
  columns?: 2 | 3 | 4;
  /** Ars / WIRED style: grid (cards), list (horizontal rows), compact (minimal rows) */
  viewMode?: ViewMode;
}

export function ArticleGrid({ articles, columns = 3, viewMode = 'grid' }: ArticleGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const cardVariant = viewMode === 'list' ? 'list' : viewMode === 'compact' ? 'compact' : 'default';

  if (viewMode === 'list' || viewMode === 'compact') {
    return (
      <div className="flex flex-col">
        {articles.map((article, index) => (
          <ArticleCard key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index} article={article} variant={cardVariant} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {articles.map((article, index) => (
        <ArticleCard key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index} article={article} variant={cardVariant} />
      ))}
    </div>
  );
}
