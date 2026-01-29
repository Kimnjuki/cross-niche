/**
 * Homepage – news-style layout with main feed + sidebars.
 * Data from Convex; safe fallbacks so the page always displays (incl. after Coolify redeploy).
 */

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePublishedContent, useTrendingContent, useFeeds } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { mockArticles } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { LazyImage } from '@/components/ui/lazy-image';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { Clock, User, TrendingUp, Rss, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/timeUtils';
import type { Article } from '@/types';

const LOAD_TIMEOUT_MS = 2500;

const FEED_SLUGS = [
  { slug: 'innovate', label: 'Tech', path: '/tech' },
  { slug: 'secured', label: 'Security', path: '/security' },
  { slug: 'play', label: 'Gaming', path: '/gaming' },
];

function articleLink(article: Article) {
  return `/article/${article.slug || article.id}`;
}

export default function Index() {
  const { data: published, isLoading: loadingPublished } = usePublishedContent(24);
  const { data: trending, isLoading: loadingTrending } = useTrendingContent(6);
  const { data: feeds } = useFeeds();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  const hasConvexData = published && published.length > 0;
  const useFallback = timedOut && !hasConvexData;
  const articles: Article[] =
    hasConvexData && !useFallback
      ? mapContentToArticles(published)
      : mockArticles;

  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const trendingArticles: Article[] =
    trending && trending.length > 0 ? mapContentToArticles(trending) : sortedArticles.slice(0, 6);
  const topStory = sortedArticles[0];
  const mainFeed = sortedArticles.slice(1, 11);
  const isLoading = loadingPublished && !useFallback;

  return (
    <Layout>
      <SEOHead
        title="The Grid Nexus – Tech, Security & Gaming News"
        description="Breaking technology news, cybersecurity analysis, and gaming guides. One hub for tech, security, and gaming intelligence."
        keywords={[
          'tech news',
          'cybersecurity',
          'gaming news',
          'technology',
          'security threats',
          'gaming industry',
        ]}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      {/* Tagline strip */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <p className="text-center text-sm text-muted-foreground">
            Technology, Security & Gaming Intelligence · Breaking news, analysis, and guides
          </p>
        </div>
      </section>

      {/* Main: feed + sidebar */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main feed – 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero / Top story */}
            {topStory ? (
              <article className="rounded-xl overflow-hidden border border-border bg-card">
                <Link to={articleLink(topStory)} className="block group">
                  <div className="relative aspect-[2/1] overflow-hidden bg-muted">
                    <LazyImage
                      src={topStory.imageUrl}
                      alt={topStory.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/90 mb-2">
                        Top story
                      </span>
                      <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl line-clamp-2 group-hover:underline">
                        {topStory.title}
                      </h1>
                      <p className="text-sm text-white/90 mt-1 line-clamp-2">{topStory.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-white/80">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {topStory.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelativeTime(topStory.publishedAt)} · {topStory.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ) : isLoading ? (
              <Skeleton className="aspect-[2/1] w-full rounded-xl" />
            ) : null}

            {/* Latest feed */}
            <section aria-label="Latest stories">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground">Latest</h2>
                <Link
                  to="/blog-series"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              {isLoading ? (
                <ul className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i}>
                      <Skeleton className="h-24 w-full rounded-lg" />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  {mainFeed.map((article) => (
                    <li key={article.id}>
                      <ArticleCard article={article} variant="list" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Sidebar – 1/3 */}
          <aside className="space-y-6" aria-label="Sidebar">
            {/* Feed navigation */}
            <section className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <Rss className="h-4 w-4 text-muted-foreground" />
                Feeds
              </h3>
              <nav className="space-y-1">
                {feeds && feeds.length > 0
                  ? feeds.slice(0, 6).map((feed) => (
                      <Link
                        key={feed._id}
                        to={FEED_SLUGS.find((f) => f.slug === feed.slug)?.path ?? `/topics?q=${encodeURIComponent(feed.name)}`}
                        className="block py-2 text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {feed.name}
                      </Link>
                    ))
                  : FEED_SLUGS.map((f) => (
                      <Link
                        key={f.slug}
                        to={f.path}
                        className="block py-2 text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {f.label}
                      </Link>
                    ))}
              </nav>
            </section>

            {/* Trending */}
            <section className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Trending
              </h3>
              {loadingTrending ? (
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i}>
                      <Skeleton className="h-14 w-full rounded" />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {trendingArticles.slice(0, 5).map((article, i) => (
                    <li key={article.id}>
                      <Link
                        to={articleLink(article)}
                        className="flex gap-3 py-2 group text-sm"
                      >
                        <span className="text-muted-foreground font-mono w-5 shrink-0">{i + 1}</span>
                        <span className="line-clamp-2 group-hover:text-primary group-hover:underline">
                          {article.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Newsletter CTA */}
            <section className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-semibold text-sm text-foreground mb-2">Stay ahead</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Tech, security, and gaming intel — once a week.
              </p>
              <NewsletterForm variant="default" />
            </section>

            {/* Quick links */}
            <section className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Explore</h3>
              <div className="flex flex-wrap gap-2">
                <Link to="/tech" className="text-xs text-primary hover:underline">
                  Tech
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/security" className="text-xs text-primary hover:underline">
                  Security
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/gaming" className="text-xs text-primary hover:underline">
                  Gaming
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/blog-series" className="text-xs text-primary hover:underline">
                  All articles
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/guides" className="text-xs text-primary hover:underline">
                  Guides
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-muted/20 py-10">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="font-display font-bold text-xl text-foreground mb-2">The Grid Nexus</h2>
          <p className="text-sm text-muted-foreground mb-6">
            One hub for technology, cybersecurity, and gaming. No content-loading diagnostics — just the feed.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/about" className="text-primary hover:underline">About</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/contact" className="text-primary hover:underline">Contact</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/privacy" className="text-primary hover:underline">Privacy</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
