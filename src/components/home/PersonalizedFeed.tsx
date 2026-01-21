import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, TrendingUp, Target, Zap } from 'lucide-react';
import { personalizationEngine } from '@/lib/ai/personalization';
import { mockArticles } from '@/data/mockData';
import { Article, PersonalizedFeed as PersonalizedFeedType } from '@/types';
import { Link } from 'react-router-dom';

interface PersonalizedFeedProps {
  userId?: string;
  maxArticles?: number;
}

export function PersonalizedFeed({ userId = 'demo-user', maxArticles = 6 }: PersonalizedFeedProps) {
  const [personalizedFeed, setPersonalizedFeed] = useState<PersonalizedFeedType | null>(null);

  const { data: feed, isLoading, error } = useQuery({
    queryKey: ['personalized-feed', userId],
    queryFn: async () => {
      // Generate personalized recommendations
      const feed = personalizationEngine.generatePersonalizedFeed(userId, mockArticles);

      // Get full article data for recommended articles
      const recommendedArticles = feed.recommendations
        .slice(0, maxArticles)
        .map(rec => {
          const article = mockArticles.find(a => a.id === rec.articleId);
          return article ? { ...article, recommendationScore: rec.score, reason: rec.reason } : null;
        })
        .filter(Boolean) as (Article & { recommendationScore: number; reason: string })[];

      return {
        ...feed,
        articles: recommendedArticles,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (feed) {
      setPersonalizedFeed(feed);
    }
  }, [feed]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">For You</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load personalized content. Showing trending articles instead.</p>
      </div>
    );
  }

  const articles = feed?.articles || [];

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'behavior':
        return <Target className="h-3 w-3" />;
      case 'trending':
        return <TrendingUp className="h-3 w-3" />;
      case 'semantic':
        return <Zap className="h-3 w-3" />;
      default:
        return <Target className="h-3 w-3" />;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'behavior':
        return 'Based on your interests';
      case 'trending':
        return 'Trending now';
      case 'semantic':
        return 'Related content';
      default:
        return 'Recommended for you';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">For You</h2>
        </div>
        <Badge variant="secondary" className="text-xs">
          AI-Powered Recommendations
        </Badge>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No personalized recommendations available. Start reading articles to get better suggestions!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-xs capitalize">
                    {article.niche}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getReasonIcon(article.reason)}
                    <span>{getReasonLabel(article.reason)}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  <Link to={`/article/${article.id}`} className="hover:text-primary transition-colors">
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime} min read</span>
                  </div>
                  <div className="flex gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {Math.round(article.recommendationScore * 100)}% match
                  </span>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/article/${article.id}`}>
                      Read More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {articles.length > 0 && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/feed">
              View All Recommendations
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}