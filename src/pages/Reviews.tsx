/**
 * Reviews hub – product & game reviews, expert comparisons.
 * Uses ProductReviewsSection and Convex content (filtered by tag/feed when available).
 */

import { Layout } from '@/components/layout/Layout';
import { ProductReviewsSection } from '@/components/reviews/ProductReviewsSection';
import { usePublishedContent, useContentByFeed } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Reviews() {
  const { data: published } = usePublishedContent(50);
  const { data: reviewsFeed } = useContentByFeed('reviews', 20);

  const allArticles = published && published.length > 0 ? mapContentToArticles(published) : [];
  const reviewArticles =
    reviewsFeed && reviewsFeed.length > 0
      ? mapContentToArticles(reviewsFeed)
      : allArticles.filter(
          (a) =>
            a.tags.some((t) => /review|comparison|roundup/i.test(t)) ||
            a.title.toLowerCase().includes('review') ||
            a.title.toLowerCase().includes('vs ')
        );

  return (
    <Layout>
      <SEOHead
        title="Product & Game Reviews | The Grid Nexus"
        description="Expert reviews of tech hardware, security tools, and gaming gear. Honest comparisons and buying guides."
        keywords={['product reviews', 'tech reviews', 'gaming reviews', 'hardware comparison', 'buying guide']}
      />
      <div className="container mx-auto px-4 py-8">
        <ProductReviewsSection articles={reviewArticles.length > 0 ? reviewArticles : allArticles.slice(0, 12)} />
      </div>
    </Layout>
  );
}
