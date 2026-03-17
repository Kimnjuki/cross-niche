/**
 * Homepage – Editorial layout inspired by Wired, Ars Technica, The Verge.
 * Structure: compact top bar → breaking (if any) → hero (lead + security sidebar) →
 * Latest card grid → By topic (Tech/Security/Gaming) → Live Wire / NewsGrid →
 * More stories list + sidebar (Search, Trending, Newsletter).
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  Search,
  TrendingUp,
  ChevronRight,
  User,
  Clock,
  Rss,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO } from '@/components/SEO';
import { LandingPageTracker } from '@/components/analytics/LandingPageTracker';
import { BreakingNewsSection } from '@/components/home/BreakingNewsSection';
import { LiveFeedWidget } from '@/components/home/LiveFeedWidget';
import { NewsFeed } from '@/components/news/NewsFeed';
import { NewsGrid } from '@/components/news/NewsGrid';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOverlay } from '@/components/ui/ImageOverlay';
import { formatRelativeTime } from '@/lib/timeUtils';
import { mapContentToArticles } from '@/lib/contentMapper';
import { getPlaceholderByNiche, secureImageUrl } from '@/lib/placeholderImages';
import type { Article } from '@/types';
import type { ContentItem } from '@/hooks/useContent';
import {
  useAllPublishedContent,
  useLatestContent,
  useTrendingContent,
  useFeeds,
  useContentByFeed,
} from '@/hooks/useContent';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { getPageMetadata } from '@/lib/seo/pageMetadata';

const FEED_SLUGS = [
  { slug: 'innovate', label: 'Tech', path: '/tech' },
  { slug: 'secured', label: 'Security', path: '/security' },
  { slug: 'play', label: 'Gaming', path: '/gaming' },
];

const PINNED_SLUGS = [
  'neuromorphic-chip-robotic-vision-2026',
  'microsoft-10000-year-data-storage',
  'ai-spending-forecast-2026',
];

function articleLink(article: Article | null | undefined): string {
  if (!article) return '/';
  return `/article/${article.slug ?? article.id ?? ''}`;
}

function safeArticleId(article: Article | null | undefined): string {
  return (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';
}

/**
 * Homepage: published content sorted by publishedAt desc (newest first).
 * Hero = top story, main feed = next 10, sidebar = trending + search + newsletter.
 */
export default function Index() {
  const navigate = useNavigate();
  // Same source as Explore: Convex content table via listAll (full extent)
  const { data: allContent, isLoading: loadingPublished } = useAllPublishedContent(150);
  const { data: latest, isLoading: loadingLatest } = useLatestContent(10);
  const { data: trending, isLoading: loadingTrending } = useTrendingContent(6);
  const { data: feeds } = useFeeds();
  const { data: techFeed } = useContentByFeed('innovate', 3);
  const { data: securityFeed } = useContentByFeed('secured', 3);
  const { data: gamingFeed } = useContentByFeed('play', 3);

  const liveWireArticles = useQuery(api.articles.getLatestFeed, {});
  const liveWireExcludeUrls: string[] = Array.isArray(liveWireArticles)
    ? liveWireArticles.slice(0, 9).map((a: { url?: string }) => String(a?.url ?? '')).filter(Boolean)
    : [];

  const hasPublishedData = Array.isArray(allContent) && allContent.length > 0;
  const articles: Article[] = hasPublishedData ? mapContentToArticles(allContent as ContentItem[]) : [];

  const getPinRank = (article: Article): number => {
    const key = article.slug ?? article.id ?? '';
    const index = PINNED_SLUGS.indexOf(key);
    return index === -1 ? PINNED_SLUGS.length : index;
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const pa = getPinRank(a);
    const pb = getPinRank(b);
    if (pa !== pb) return pa - pb;

    const aTime = a.publishedAt != null ? new Date(a.publishedAt as string | number).getTime() : 0;
    const bTime = b.publishedAt != null ? new Date(b.publishedAt as string | number).getTime() : 0;
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });

  const trendingArticles: Article[] =
    Array.isArray(trending) && trending.length > 0 ? mapContentToArticles(trending as ContentItem[]) : sortedArticles.slice(0, 3);
  const latestArticles: Article[] =
    Array.isArray(latest) && latest.length > 0 ? mapContentToArticles(latest as ContentItem[]) : sortedArticles.slice(0, 3);
  const topStory = sortedArticles[0];
  const mainFeed = sortedArticles.slice(1, 4);
  const isLoading = loadingPublished;
  const techArticles: Article[] = Array.isArray(techFeed) && techFeed.length ? mapContentToArticles(techFeed as ContentItem[]) : sortedArticles.filter(a => a.niche === 'tech').slice(0, 2);
  const securityArticles: Article[] = Array.isArray(securityFeed) && securityFeed.length ? mapContentToArticles(securityFeed as ContentItem[]) : sortedArticles.filter(a => a.niche === 'security').slice(0, 2);
  const gamingArticles: Article[] = Array.isArray(gamingFeed) && gamingFeed.length ? mapContentToArticles(gamingFeed as ContentItem[]) : sortedArticles.filter(a => a.niche === 'gaming').slice(0, 2);

  const showEmptyState = !isLoading && sortedArticles.length === 0;
  const homeMeta = getPageMetadata('/');

  if (showEmptyState) {
    return (
      <Layout showPulseSidebar={false}>
        <SEO
          title={homeMeta.title}
          description={homeMeta.description}
          canonical="https://thegridnexus.com/"
          ogType="website"
        />
        <section className="border-b border-border/50 bg-muted/30">
          <div className="container mx-auto px-4 py-3 max-w-7xl">
            <p className="text-center text-sm text-muted-foreground">
              Technology, Security & Gaming Intelligence
            </p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16 max-w-7xl text-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Welcome to The Grid Nexus
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Articles from Convex will appear here. Explore by topic or check back soon.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tech" className="px-4 py-2 rounded-lg bg-tech/10 text-tech font-medium hover:bg-tech/20">Tech</Link>
            <Link to="/security" className="px-4 py-2 rounded-lg bg-security/10 text-security font-medium hover:bg-security/20">Security</Link>
            <Link to="/gaming" className="px-4 py-2 rounded-lg bg-gaming/10 text-gaming font-medium hover:bg-gaming/20">Gaming</Link>
            <Link to="/news" className="px-4 py-2 rounded-lg border border-border font-medium hover:bg-muted">News</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout showPulseSidebar={false}>
      <LandingPageTracker pageType="homepage" articlesViewed={sortedArticles.length} />
      <SEO
        title={homeMeta.title}
        description={homeMeta.description}
        canonical="https://thegridnexus.com/"
        ogType="website"
      />
      <SEOHead
        title={homeMeta.title}
        description={homeMeta.description}
        keywords={['tech news', 'cybersecurity', 'gaming news', 'technology', 'security threats', 'gaming industry']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      {/* Compact top bar: tagline + nav (Ars/Verge-style) */}
      <header className="border-b border-border/50 bg-muted/30" aria-label="Site tagline and navigation">
        <div className="container mx-auto px-4 py-2.5 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Technology, Security & Gaming Intelligence
            </p>
            <nav className="flex items-center gap-4" aria-label="Categories and tools">
              <Link to="/tech" className="text-xs font-medium text-muted-foreground hover:text-tech transition-colors">Tech</Link>
              <Link to="/security" className="text-xs font-medium text-muted-foreground hover:text-security transition-colors">Security</Link>
              <Link to="/gaming" className="text-xs font-medium text-muted-foreground hover:text-gaming transition-colors">Gaming</Link>
              <Link to="/news" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">News</Link>
              <a href="/sitemap.xml" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs" title="Sitemap">
                <Rss className="h-3 w-3" />
                Sitemap
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile: Quick explore above the fold */}
      <section className="md:hidden border-b border-border/50 bg-background" aria-label="Quick explore">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="grid grid-cols-3 gap-2">
            <Link to="/tech" className="min-h-[44px] flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-2 py-2.5 text-xs font-semibold text-tech hover:bg-tech/10 transition-colors">
              Tech <ChevronRight className="h-3 w-3 shrink-0" />
            </Link>
            <Link to="/security" className="min-h-[44px] flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-2 py-2.5 text-xs font-semibold text-security hover:bg-security/10 transition-colors">
              Security <ChevronRight className="h-3 w-3 shrink-0" />
            </Link>
            <Link to="/gaming" className="min-h-[44px] flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-2 py-2.5 text-xs font-semibold text-gaming hover:bg-gaming/10 transition-colors">
              Gaming <ChevronRight className="h-3 w-3 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <BreakingNewsSection articles={sortedArticles.filter((a) => a.impactLevel === 'high')} maxItems={6} />

      {/* Hero: Lead story + sidebar (Verge/Wired – editorial first) */}
      {topStory && (
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Featured story – spans 8 columns, 600px height on desktop */}
              <article className="md:col-span-8 h-[420px] md:h-[600px]">
                <Link to={articleLink(topStory)} className="block h-full group">
                  <ImageOverlay
                    src={secureImageUrl(topStory.imageUrl, getPlaceholderByNiche(topStory.niche ?? 'tech', topStory.slug ?? topStory.id))}
                    alt={topStory.title}
                    width={960}
                    height={600}
                    aspectRatio="16/9"
                    className="h-full"
                  >
                    <div className="pointer-events-auto text-white space-y-2">
                      <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-cyan-300">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                        Featured Intelligence
                      </span>
                      <h1 className="font-display font-extrabold text-2xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg line-clamp-2">
                        <span className="text-transparent bg-clip-text gradient-nexus-intelligence">
                          {topStory.title}
                        </span>
                      </h1>
                      <p className="text-sm md:text-base text-white/85 max-w-2xl line-clamp-3">
                        {topStory.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs text-white/80">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {topStory.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelativeTime(
                            typeof topStory.publishedAt === 'number'
                              ? new Date(topStory.publishedAt).toISOString()
                              : String(topStory.publishedAt ?? '')
                          )}{' '}
                          · {topStory.readTime ?? 5} min read
                        </span>
                      </div>
                    </div>
                  </ImageOverlay>
                </Link>
              </article>

              {/* Security Alerts stack – spans 4 columns, 3 cards tall */}
              <aside className="md:col-span-4 h-[420px] md:h-[600px] grid grid-rows-3 gap-4">
                {(securityArticles.length
                  ? securityArticles
                  : sortedArticles.filter((a) => a.niche === 'security')
                )
                  .slice(0, 3)
                  .map((alert, index) => (
                    <Link
                      key={safeArticleId(alert) || index}
                      to={articleLink(alert)}
                      className="group relative flex flex-col justify-between overflow-hidden bg-card border border-border rounded-none px-4 py-3 hover:border-security hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-colors duration-200"
                      aria-label={`Security alert: ${alert.title}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-cyan-300 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                          Security Alert
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatRelativeTime(
                            typeof alert.publishedAt === 'number'
                              ? new Date(alert.publishedAt).toISOString()
                              : String(alert.publishedAt ?? '')
                          )}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-security transition-colors">
                        {alert.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {alert.excerpt}
                      </p>
                    </Link>
                  ))}
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* Latest: card grid (Verge-style) – stories 2–7 excluding hero */}
      {sortedArticles.slice(1, 7).filter((a): a is Article => a != null).length > 0 && (
        <section className="border-b border-border bg-background py-8" aria-label="Latest stories">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-foreground">Latest</h2>
              <Link to="/explore" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.slice(1, 7).filter((a): a is Article => a != null).map((article, i) => (
                <ArticleCard key={safeArticleId(article) || i} article={article} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest by category – unified cards (Ars-style) */}
      <section className="border-b border-border bg-muted/5 py-8" aria-label="Latest by category">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="font-display font-bold text-xl text-foreground mb-6">By topic</h2>
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

      <section className="border-b border-border bg-muted/5" aria-label="Live Wire news feed">
        <div className="container mx-auto px-4 max-w-7xl">
          <LiveFeedWidget articles={sortedArticles.slice(0, 8)} maxItems={8} />
        </div>
      </section>

      <section className="border-b border-border bg-muted/5" aria-label="Live Wire">
        <div className="container mx-auto px-4 max-w-7xl">
          <NewsFeed limit={9} title="Live Wire" showTitle />
        </div>
      </section>

      <section className="border-b border-border bg-background" aria-label="Nexus Intelligence grid">
        <div className="container mx-auto px-4 max-w-7xl">
          <NewsGrid limit={12} excludeUrls={liveWireExcludeUrls} />
        </div>
      </section>

      {/* Full extent: all Convex content (same as Explore page) */}
      {sortedArticles.length > 0 && (
        <section className="border-b border-border bg-muted/5 py-10" aria-label="All articles from the grid">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-foreground">All articles</h2>
              <Link to="/explore" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Explore all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <ArticleGrid articles={sortedArticles} columns={3} viewMode="grid" />
            <div className="mt-6 text-center">
              <Link to="/explore" className="text-sm font-medium text-primary hover:underline">
                View full archive on Explore →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main + sidebar: More stories list + Search / Trending / Newsletter (Ars-style) */}
      <div className="container-tokens container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section aria-label="More stories">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">More stories</h2>
              {isLoading ? (
                <ul className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i}><Skeleton className="h-24 w-full rounded-lg" /></li>
                  ))}
                </ul>
              ) : sortedArticles.slice(4, 12).filter((a): a is Article => a != null).length === 0 ? (
                <p className="text-muted-foreground py-6">More articles will appear here as we publish.</p>
              ) : (
                <ul className="space-y-4">
                  {sortedArticles.slice(4, 12).filter((a): a is Article => a != null).map((article, i) => (
                    <li key={safeArticleId(article) || i}>
                      <ArticleCard article={article} variant="list" />
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6">
                <Link to="/explore" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  View all articles <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-6" aria-label="Sidebar">
            <section className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                Search
              </h3>
              <EnhancedSearch
                placeholder="Search articles, topics, authors..."
                onSearch={(query) => {
                  if (query.trim()) navigate(`/topics?q=${encodeURIComponent(query.trim())}`);
                }}
              />
              <nav className="space-y-1 mt-3">
                {feeds?.length
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
                      <Link key={f.slug} to={f.path} className="block py-2 text-sm text-muted-foreground hover:text-foreground hover:underline">
                        {f.label}
                      </Link>
                    ))}
              </nav>
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Trending
              </h3>
              {loadingTrending ? (
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i}><Skeleton className="h-14 w-full rounded" /></li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {trendingArticles.slice(0, 5).filter((a): a is Article => a != null).map((article, i) => (
                    <li key={safeArticleId(article) || i}>
                      <Link to={articleLink(article)} className="flex gap-3 py-2 group text-sm">
                        <span className="text-muted-foreground font-mono w-5 shrink-0">{i + 1}</span>
                        <span className="line-clamp-2 group-hover:text-primary group-hover:underline">{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-semibold text-sm text-foreground mb-2">Stay ahead</h3>
              <p className="text-xs text-muted-foreground mb-3">Tech, security, and gaming intel — once a week.</p>
              <NewsletterForm variant="default" />
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Explore</h3>
              <div className="flex flex-wrap gap-2">
                <Link to="/tech" className="text-xs text-primary hover:underline">Tech</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/security" className="text-xs text-primary hover:underline">Security</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/gaming" className="text-xs text-primary hover:underline">Gaming</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/topics" className="text-xs text-primary hover:underline">Topics</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/tutorials" className="text-xs text-primary hover:underline">Tutorials</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/blog-series" className="text-xs text-primary hover:underline">Blog Series</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/explore" className="text-xs text-primary hover:underline">All Articles</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
