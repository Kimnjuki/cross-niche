import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  columns?: 2 | 3 | 4;
}

export function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
