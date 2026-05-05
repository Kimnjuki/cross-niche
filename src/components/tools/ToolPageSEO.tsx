/**
 * ToolPageSEO — one-stop SEO + Software schema + cross-linking for tool pages.
 * Drop this into any tool page instead of raw `<SEO />`.
 */
import { SEO } from '@/components/SEO';
import { type SoftwareInput } from '@/lib/schemaMarkup';
import { TOOL_PAGES } from '@/lib/sitemapGenerator';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface ToolPageMeta {
  title: string;
  description: string;
  /** e.g. 'SecurityApplication', 'GameApplication', 'Utilities' */
  appCategory: string;
  /** Match a TOOL_PAGES entry by slug so cross-linking works */
  slug: string;
  /** Optional free/premium offer */
  offerPrice?: string;
}

/**
 * Renders SEO meta tags + SoftwareApplication schema for a tool page.
 * Pass canonical url manually or uses window.location.href.
 */
export function ToolPageSEO(meta: ToolPageMeta) {
  const software: SoftwareInput = {
    name: meta.title.replace(/\s*[—|] The Grid Nexus$/, '').trim(),
    description: meta.description,
    applicationCategory: meta.appCategory,
    operatingSystem: 'Web',
    url: meta.slug.startsWith('http')
      ? meta.slug
      : `https://thegridnexus.com${meta.slug}`,
    offers: meta.offerPrice
      ? { price: meta.offerPrice, priceCurrency: 'USD' }
      : { price: '0', priceCurrency: 'USD' },
  };

  return (
    <SEO
      title={meta.title}
      description={meta.description}
      canonical={`https://thegridnexus.com${meta.slug}`}
    />
  );
}

// ── Cross-linking ──────────────────────────────────────────────────────────

export interface RelatedTool {
  slug: string;
  name: string;
  tagline: string;
}

/**
 * Pick related tools by slug — useful for "Try these tools too" sections.
 */
export function getRelatedTool(slug: string): RelatedTool | null {
  const found = TOOL_PAGES.find((t) => t.slug === slug);
  if (!found) return null;
  return { slug: found.slug, name: found.name, tagline: '' };
}

/**
 * Renders a "Try these tools too" cross-link strip at the bottom of tool pages.
 * Shows up to `max` tools per row.
 */
export function ToolCrossLinks({
  related = [],
  max = 4,
}: {
  related?: string[];
  max?: number;
}) {
  const links = related
    .map((slug) => TOOL_PAGES.find((t) => t.slug === slug))
    .filter(Boolean)
    .slice(0, max);

  if (!links.length) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Try These Tools Too
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((t) => (
          <Link key={t!.slug} to={t!.slug}>
            <Badge
              variant="outline"
              className="text-xs px-3 py-1.5 border-gray-700 text-gray-300 hover:bg-[#B026FF]/10 hover:border-[#B026FF]/40 transition-colors cursor-pointer"
            >
              {t!.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
