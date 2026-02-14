import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { articlesToContentItems, articleToContentItem } from '@/lib/contentMapper';
import { mockArticles } from '@/data/mockData';
import { contentCache } from './useContentCache';

// ContentItem type – compatible with Convex content query results
export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  body: string | null;
  excerpt: string | null;
  summary: string | null;
  status: string;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  featured_image_url: string | null;
  read_time_minutes: number | null;
  is_featured: boolean | null;
  is_breaking: boolean | null;
  security_score: number | null;
  content_type: string | null;
  author_id: string | null;
  author_name?: string;
  feed_slug?: string;
  feed_name?: string;
  feed_id?: number | null;
  niches?: string[];
  tags?: string[];
  view_count?: number | null;
}

export type Niche = { idNum: number; name: string; colorCode?: string };
export type Feed = { _id: string; slug: string; name: string; isActive?: boolean; displayOrder?: number };

function toContentItem(row: Record<string, unknown> | null): ContentItem | null {
  if (!row || typeof row !== 'object') return null;
  return {
    id: String(row.id ?? row._id ?? ''),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    body: row.body != null ? String(row.body) : null,
    excerpt: row.excerpt != null ? String(row.excerpt) : null,
    summary: row.summary != null ? String(row.summary) : null,
    status: String(row.status ?? 'draft'),
    published_at: row.published_at != null ? String(row.published_at) : null,
    created_at: row.created_at != null ? String(row.created_at) : null,
    updated_at: row.updated_at != null ? String(row.updated_at) : null,
    featured_image_url: row.featured_image_url != null ? String(row.featured_image_url) : null,
    read_time_minutes: typeof row.read_time_minutes === 'number' ? row.read_time_minutes : 5,
    is_featured: row.is_featured === true,
    is_breaking: row.is_breaking === true,
    security_score: typeof row.security_score === 'number' ? row.security_score : null,
    content_type: row.content_type != null ? String(row.content_type) : 'article',
    author_id: row.authorId != null ? String(row.authorId) : row.author_id != null ? String(row.author_id) : null,
    author_name: row.author_name != null ? String(row.author_name) : 'Anonymous',
    feed_slug: row.feed_slug != null ? String(row.feed_slug) : undefined,
    feed_name: row.feed_name != null ? String(row.feed_name) : undefined,
    feed_id: row.feed_id != null ? Number(row.feed_id) : null,
    niches: Array.isArray(row.niches) ? row.niches.map(String) : [],
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    view_count: typeof row.view_count === 'number' ? row.view_count : 0,
  };
}

function toContentItems(rows: unknown[] | undefined): ContentItem[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => toContentItem(r as Record<string, unknown>)).filter((x): x is ContentItem => x != null);
}

// Fetch all published content from Convex (or mock when Convex not configured)
export function usePublishedContent(limit = 20) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `published-content-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getPublishedContent, isDisabled ? 'skip' : { limit });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const data = isDisabled
    ? articlesToContentItems(mockArticles.slice(0, limit))
    : toContentItems(Array.isArray(rows) ? rows : []);
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000); // Cache for 30 seconds
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

/** Visible content for homepage: published + featured only, newest first (getVisibleContent). */
export function useVisibleContent(limit = 24) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `visible-content-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getVisibleContent, isDisabled ? 'skip' : { limit });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const data = isDisabled
    ? articlesToContentItems(mockArticles.filter((a) => a.isFeatured).slice(0, limit))
    : toContentItems(Array.isArray(rows) ? rows : []);
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000);
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

// Fetch content by feed slug (or mock when Convex not configured)
export function useContentByFeed(feedSlug: string, limit = 20) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `content-by-feed-${feedSlug}-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getContentByFeed, isDisabled ? 'skip' : { feedSlug, limit });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const feedNiche = feedSlug === 'secured' ? 'security' : feedSlug === 'play' ? 'gaming' : 'tech';
  const data = isDisabled
    ? articlesToContentItems(mockArticles.filter((a) => a.niche === feedNiche).slice(0, limit))
    : toContentItems(Array.isArray(rows) ? rows : []);
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000);
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

// Fetch content by niche name (or mock when Convex not configured)
export function useContentByNiche(nicheName: string, limit = 20) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `content-by-niche-${nicheName}-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getPublishedContent, isDisabled ? 'skip' : { limit: limit * 2 });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const niche = nicheName.toLowerCase() === 'tech' ? 'tech' : nicheName.toLowerCase() === 'security' ? 'security' : 'gaming';
  const data = isDisabled
    ? articlesToContentItems(mockArticles.filter((a) => a.niche === niche).slice(0, limit))
    : toContentItems(
        (rows ?? []).filter((r: Record<string, unknown>) =>
          (Array.isArray(r.niches) ? r.niches : []).some((n: string) => String(n).toLowerCase() === nicheName.toLowerCase())
        ).slice(0, limit)
      );
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000); // Cache for 30 seconds
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

/** Content by niche ID (1=Tech, 2=Security, 3=Gaming). Uses getContentByNiche. */
export function useContentByNicheId(nicheId: number, limit = 30) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `content-by-niche-id-${nicheId}-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getContentByNiche, isDisabled ? 'skip' : { niche: nicheId === 2 ? 'security' : nicheId === 3 ? 'gaming' : 'tech', limit });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const feedNiche = nicheId === 2 ? 'security' : nicheId === 3 ? 'gaming' : 'tech';
  const data = isDisabled
    ? articlesToContentItems(mockArticles.filter((a) => a.niche === feedNiche).slice(0, limit))
    : toContentItems(rows ?? []);
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000);
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

/** Featured content for homepage: published + isFeatured, sorted by publishedAt desc (getFeaturedContent). */
export function useFeaturedContent(limit = 24) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `featured-content-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getFeaturedContent, isDisabled ? 'skip' : { limit });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const data = isDisabled
    ? articlesToContentItems(mockArticles.filter((a) => a.isFeatured).slice(0, limit))
    : toContentItems(rows ?? []);
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000);
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

/** Latest N published articles regardless of featured (getLatestContent). */
export function useLatestContent(limit = 10) {
  const isDisabled = useConvexDisabled();
  const cacheKey = `latest-content-${limit}`;
  const cachedData = contentCache.get(cacheKey);
  const rows = useQuery(api.content.getLatestContent, isDisabled ? 'skip' : { limit });

  if (cachedData && !isDisabled) {
    return { data: cachedData, isLoading: false };
  }

  const data = isDisabled
    ? articlesToContentItems(mockArticles.slice(0, limit))
    : toContentItems(rows ?? []);
  
  // Cache the result
  if (data && !isDisabled) {
    contentCache.set(cacheKey, data, 30000); // Cache for 30 seconds
  }
  
  return { data, isLoading: !isDisabled && rows === undefined };
}

/** All published content for archive/explore (getAllPublishedContent). */
export function useAllPublishedContent(limit = 30) {
  const isDisabled = useConvexDisabled();
  const result = useQuery(api.content.listAll, isDisabled ? 'skip' : {});
  const data = isDisabled
    ? articlesToContentItems(mockArticles.slice(0, limit))
    : toContentItems(result?.slice(0, limit) ?? []);
  return {
    data,
    isLoading: !isDisabled && result === undefined,
  };
}

// Fetch single content by slug or id (Convex uses slug; URL param may be id or slug)
// Always fall back to mock when Convex returns null so full-view article always can show.
export function useContentBySlug(slugOrId: string, options?: { enabled?: boolean }) {
  const isDisabled = useConvexDisabled();
  const enabled = (options?.enabled !== undefined ? options.enabled : !!slugOrId) && slugOrId.length > 0;
  const row = useQuery(api.content.getContentBySlug, isDisabled || !enabled ? 'skip' : { slug: slugOrId });
  const bySlugOrId = mockArticles.find((a) => (a.slug ?? a.id) === slugOrId);
  const fromConvex = row != null ? toContentItem(row as Record<string, unknown>) : null;
  const fromMock = bySlugOrId ? articleToContentItem(bySlugOrId) : null;
  const data: ContentItem | null = fromConvex ?? fromMock;
  // Don't block full view on loading when we have mock fallback (show article immediately)
  const isLoading = !isDisabled && enabled && row === undefined && !fromMock;
  return { data, isLoading };
}

// Mock niches when Convex not configured
const MOCK_NICHES: Niche[] = [
  { idNum: 1, name: 'Tech' },
  { idNum: 2, name: 'Security' },
  { idNum: 3, name: 'Gaming' },
];

// Fetch all niches from Convex (or mock when Convex not configured)
export function useNiches() {
  const isDisabled = useConvexDisabled();
  const rows = useQuery(api.content.listNiches, isDisabled ? 'skip' : {});
  const data = isDisabled ? MOCK_NICHES : (rows ?? []) as Niche[];
  return { data, isLoading: !isDisabled && rows === undefined };
}

// Mock feeds when Convex not configured
const MOCK_FEEDS: Feed[] = [
  { _id: 'innovate', slug: 'innovate', name: 'Tech' },
  { _id: 'secured', slug: 'secured', name: 'Security' },
  { _id: 'play', slug: 'play', name: 'Gaming' },
];

// Fetch all active feeds from Convex (or mock when Convex not configured)
export function useFeeds() {
  const isDisabled = useConvexDisabled();
  const rows = useQuery(api.content.listFeeds, isDisabled ? 'skip' : {});
  const data = isDisabled ? MOCK_FEEDS : (rows ?? []) as Feed[];
  return { data, isLoading: !isDisabled && rows === undefined };
}

// Fetch trending content from Convex (or mock when Convex not configured)
export function useTrendingContent(limit = 6) {
  const isDisabled = useConvexDisabled();
  const rows = useQuery(api.content.getTrendingContent, isDisabled ? 'skip' : { limit });
  const data = isDisabled
    ? articlesToContentItems(mockArticles.slice(0, limit))
    : toContentItems(rows ?? undefined);
  return { data, isLoading: !isDisabled && rows === undefined };
}

/** Related content by shared tags (Internal Linking Bridge for orphan page fix).
 * contentId must be a Convex content document ID (from contentData.id when loaded from Convex), not a URL slug. */
function isConvexContentId(id: string | null | undefined): id is string {
  return typeof id === 'string' && id.length >= 20 && !/\s/.test(id);
}

export function useRelatedContent(contentId: string | null | undefined, limit = 6) {
  const isDisabled = useConvexDisabled();
  const skip = isDisabled || !isConvexContentId(contentId);
  const rows = useQuery(api.content.getRelated, skip ? 'skip' : { contentId: contentId as any, limit });
  const data = toContentItems(rows ?? []);
  return { data, isLoading: !isDisabled && !skip && rows === undefined };
}

/** Production hostname: hide all debug/diagnostics UI (AdSense + technical sanitization). */
function isProductionHost(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'thegridnexus.com';
}

/** Diagnostics: published count and connection (for debugging why Convex articles don't show).
 * On production (thegridnexus.com), returns null diagnostics so no "Content debug" / "Demo mode" UI is shown. */
export function useContentDiagnostics() {
  const isDisabled = useConvexDisabled();
  const diagnostics = useQuery(api.content.diagnostics, isDisabled ? 'skip' : {});
  const hideForProduction = isProductionHost();
  return {
    isConvexDisabled: isDisabled,
    diagnostics: hideForProduction || isDisabled ? null : diagnostics ?? null,
    isLoading: !hideForProduction && !isDisabled && diagnostics === undefined,
  };
}
