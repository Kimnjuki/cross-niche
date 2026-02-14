/**
 * NewsFeed – Live Wire
 * Dual-source feed: NewsAPI + GNews (articles.getLatestFeed) with fallback to content listIngestedNews.
 */

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Clock, ExternalLink } from 'lucide-react';
import { formatCompactRelativeTime } from '@/lib/timeUtils';
import { LazyImage } from '@/components/ui/lazy-image';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { cn } from '@/lib/utils';

interface NewsItem {
  _id: string;
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  publishedAt?: number | null;
  featured_image_url?: string | null;
  source?: string | null;
  isAutomated?: boolean;
  originalUrl?: string | null;
  feed_name?: string;
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const href = item.originalUrl || `/article/${item.slug}`;
  const isExternal = !!item.originalUrl;
  const timeStr = formatCompactRelativeTime(
    item.published_at ?? (item.publishedAt ? new Date(item.publishedAt).toISOString() : null)
  );

  const content = (
    <>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {item.source && (
            <Badge variant="secondary" className="text-xs font-medium">
              via {item.source}
            </Badge>
          )}
          {item.isAutomated && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Bot className="h-3 w-3" />
              Automated
            </Badge>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeStr}
          </span>
        </div>
        <CardTitle className="text-base line-clamp-2 leading-snug">
          {item.title}
        </CardTitle>
        {item.excerpt && (
          <CardDescription className="line-clamp-2 text-sm">
            {item.excerpt}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {item.featured_image_url && (
          <div className="rounded-md overflow-hidden aspect-video mb-3">
            <LazyImage
              src={item.featured_image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        {item.feed_name && (
          <span className="text-xs text-muted-foreground">{item.feed_name}</span>
        )}
        {isExternal && (
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </CardFooter>
    </>
  );

  if (isExternal) {
    return (
      <Card
        key={item._id}
        className={cn(
          'group overflow-hidden transition-all hover:shadow-md hover:border-primary/20',
          index === 0 && 'md:col-span-2'
        )}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      </Card>
    );
  }

  return (
    <Card
      key={item._id}
      className={cn(
        'group overflow-hidden transition-all hover:shadow-md hover:border-primary/20',
        index === 0 && 'md:col-span-2'
      )}
    >
      <Link to={`/article/${item.slug}`} className="block">
        {content}
      </Link>
    </Card>
  );
}

function NewsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

interface NewsFeedProps {
  limit?: number;
  className?: string;
  title?: string;
  showTitle?: boolean;
}

/** Map Convex articles table row to NewsItem (external link). */
function articleToNewsItem(doc: {
  _id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  imageUrl?: string;
  publishedAt: number;
}): NewsItem {
  const id = String(doc._id);
  return {
    _id: id,
    id,
    title: doc.title,
    slug: doc._id,
    excerpt: doc.summary ?? '',
    publishedAt: doc.publishedAt,
    featured_image_url: doc.imageUrl ?? null,
    source: doc.source,
    isAutomated: true,
    originalUrl: doc.url,
  };
}

export function NewsFeed({
  limit = 12,
  className,
  title = 'Live Wire',
  showTitle = true,
}: NewsFeedProps) {
  const isConvexDisabled = useConvexDisabled();
  const articlesFeed = useQuery(
    api.articles.getLatestFeed,
    isConvexDisabled ? 'skip' : {}
  );
  const contentFeed = useQuery(
    api.content.listIngestedNews,
    isConvexDisabled ? 'skip' : { limit }
  );
  const publishedContent = useQuery(
    api.content.getPublishedContent,
    isConvexDisabled ? 'skip' : { limit: limit * 2 }
  );

  const fromArticles: NewsItem[] = (articlesFeed ?? []).slice(0, limit).map(articleToNewsItem);
  const fromIngested: NewsItem[] = (contentFeed ?? []) as NewsItem[];
  const fromPublished = (publishedContent ?? []).map((d: Record<string, unknown>) => ({
    _id: d._id ?? d.id,
    id: String(d._id ?? d.id),
    title: String(d.title ?? ''),
    slug: String(d.slug ?? ''),
    excerpt: d.summary != null ? String(d.summary) : null,
    published_at: d.publishedAt != null ? new Date(Number(d.publishedAt)).toISOString() : null,
    publishedAt: d.publishedAt != null ? Number(d.publishedAt) : null,
    featured_image_url: d.featuredImageUrl != null ? String(d.featuredImageUrl) : null,
    source: d.source != null ? String(d.source) : null,
    isAutomated: false,
    originalUrl: null,
    feed_name: undefined,
  })) as NewsItem[];

  const seen = new Set<string>();
  const merged: NewsItem[] = [];
  for (const item of [...fromArticles, ...fromIngested]) {
    const key = item.originalUrl || item.slug || item._id;
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(item);
      if (merged.length >= limit) break;
    }
  }
  if (merged.length < limit && fromPublished.length) {
    for (const item of fromPublished) {
      const key = item.slug || item._id;
      if (key && !seen.has(key)) {
        seen.add(key);
        merged.push(item);
        if (merged.length >= limit) break;
      }
    }
  }
  const items: NewsItem[] = merged;

  if (isConvexDisabled) {
    return (
      <section className={cn('py-8', className)}>
        {showTitle && (
          <h2 className="font-display font-bold text-2xl mb-6">{title}</h2>
        )}
        <p className="text-muted-foreground text-sm py-8 text-center">
          News feed requires Convex connection. Enable VITE_CONVEX_URL to see ingested headlines.
        </p>
      </section>
    );
  }

  const isLoading =
    articlesFeed === undefined &&
    contentFeed === undefined &&
    publishedContent === undefined;
  const newsItems = items;

  return (
    <section className={cn('py-8', className)}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-display font-bold text-2xl">{title}</h2>
          <Badge variant="outline" className="text-xs font-normal">
            Real-time
          </Badge>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : newsItems.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No news yet. Add NEWS_API_KEY and GNEWS_API_KEY in Convex (Settings → Environment Variables), then run ingest → runIngestionPublic once. The feed refreshes every 30 minutes.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsItems.map((item, index) => (
            <NewsCard key={item._id} item={item} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
