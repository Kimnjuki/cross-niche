/**
 * Homepage – news-style layout with main feed + sidebars.
 * Data from Convex; safe fallbacks so the page always displays (incl. after Coolify redeploy).
 */

import { Layout } from '@/components/layout/Layout';
import { usePublishedContent, useLatestContent, useTrendingContent, useFeeds, useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { mockArticles } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { LazyImage } from '@/components/ui/lazy-image';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { BreakingNewsSection } from '@/components/home/BreakingNewsSection';
import { MasterBentoHero } from '@/components/home/MasterBentoHero';
import { NewsFeed } from '@/components/news/NewsFeed';
import { LiveFeedWidget } from '@/components/home/LiveFeedWidget';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { SEOHead } from '@/components/seo/SEOHead';
import { LandingPageTracker } from '@/components/analytics/LandingPageTracker';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Clock, User, TrendingUp, Rss, ChevronRight, Star, TrendingUp as TrendingIcon, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/timeUtils';
import type { Article } from '@/types';

const FEED_SLUGS = [
  { slug: 'innovate', label: 'Tech', path: '/tech' },
  { slug: 'secured', label: 'Security', path: '/security' },
  { slug: 'play', label: 'Gaming', path: '/gaming' },
];

function articleLink(article: Article | null | undefined): string {
  if (!article) return '/';
  return `/article/${article.slug ?? article.id ?? ''}`;
}

function safeArticleId(article: Article | null | undefined): string {
  return (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';
}

/**
 * Homepage data checklist:
 * - Primary feed: all published/new articles (usePublishedContent) so all articles are visible.
 * - Sorted by publishedAt desc so newly added articles appear at the top.
 * - Breaking News: receives sortedArticles (newest first); component takes first maxItems.
 * - Hero/Slider (MasterBentoHero): topStory = sortedArticles[0] = newest article.
 * - Main feed list: mainFeed = sortedArticles.slice(1, 11) = next 10 newest.
 */
export default function Index() {
  const { data: published, isLoading: loadingPublished } = usePublishedContent(50);
  const { data: latest, isLoading: loadingLatest } = useLatestContent(20);
  const { data: trending, isLoading: loadingTrending } = useTrendingContent(12);
  const { data: feeds } = useFeeds();
  const { data: techFeed } = useContentByFeed('innovate', 10);
  const { data: securityFeed } = useContentByFeed('secured', 10);
  const { data: gamingFeed } = useContentByFeed('play', 10);

  // Debug logging (only in development)
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log('[Index] content query lengths:', {
      published: published?.length ?? '—',
      latest: latest?.length ?? '—',
      trending: trending?.length ?? '—',
      techFeed: techFeed?.length ?? '—',
      securityFeed: securityFeed?.length ?? '—',
      gamingFeed: gamingFeed?.length ?? '—',
    });
  }

  const hasPublishedData = published && published.length > 0;
  const articles: Article[] = hasPublishedData ? mapContentToArticles(published) : mockArticles;
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const trendingArticles: Article[] =
    trending && trending.length > 0 ? mapContentToArticles(trending) : sortedArticles.slice(0, 6);
  const latestArticles: Article[] =
    latest && latest.length > 0 ? mapContentToArticles(latest) : sortedArticles.slice(0, 10);
  const topStory = sortedArticles[0];
  const mainFeed = sortedArticles.slice(1, 11);
  const isLoading = hasPublishedData && loadingPublished;
  const techArticles: Article[] = techFeed && techFeed.length > 0 ? mapContentToArticles(techFeed) : sortedArticles.filter(a => a.niche === 'tech').slice(0, 3);
  const securityArticles: Article[] = securityFeed && securityFeed.length > 0 ? mapContentToArticles(securityFeed) : sortedArticles.filter(a => a.niche === 'security').slice(0, 3);
  const gamingArticles: Article[] = gamingFeed && gamingFeed.length > 0 ? mapContentToArticles(gamingFeed) : sortedArticles.filter(a => a.niche === 'gaming').slice(0, 3);

  return (
    <Layout showPulseSidebar={false}>
      <LandingPageTracker pageType="homepage" articlesViewed={sortedArticles.length} />
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

      {/* Tagline strip with RSS feeds */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Technology, Security & Gaming Intelligence · Breaking news, analysis, and guides
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="/rss.xml" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs"
                title="RSS Feed"
              >
                <Rss className="h-3 w-3" />
                RSS
              </a>
              <a 
                href="/tech/rss.xml" 
                className="text-muted-foreground hover:text-tech transition-colors text-xs"
                title="Tech RSS Feed"
              >
                Tech
              </a>
              <a 
                href="/security/rss.xml" 
                className="text-muted-foreground hover:text-security transition-colors text-xs"
                title="Security RSS Feed"
              >
                Security
              </a>
              <a 
                href="/gaming/rss.xml" 
                className="text-muted-foreground hover:text-gaming transition-colors text-xs"
                title="Gaming RSS Feed"
              >
                Gaming
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Breaking News Banner */}
      <section className="bg-red-50 border-b border-red-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <h2 className="text-red-800 font-bold text-lg">Breaking News Alert</h2>
            <p className="text-red-700 text-sm">Critical security updates and major tech announcements</p>
          </div>
        </div>
      </section>

      {/* Breaking news (The Hacker News / TechCrunch style) */}
      <BreakingNewsSection articles={sortedArticles} maxItems={6} />

      {/* Live Feed Widget */}
      <section className="border-b border-border bg-muted/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <LiveFeedWidget articles={sortedArticles.slice(0, 8)} maxItems={8} />
        </div>
      </section>

      {/* Grid Nexus 2026 – Master Bento Hero (5-cell dynamic grid) */}
      {topStory && (
        <section className="py-6 md:py-8">
          <MasterBentoHero
            mainStory={topStory}
            securityCell={
              securityArticles[0]
                ? {
                    article: securityArticles[0],
                    label: 'Secured',
                    badgeClass: 'bg-security/90 text-security-foreground',
                  }
                : undefined
            }
            gamingCell={
              gamingArticles[0]
                ? {
                    article: gamingArticles[0],
                    label: 'Play',
                    badgeClass: 'bg-gaming/90 text-gaming-foreground',
                  }
                : undefined
            }
            bottomLeft={
              sortedArticles[4]
                ? {
                    article: sortedArticles[4],
                    label: techArticles[1] ? 'Tech' : securityArticles[1] ? 'Security' : 'Gaming',
                    badgeClass: 'bg-tech/90 text-tech-foreground',
                  }
                : undefined
            }
            bottomRight={
              sortedArticles[5]
                ? {
                    article: sortedArticles[5],
                    label: gamingArticles[1] ? 'Gaming' : techArticles[1] ? 'Tech' : 'Security',
                    badgeClass: 'bg-gaming/90 text-gaming-foreground',
                  }
                : undefined
            }
          />
        </section>
      )}

      {/* Live Wire – API-ingested news feed */}
      <section className="border-b border-border bg-muted/5" aria-label="Live Wire news feed">
        <div className="container mx-auto px-4 max-w-7xl">
          <NewsFeed limit={9} title="Live Wire" showTitle />
        </div>
      </section>

      {/* Latest in Tech | Security | Gaming (three-column) */}
      <section className="border-b border-border bg-muted/10 py-8" aria-label="Latest by category">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="font-display font-bold text-lg mb-6 text-foreground">Latest by category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <Link to="/tech" className="font-semibold text-tech hover:underline mb-3 block">Tech</Link>
              <ul className="space-y-2">
                {(techArticles.length ? techArticles : sortedArticles.filter(a => a.niche === 'tech').slice(0, 3)).slice(0, 3).filter((a): a is Article => a != null).map((a, i) => (
                  <li key={safeArticleId(a) || i}>
                    <Link to={articleLink(a)} className="text-sm line-clamp-2 hover:text-primary hover:underline">{a.title}</Link>
                  </li>
                ))}
              </ul>
              <Link to="/tech" className="text-xs text-primary hover:underline mt-2 inline-block">View all →</Link>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <Link to="/security" className="font-semibold text-security hover:underline mb-3 block">Security</Link>
              <ul className="space-y-2">
                {(securityArticles.length ? securityArticles : sortedArticles.filter(a => a.niche === 'security').slice(0, 3)).slice(0, 3).filter((a): a is Article => a != null).map((a, i) => (
                  <li key={safeArticleId(a) || i}>
                    <Link to={articleLink(a)} className="text-sm line-clamp-2 hover:text-primary hover:underline">{a.title}</Link>
                  </li>
                ))}
              </ul>
              <Link to="/security" className="text-xs text-primary hover:underline mt-2 inline-block">View all →</Link>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <Link to="/gaming" className="font-semibold text-gaming hover:underline mb-3 block">Gaming</Link>
              <ul className="space-y-2">
                {(gamingArticles.length ? gamingArticles : sortedArticles.filter(a => a.niche === 'gaming').slice(0, 3)).slice(0, 3).filter((a): a is Article => a != null).map((a, i) => (
                  <li key={safeArticleId(a) || i}>
                    <Link to={articleLink(a)} className="text-sm line-clamp-2 hover:text-primary hover:underline">{a.title}</Link>
                  </li>
                ))}
              </ul>
              <Link to="/gaming" className="text-xs text-primary hover:underline mt-2 inline-block">View all →</Link>
            </div>
          </div>
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
              ) : mainFeed.filter((a): a is Article => a != null).length === 0 ? (
                <>
                  <p className="text-muted-foreground py-6 text-center">Stay tuned — new articles are on the way.</p>
                  <div className="rounded-lg border border-border bg-muted/30 p-6" aria-label="Browse categories">
                    <h3 className="font-semibold text-sm text-foreground mb-3">Browse Categories</h3>
                    <div className="flex flex-wrap gap-3">
                      <Link to="/tech" className="text-sm text-tech hover:underline">Tech</Link>
                      <span className="text-muted-foreground">·</span>
                      <Link to="/security" className="text-sm text-security hover:underline">Security</Link>
                      <span className="text-muted-foreground">·</span>
                      <Link to="/gaming" className="text-sm text-gaming hover:underline">Gaming</Link>
                      <span className="text-muted-foreground">·</span>
                      <Link to="/explore" className="text-sm text-primary hover:underline">All Articles</Link>
                    </div>
                  </div>
                </>
              ) : (
                <ul className="space-y-4">
                  {mainFeed.filter((a): a is Article => a != null).map((article, i) => (
                    <li key={safeArticleId(article) || i}>
                      <ArticleCard article={article} variant="list" />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Latest from the Community */}
            <section aria-label="Latest from the Community" className="mt-8">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">Latest from the Community</h2>
              {loadingLatest ? (
                <ul className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i}>
                      <Skeleton className="h-20 w-full rounded-lg" />
                    </li>
                  ))}
                </ul>
              ) : latestArticles.length === 0 ? (
                <>
                  <p className="text-muted-foreground py-6 text-center">No recent articles yet. Check back soon.</p>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-2">Browse Categories</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Link to="/tech" className="text-tech hover:underline">Tech</Link>
                      <span className="text-muted-foreground">·</span>
                      <Link to="/security" className="text-security hover:underline">Security</Link>
                      <span className="text-muted-foreground">·</span>
                      <Link to="/gaming" className="text-gaming hover:underline">Gaming</Link>
                      <span className="text-muted-foreground">·</span>
                      <Link to="/explore" className="text-primary hover:underline">All Articles</Link>
                    </div>
                  </div>
                </>
              ) : (
                <ul className="space-y-4">
                  {latestArticles.filter((a): a is Article => a != null).map((article, i) => (
                    <li key={safeArticleId(article) || i}>
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
                <Search className="h-4 w-4 text-muted-foreground" />
                Enhanced Search
              </h3>
              <EnhancedSearch 
                placeholder="Search articles, topics, authors..."
                onSearch={(query) => {
                  // Search functionality - navigate to search results
                  if (query.trim()) {
                    console.log('Search for:', query.trim());
                    // TODO: Implement search navigation
                  }
                }}
              />
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
              )               : (
                <ul className="space-y-2">
                  {trendingArticles.slice(0, 5).filter((a): a is Article => a != null).map((article, i) => (
                    <li key={safeArticleId(article) || i}>
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
    </Layout>
  );
}
