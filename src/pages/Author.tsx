/**
 * Author page – profile and list of articles by author.
 * Author slug in URL (e.g. /author/jane-doe); articles filtered client-side from Convex published content.
 * E-E-A-T: Full bio, credentials, expertise, social proof, and Person schema for SEO.
 */

import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { authorSlug } from '@/lib/utils';
import { getAuthorProfile, defaultAuthorProfile } from '@/data/authorData';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  FileText,
  Briefcase,
  Award,
  ExternalLink,
  Mail,
  Newspaper,
  Users,
  BarChart3,
  ShieldCheck,
  Globe,
  Link as LinkIcon,
  BookOpen,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  const effectiveProfile = profile ?? defaultAuthorProfile;

  const seoDescription = effectiveProfile.bio
    ? `${effectiveProfile.bio.slice(0, 155)}...`
    : `Articles and reviews by ${authorDisplay} on The Grid Nexus.`;

  const verifiedSocials = effectiveProfile.sameAs?.filter((url) =>
    /twitter\.com|x\.com|linkedin\.com|youtube\.com|twitch\.tv|github\.com|scholar\.google\.com/i.test(
      url,
    ),
  );

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: effectiveProfile.name,
    jobTitle: effectiveProfile.jobTitle,
    description: effectiveProfile.bio,
    image: effectiveProfile.imageUrl,
    sameAs: effectiveProfile.sameAs,
    knowsAbout: effectiveProfile.expertise,
    publisher: {
      '@type': 'Organization',
      name: 'The Grid Nexus',
      url: 'https://thegridnexus.com',
    },
  };

  const popular = byAuthor
    .slice()
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 3);

  const totalViews = byAuthor.reduce((acc, a) => acc + (a.viewCount ?? 0), 0);
  const hasProfileImage = !!effectiveProfile.imageUrl;
  const hasExternalProfiles = !!effectiveProfile.sameAs?.length;

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
          <div className="flex h-28 w-28 flex-shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/10">
            {hasProfileImage ? (
              <img
                src={effectiveProfile.imageUrl}
                alt={effectiveProfile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-14 w-14 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display font-bold text-3xl text-foreground">
                {effectiveProfile.name}
              </h1>
              {effectiveProfile.jobTitle && (
                <Badge variant="topic" className="capitalize">
                  {effectiveProfile.jobTitle}
                </Badge>
              )}
            </div>

            {effectiveProfile.jobTitle && (
              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {effectiveProfile.jobTitle}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {byAuthor.length} article{byAuthor.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {totalViews.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                The Grid Nexus
              </span>
            </div>

            {effectiveProfile.bio && (
              <p className="mt-4 text-foreground/90 leading-relaxed max-w-2xl">
                {effectiveProfile.bio}
              </p>
            )}

            {effectiveProfile.expertise && effectiveProfile.expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Award className="h-4 w-4 text-muted-foreground self-center" />
                {effectiveProfile.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}

            {hasExternalProfiles && (
              <div className="mt-4 flex flex-wrap gap-2">
                {verifiedSocials?.map((url) => (
                  <Button key={url} variant="outline" size="sm" asChild>
                    <a href={url} target="_blank" rel="noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      {new URL(url).hostname.replace(/^www\./, '')}
                    </a>
                  </Button>
                ))}
                <Button variant="secondary" size="sm" asChild>
                  <Link to={`/article?author=${encodeURIComponent(authorDisplay)}`}>
                    <Newspaper className="h-4 w-4 mr-2" />
                    Latest articles
                  </Link>
                </Button>
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
            <Link to="/" className="text-primary hover:underline font-medium">
              Back to home
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {byAuthor.map((article, index) => (
                  <ArticleCard
                    key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((article, index) => (
                  <ArticleCard
                    key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
