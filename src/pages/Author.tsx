/**
 * Author page – profile and list of articles by author.
 * Author slug in URL (e.g. /author/jane-doe); articles filtered client-side from Convex published content.
 */

import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { authorSlug } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { User, FileText } from 'lucide-react';
import type { Article } from '@/types';

function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function Author() {
  const { authorSlug: paramSlug } = useParams<{ authorSlug: string }>();
  const { data: published, isLoading } = usePublishedContent(100);

  const articles: Article[] =
    published && published.length > 0 ? mapContentToArticles(published) : [];
  const authorDisplay =
    paramSlug === 'anonymous' || !paramSlug
      ? 'Anonymous'
      : slugToDisplayName(paramSlug);
  const byAuthor = paramSlug
    ? articles.filter((a) => authorSlug(a.author) === paramSlug)
    : [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-24 w-64 mb-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${authorDisplay} | The Grid Nexus`}
        description={`Articles and reviews by ${authorDisplay}.`}
      />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              {authorDisplay}
            </h1>
            <p className="text-muted-foreground mt-1">
              {byAuthor.length} article{byAuthor.length !== 1 ? 's' : ''} on
              The Grid Nexus
            </p>
          </div>
        </header>

        {byAuthor.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-semibold text-lg mb-2">No articles yet</h2>
            <p className="text-muted-foreground mb-4">
              We don't have any articles by this author yet.
            </p>
            <Link
              to="/"
              className="text-primary hover:underline font-medium"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {byAuthor.map((article) => (
              <ArticleCard
                key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index}
                article={article}
                variant="default"
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
