/**
 * Author page – profile and list of articles by author.
 * Author slug in URL (e.g. /author/jane-doe); articles filtered client-side from Convex published content.
 * E-E-A-T: Full bio, credentials, expertise, and Person schema for SEO.
 */

import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { authorSlug } from '@/lib/utils';
import { getAuthorProfile } from '@/data/authorData';
import { Skeleton } from '@/components/ui/skeleton';
import { User, FileText, Briefcase, Award } from 'lucide-react';
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

  const profile = paramSlug ? getAuthorProfile(paramSlug) : null;

  const seoDescription = profile?.bio
    ? `${profile.bio.slice(0, 155)}...`
    : `Articles and reviews by ${authorDisplay} on The Grid Nexus.`;

  const personSchema = profile
    ? {
        name: profile.name,
        jobTitle: profile.jobTitle,
        description: profile.bio,
        imageUrl: profile.imageUrl,
        sameAs: profile.sameAs,
        expertise: profile.expertise,
      }
    : undefined;

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
        description={seoDescription}
        person={personSchema}
      />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            {profile?.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={authorDisplay}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-3xl text-foreground">
              {authorDisplay}
            </h1>
            {profile?.jobTitle && (
              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {profile.jobTitle}
              </p>
            )}
            <p className="text-muted-foreground mt-1">
              {byAuthor.length} article{byAuthor.length !== 1 ? 's' : ''} on
              The Grid Nexus
            </p>
            {profile?.bio && (
              <p className="mt-4 text-foreground/90 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}
            {profile?.expertise && profile.expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Award className="h-4 w-4 text-muted-foreground self-center" />
                {profile.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}
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
          <>
            <h2 className="font-display font-semibold text-xl mb-4">Articles by {authorDisplay}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {byAuthor.map((article, index) => (
                <ArticleCard
                  key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index}
                  article={article}
                  variant="default"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
