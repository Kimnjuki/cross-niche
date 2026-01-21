import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { TrendingUp } from 'lucide-react';

interface TrendingSectionProps {
  articles: Article[];
}

export function TrendingSection({ articles }: TrendingSectionProps) {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl">Trending Technology and Cybersecurity News</h2>
            <p className="text-muted-foreground text-sm">Most popular articles on artificial intelligence, machine learning, cybersecurity, cloud computing, and gaming</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-0">
            {articles.slice(0, 4).map((article, index) => (
              <div key={article.id} className="flex items-start gap-4">
                <span className="font-display font-bold text-4xl text-muted-foreground/30 w-8">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <ArticleCard article={article} variant="compact" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {articles.slice(4, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
