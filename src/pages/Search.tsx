import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar, type SearchFilters } from '@/components/search/SearchBar';
import { DifficultyLevelFilter, type DifficultyLevel } from '@/components/filters/DifficultyLevelFilter';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { useSearch } from '@/hooks/useSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Search() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    niches: [],
    dateRange: 'all',
    sortBy: 'relevance',
  });
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);

  const { results, isLoading, count } = useSearch(query, filters);
  
  // Filter by difficulty level if selected
  const filteredResults = difficultyLevels.length > 0
    ? results.filter(article => {
        // This would come from article metadata in production
        // For now, we'll use a simple heuristic based on readTime
        const articleDifficulty: DifficultyLevel = 
          article.readTime <= 5 ? 'beginner' :
          article.readTime <= 10 ? 'intermediate' :
          article.readTime <= 15 ? 'advanced' : 'expert';
        return difficultyLevels.includes(articleDifficulty);
      })
    : results;

  const handleSearch = (searchQuery: string, searchFilters: SearchFilters) => {
    setQuery(searchQuery);
    setFilters(searchFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Find articles across all niches
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar onSearch={handleSearch} />
          <div>
            <p className="text-sm font-medium mb-2">Difficulty Level</p>
            <DifficultyLevelFilter
              selectedLevels={difficultyLevels}
              onLevelsChange={setDifficultyLevels}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : query.trim() || filters.niches.length > 0 || filters.dateRange !== 'all' ? (
          <div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
                {difficultyLevels.length > 0 && ` (filtered by difficulty)`}
              </p>
            </div>
            {filteredResults.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No articles found matching your search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Enter a search query or apply filters to find articles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

