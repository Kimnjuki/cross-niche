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
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  /** SoftwareApplication schema (tool pages). */
  software?: {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem?: string;
    offers?: { price: number | string; priceCurrency: string };
    aggregateRating?: { ratingValue: number; ratingCount: number };
    url?: string;
  };
  /** Review schema (product/game review pages). */
  review?: {
    itemName: string;
    itemType: 'Product' | 'VideoGame' | 'SoftwareApplication' | 'TechArticle';
    reviewBody: string;
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
    author: string;
    datePublished: string;
    pros?: string[];
    cons?: string[];
    url: string;
    imageUrl?: string;
  };
  /** HowTo schema (step-by-step guides). */
  howTo?: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    totalTime?: string;
  };
  /** FAQPage schema. */
  faqs?: Array<{ question: string; answer: string }>;
}

export function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  software,
  review,
  howTo,
  faqs,
}: SEOProps) {
  return (
    <SEOHead
      title={title}
      description={description}
      url={canonical}
      type={ogType === 'article' ? 'article' : 'website'}
      image={ogImage}
      software={software}
      review={review}
      howTo={howTo}
      faqs={faqs}
    />
  );
}
