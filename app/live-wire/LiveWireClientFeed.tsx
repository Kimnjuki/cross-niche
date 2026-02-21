"use client";

import { usePreloadedQuery, Preloaded, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LiveWireClientFeed({
  preloadedFeed,
}: {
  preloadedFeed: Preloaded<typeof api.liveWire.getFeed>;
}) {
  // 1. Instantly load the SEO-friendly data fetched by the server
  const initialData = usePreloadedQuery(preloadedFeed);

  // 2. Initialize the real-time paginated query for infinite scrolling
  const { results, status, loadMore } = usePaginatedQuery(
    api.liveWire.getFeed,
    {},
    { initialNumItems: 10 }
  );

  // 3. Use the real-time results if available, otherwise fallback to the fast SSR data
  const articles = results.length > 0 ? results : initialData.page;

  return (
    <div className="space-y-6">
      {/* Article Feed */}
      {articles.map((article) => (
        <article 
          key={article._id} 
          className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-semibold text-white">
              {article.title}
            </h2>
          </div>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {article.summary}
          </p>
          <div className="flex justify-between items-center text-xs font-mono text-gray-500">
            <span className="bg-gray-800 px-2 py-1 rounded">Source: {article.source}</span>
            <span>{new Date(article.publishedAt).toLocaleTimeString()}</span>
          </div>
        </article>
      ))}

      {/* Load More / Infinite Scroll Trigger */}
      <div className="pt-8 flex justify-center">
        <button
          onClick={() => loadMore(10)}
          disabled={status !== "CanLoadMore"}
          className="px-8 py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-lg font-medium hover:bg-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {status === "LoadingMore" 
            ? "Decrypting Intelligence..." 
            : status === "CanLoadMore" 
              ? "Load More Intel" 
              : "End of Live Wire"}
        </button>
      </div>
    </div>
  );
}
