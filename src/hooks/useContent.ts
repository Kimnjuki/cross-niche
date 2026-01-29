import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

// Fetch all published content from Convex
export function usePublishedContent(limit = 20) {
  const rows = useQuery(api.content.listPublished, { limit });
  const data = toContentItems(rows ?? undefined);
  return { data, isLoading: rows === undefined };
}

// Fetch content by feed slug
export function useContentByFeed(feedSlug: string, limit = 20) {
  const rows = useQuery(api.content.listByFeedSlug, { feedSlug, limit });
  const data = toContentItems(rows ?? undefined);
  return { data, isLoading: rows === undefined };
}

// Fetch content by niche name (filter client-side from published)
export function useContentByNiche(nicheName: string, limit = 20) {
  const rows = useQuery(api.content.listPublished, { limit: limit * 2 });
  const filtered = (rows ?? []).filter((r: Record<string, unknown>) =>
    (Array.isArray(r.niches) ? r.niches : []).some((n: string) => String(n).toLowerCase() === nicheName.toLowerCase())
  ).slice(0, limit);
  const data = toContentItems(filtered);
  return { data, isLoading: rows === undefined };
}

// Fetch featured content (filter client-side)
export function useFeaturedContent(limit = 5) {
  const rows = useQuery(api.content.listPublished, { limit: 50 });
  const filtered = (rows ?? []).filter((r: Record<string, unknown>) => r.is_featured === true).slice(0, limit);
  return { data: toContentItems(filtered), isLoading: rows === undefined };
}

// Fetch single content by slug
export function useContentBySlug(slug: string, options?: { enabled?: boolean }) {
  const enabled = (options?.enabled !== undefined ? options.enabled : !!slug) && slug.length > 0;
  const row = useQuery(api.content.getBySlug, enabled ? { slug } : 'skip');
  const data = row ? toContentItem(row as Record<string, unknown>) : null;
  return { data, isLoading: enabled && row === undefined };
}

// Fetch all niches from Convex
export function useNiches() {
  const rows = useQuery(api.content.listNiches, {});
  const data = (rows ?? []) as Niche[];
  return { data, isLoading: rows === undefined };
}

// Fetch all active feeds from Convex
export function useFeeds() {
  const rows = useQuery(api.content.listFeeds, {});
  const data = (rows ?? []) as Feed[];
  return { data, isLoading: rows === undefined };
}

// Fetch trending content from Convex
export function useTrendingContent(limit = 6) {
  const rows = useQuery(api.content.listTrending, { limit });
  const data = toContentItems(rows ?? undefined);
  return { data, isLoading: rows === undefined };
}
