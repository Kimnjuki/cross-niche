/**
 * Content SEO normalisation + pre-publish validation.
 *
 * Single source of truth for the indexing fixes in the Sept-2026 remediation
 * plan (P0-02 noindex, P0-07 canonical, P1-01 unique titles, P1-03 meta
 * descriptions, P1-04 title length, P1-05 thin content).
 *
 * Pure functions only — no React, no Convex imports — so the same rules can be
 * used by the rendering layer (SEOHead, Article page), the editorial UI before
 * publishing, build-time generators, and mirrored in Convex mutations.
 */

/** Google truncates titles near ~580px; 60 chars is the safe practical ceiling. */
export const MAX_TITLE_LENGTH = 60;

/** Meta descriptions are truncated around 155-160 chars in SERPs. */
export const MAX_DESCRIPTION_LENGTH = 160;

/** Minimum length below which a description adds no value to a SERP snippet. */
export const MIN_DESCRIPTION_LENGTH = 70;

const NICHE_DESCRIPTOR: Record<string, string> = {
  security: 'cybersecurity',
  gaming: 'gaming',
  tech: 'technology',
};

/**
 * Content types that must clear a substantive word-count bar before publish.
 * Deliberately excludes `news` / `editorial_brief` / `threat_alert`, which are
 * legitimately short, time-sensitive formats (P1-05).
 */
export const LONG_FORM_CONTENT_TYPES = [
  'guide',
  'review',
  'feature',
  'tutorial',
  'gaming_security_guide',
  'roadmap_report',
  'technology',
  'security',
  'gaming',
] as const;

/** Word count below which long-form content is treated as thin. */
export const MIN_LONG_FORM_WORDS = 300;

/**
 * The subset of a Convex `content` document this module reasons about.
 * Kept structural so callers can pass either a raw Convex doc or the mapped
 * front-end `Article` without a cast.
 */
export interface SeoContentInput {
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  subtitle?: string | null;
  body?: string | null;
  excerpt?: string | null;
  metaTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  focusKeyword?: string | null;
  contentType?: string | null;
  status?: string | null;
  niche?: string | null;
  wordCount?: number | null;
  tags?: string[] | null;
  isDeleted?: boolean | null;
  noindex?: boolean | null;
  noindexReason?: string | null;
}

export interface SeoValidationIssue {
  field: 'title' | 'metaTitle' | 'seoDescription' | 'canonicalUrl' | 'body';
  severity: 'error' | 'warning';
  message: string;
  /** Suggested replacement value the editor can accept verbatim. */
  suggestion?: string;
}

/* ────────────────────────────── primitives ────────────────────────────── */

/** Collapse whitespace and strip HTML tags so titles/descriptions are clean. */
export function stripHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncate at a word boundary and append an ellipsis.
 * Never returns mid-word fragments, which is what produced visually broken
 * titles in the audit's "title element is too long" failures.
 */
export function truncateAtWord(value: string, maxLength: number): string {
  const clean = (value ?? '').trim();
  if (clean.length <= maxLength) return clean;

  const clipped = clean.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  const base = lastSpace > maxLength * 0.5 ? clipped.slice(0, lastSpace) : clipped;
  return `${base.replace(/[\s,;:.\-–—]+$/, '')}\u2026`;
}

/** Word count of the rendered body, ignoring markup. */
export function countWords(value: string | null | undefined): number {
  const text = stripHtml(value);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/** Lowercase, alphanumeric slug key — matches scripts/lib/author-source.mjs. */
export function slugify(value: string | null | undefined): string {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function contentTypeLabel(contentType: string | null | undefined): string {
  switch ((contentType ?? '').toLowerCase()) {
    case 'guide':
    case 'gaming_security_guide':
      return 'Guide';
    case 'tutorial':
      return 'Tutorial';
    case 'review':
      return 'Review';
    case 'feature':
      return 'Feature';
    case 'news':
      return 'News';
    case 'threat_alert':
    case 'threat_intelligence':
      return 'Threat Alert';
    case 'roadmap_report':
      return 'Report';
    case 'opinion':
      return 'Opinion';
    default:
      return '';
  }
}

/* ──────────────────────────────── titles ──────────────────────────────── */

/**
 * Build a title that is unique and within length limits (P1-01 / P1-04).
 *
 * Priority:
 *   1. Explicit metaTitle when it already fits.
 *   2. focusKeyword prefixed to the headline — the cheapest way to differentiate
 *      two articles that share a headline but target different keywords.
 *   3. Content-type label suffix (e.g. "Guide", "Review").
 *   4. Plain headline.
 *
 * A `disambiguator` (author, date, or topic) can be supplied by callers that
 * already know a duplicate exists.
 */
export function buildSeoTitle(
  content: SeoContentInput,
  siteName: string,
  disambiguator?: string,
): string {
  const brandSuffix = siteName ? ` | ${siteName}` : '';
  const budget = Math.max(1, MAX_TITLE_LENGTH - brandSuffix.length);

  const explicitMeta = stripHtml(content.metaTitle);
  if (explicitMeta && explicitMeta.length <= budget) {
    return `${explicitMeta}${brandSuffix}`;
  }

  const base = stripHtml(content.title) || explicitMeta || 'Untitled';
  const keyword = stripHtml(content.focusKeyword);

  // Only prefix the keyword when it is not merely a repetition of the headline.
  const keywordPrefix =
    keyword && !base.toLowerCase().includes(keyword.toLowerCase()) ? `${keyword}: ` : '';

  const typeLabel = contentTypeLabel(content.contentType);
  const typeSuffix =
    typeLabel && !base.toLowerCase().includes(typeLabel.toLowerCase()) ? ` (${typeLabel})` : '';

  const tail = disambiguator ? ` — ${stripHtml(disambiguator)}` : '';

  const candidates = [
    `${keywordPrefix}${base}${tail}${typeSuffix}`,
    `${keywordPrefix}${base}${tail}`,
    `${keywordPrefix}${base}`,
    base,
  ];

  for (const candidate of candidates) {
    const fitted = truncateAtWord(candidate, budget);
    // Reject truncations that lost the distinguishing information.
    if (fitted && fitted.length >= Math.min(25, candidate.length)) {
      return `${fitted}${brandSuffix}`;
    }
  }

  return `${truncateAtWord(base, budget)}${brandSuffix}`;
}

/* ───────────────────────────── descriptions ───────────────────────────── */

/**
 * Guarantee a non-empty, unique-ish meta description (P1-03).
 *
 * Fallback chain: seoDescription → summary → subtitle → excerpt → body → title.
 * The niche CTA is only appended when the source text is too short to stand
 * alone, which keeps the description from looking templated on good content.
 */
export function buildSeoDescription(content: SeoContentInput, siteName: string): string {
  const explicit = stripHtml(content.seoDescription);
  if (explicit) return truncateAtWord(explicit, MAX_DESCRIPTION_LENGTH);

  const sources = [
    stripHtml(content.summary),
    stripHtml(content.subtitle),
    stripHtml(content.excerpt),
    stripHtml(content.body),
  ];

  let candidate =
    sources.find((s) => s.length >= MIN_DESCRIPTION_LENGTH) ?? sources.find(Boolean) ?? '';

  if (candidate.length < MIN_DESCRIPTION_LENGTH) {
    const nicheLabel = NICHE_DESCRIPTOR[(content.niche ?? '').toLowerCase()] ?? 'technology';
    const cta = `Read the full ${nicheLabel} analysis on ${siteName}.`;
    candidate = candidate
      ? `${candidate} ${cta}`
      : `${stripHtml(content.title) || siteName} — ${cta}`;
  }

  return truncateAtWord(candidate, MAX_DESCRIPTION_LENGTH);
}

/* ─────────────────────────── indexability (P0-02) ─────────────────────────── */

/**
 * Content statuses that are allowed to be indexed.
 * Anything else (draft/new/archived/unlisted) is suppressed by the renderer.
 */
export const INDEXABLE_STATUSES = ['published'] as const;

/**
 * Decide whether a Convex `content` document should be indexable.
 *
 * Indexability is *data-driven*: a page is indexable when it is published,
 * not soft-deleted, and not explicitly flagged `noindex`. Templates must not
 * invent extra conditions — that is what produced the 79 GSC
 * "Excluded by 'noindex' tag" pages.
 */
export function isIndexable(content: SeoContentInput | null | undefined): boolean {
  if (!content) return false;
  if (content.isDeleted === true) return false;
  if (content.noindex === true) return false;
  const status = (content.status ?? '').toLowerCase();
  if (!status) return true; // legacy documents with no status: don't over-suppress
  return (INDEXABLE_STATUSES as readonly string[]).includes(status);
}

/** Human-readable explanation of why a page is suppressed (logs / GSC triage). */
export function indexabilityReason(content: SeoContentInput | null | undefined): string | null {
  if (!content) return 'missing-document';
  if (content.isDeleted === true) return 'soft-deleted';
  if (content.noindex === true) return content.noindexReason || 'explicit-noindex';
  const status = (content.status ?? '').toLowerCase();
  if (status && !(INDEXABLE_STATUSES as readonly string[]).includes(status)) {
    return `status:${status}`;
  }
  return null;
}

/* ──────────────────────────── canonical (P0-07) ──────────────────────────── */

/** Normalise any URL to a canonical, query-free, slash-free absolute form. */
export function normaliseUrl(href: string, origin: string): string {
  const base = String(origin ?? '').replace(/\/+$/, '');
  const raw = String(href ?? '').split('?')[0].split('#')[0].trim();
  if (!raw) return `${base}/`;

  let pathname = raw;
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
  if (isAbsolute) {
    // A cross-domain canonical override is honoured verbatim.
    if (!raw.toLowerCase().startsWith(base.toLowerCase())) {
      return raw.replace(/\/+$/, '') || raw;
    }
    pathname = raw.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '') || '/';
  }

  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');
  if (pathname !== '/') pathname = pathname.toLowerCase();
  return `${base}${pathname}`;
}

/**
 * Resolve the canonical URL for a content page.
 *
 * Every rendered page must emit exactly one `<link rel="canonical">`. An
 * explicit `content.canonicalUrl` wins (syndicated / automated content points
 * at the primary version); otherwise the page self-canonicalises to its own
 * fully-qualified URL.
 */
export function resolveCanonicalUrl(
  content: SeoContentInput | null | undefined,
  siteUrl: string,
  fallbackPath?: string,
): string {
  const origin = String(siteUrl ?? '').replace(/\/+$/, '');
  const explicit = stripHtml(content?.canonicalUrl);
  if (explicit) return normaliseUrl(explicit, origin);

  const path = fallbackPath ?? pagePathFor(content ?? {});
  return normaliseUrl(`${origin}${path}`, origin);
}

/** Path of the page as rendered (used for self-canonical and sitemap entries). */
export function pagePathFor(content: SeoContentInput, prefix = '/article'): string {
  const slug = stripHtml(content.slug);
  return slug ? `${prefix}/${slug}` : prefix;
}

/* ─────────────────────── duplicate detection (P1-01/P1-02) ──────────────── */

/**
 * Normalised key used to detect duplicate titles across the content set.
 * Case, punctuation and whitespace differences are ignored so
 * "Zero-Day Alert: Patch Now!" and "zero day alert patch now" collide.
 */
export function titleKey(value: string | null | undefined): string {
  return stripHtml(value)
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cheap, deterministic body fingerprint for near-duplicate detection (P1-02).
 * Shingles the first 400 words into 5-word windows; two documents sharing
 * > 85% of fingerprints are near-duplicates.
 */
export function bodyFingerprint(body: string | null | undefined, windowSize = 5): Set<string> {
  const words = stripHtml(body).toLowerCase().split(/\s+/).filter(Boolean).slice(0, 400);
  const shingles = new Set<string>();
  for (let i = 0; i + windowSize <= words.length; i += 1) {
    shingles.add(words.slice(i, i + windowSize).join(' '));
  }
  return shingles;
}

/** Jaccard similarity of two fingerprint sets (0..1). */
export function fingerprintSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const shingle of a) if (b.has(shingle)) shared += 1;
  const union = a.size + b.size - shared;
  return union === 0 ? 0 : shared / union;
}

/* ────────────────────── pre-publish validation (P1-01/03/04/05) ──────────── */

export interface SeoValidationOptions {
  siteName?: string;
  /**
   * Normalised title keys already used by other published content.
   * Callers build this once from a Convex query rather than per-document.
   */
  existingTitleKeys?: Set<string>;
  /** Normalised title key of the document being validated, when editing. */
  selfTitleKey?: string;
}

/**
 * Validate a content document before it is published.
 *
 * Errors block publish (duplicate title, missing slug, thin long-form body);
 * warnings are advisory (derived description, over-long title/description).
 * Never throws — callers surface the returned issues in the editorial UI.
 */
export function validateContentForPublish(
  content: SeoContentInput,
  options: SeoValidationOptions = {},
): SeoValidationIssue[] {
  const siteName = options.siteName ?? 'The Grid Nexus';
  const issues: SeoValidationIssue[] = [];

  // Non-indexable content (draft/noindex/deleted) has no SEO surface to police.
  if (!isIndexable({ ...content, status: content.status ?? 'published' })) return issues;

  /* ── Title: presence, uniqueness, length ── */
  const computedTitle = buildSeoTitle(content, siteName);
  const key = titleKey(content.metaTitle || computedTitle || content.title);

  if (!stripHtml(content.title)) {
    issues.push({
      field: 'title',
      severity: 'error',
      message: 'Content has no title; the page would render an empty <title> tag.',
      suggestion: computedTitle,
    });
  }

  if (key && options.existingTitleKeys?.has(key) && key !== options.selfTitleKey) {
    const disambiguated = buildSeoTitle(
      content,
      siteName,
      stripHtml(content.focusKeyword) || contentTypeLabel(content.contentType) || 'Updated',
    );
    issues.push({
      field: 'metaTitle',
      severity: 'error',
      message: `Title "${computedTitle}" duplicates another published page. Duplicate titles are the leading cause of Google declining to index a page.`,
      suggestion: disambiguated,
    });
  }

  if (computedTitle.length > MAX_TITLE_LENGTH) {
    issues.push({
      field: 'metaTitle',
      severity: 'warning',
      message: `Title is ${computedTitle.length} characters; search engines truncate beyond ${MAX_TITLE_LENGTH}.`,
      suggestion: truncateAtWord(computedTitle, MAX_TITLE_LENGTH),
    });
  }

  /* ── Meta description: missing or over-long ── */
  const explicitDescription = stripHtml(content.seoDescription);
  if (!explicitDescription) {
    issues.push({
      field: 'seoDescription',
      severity: 'warning',
      message:
        'No hand-written meta description. An auto-generated fallback will be used; writing one improves click-through.',
      suggestion: buildSeoDescription(content, siteName),
    });
  } else if (explicitDescription.length > MAX_DESCRIPTION_LENGTH) {
    issues.push({
      field: 'seoDescription',
      severity: 'warning',
      message: `Meta description is ${explicitDescription.length} characters; SERPs truncate beyond ${MAX_DESCRIPTION_LENGTH}.`,
      suggestion: truncateAtWord(explicitDescription, MAX_DESCRIPTION_LENGTH),
    });
  }

  /* ── Canonical: a published page without a slug cannot self-canonicalise ── */
  if (!stripHtml(content.slug)) {
    issues.push({
      field: 'canonicalUrl',
      severity: 'error',
      message: 'Content has no slug, so it cannot emit a canonical URL. Set a slug before publishing.',
    });
  }

  /* ── Thin content: long-form types only ── */
  const contentType = (content.contentType ?? '').toLowerCase();
  const words =
    content.wordCount && content.wordCount > 0 ? content.wordCount : countWords(content.body);
  if (
    (LONG_FORM_CONTENT_TYPES as readonly string[]).includes(contentType) &&
    words < MIN_LONG_FORM_WORDS
  ) {
    issues.push({
      field: 'body',
      severity: 'error',
      message: `${contentType} content is ${words} words. Long-form content under ${MIN_LONG_FORM_WORDS} words is treated as thin and is frequently left unindexed.`,
    });
  }

  return issues;
}

/** True when any issue blocks publishing. */
export function hasBlockingIssues(issues: SeoValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}

/* ─────────────────────────── single entry point ──────────────────────────── */

export interface ResolvedContentSeo {
  title: string;
  description: string;
  canonicalUrl: string;
  indexable: boolean;
  noindexReason: string | null;
}

/**
 * Resolve every SEO field a page needs in one place, so the renderer never
 * re-implements fallback logic (P0-02, P0-07, P1-01, P1-03, P1-04).
 */
export function resolveContentSeo(
  content: SeoContentInput,
  siteUrl: string,
  siteName = 'The Grid Nexus',
): ResolvedContentSeo {
  return {
    title: buildSeoTitle(content, siteName),
    description: buildSeoDescription(content, siteName),
    canonicalUrl: resolveCanonicalUrl(content, siteUrl, pagePathFor(content)),
    indexable: isIndexable(content),
    noindexReason: indexabilityReason(content),
  };
}


