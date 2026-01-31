/**
 * Skeleton loader for article detail page.
 * Per Technical Analysis Report: prevents crash and improves UX while article data loads.
 */

import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';

export function ArticleSkeleton() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="aspect-video w-full rounded-xl mb-8" />
        <div className="space-y-3 mb-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </Layout>
  );
}
