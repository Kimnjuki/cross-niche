/**
 * Legacy SEO component — now a thin pass-through to SEOHead.
 *
 * Previously used react-helmet-async which created duplicate <title> and
 * <meta> tags alongside SEOHead's manual DOM writes. Both ran on every
 * category page (Tech, Security, Gaming) causing:
 *   - SEMrush ERROR: "Duplicate title tags" (27 pages)
 *   - SEMrush ERROR: "Duplicate meta descriptions" (812 instances)
 *
 * Fix: delegate entirely to SEOHead which owns all meta tag writes.
 * react-helmet-async is preserved as a dep to avoid breaking other imports.
 */

import { SEOHead } from '@/components/seo/SEOHead';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
}

export function SEO({ title, description, canonical, ogType = 'website', ogImage }: SEOProps) {
  return (
    <SEOHead
      title={title}
      description={description}
      url={canonical}
      type={ogType === 'article' ? 'article' : 'website'}
      image={ogImage}
    />
  );
}
