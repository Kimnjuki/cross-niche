/**
 * Grid Nexus - Complete Homepage Component
 * Copy this to your app/page.tsx or pages/index.tsx
 */

"use client"; // If using Next.js 13+ App Router

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  // Fetch different types of content
  const articles = useQuery(api.content.getPublishedContent, { limit: 20 });
  const featured = useQuery(api.content.getFeaturedContent, { limit: 5 });
  const breaking = useQuery(api.content.getBreakingNews, { limit: 3 });
  const stats = useQuery(api.content.getContentStats);

  // Debug logging (remove after testing)
  console.log("=== Grid Nexus Debug Info ===");
  console.log("Articles:", articles?.length || "loading");
  console.log("Featured:", featured?.length || "loading");
  console.log("Breaking:", breaking?.length || "loading");
  console.log("Stats:", stats);
  console.log("===========================");

  // Loading state - ALL queries are undefined while loading
  const isLoading = articles === undefined || featured === undefined || breaking === undefined;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Error state - if data is null (not undefined)
  if (articles === null) {
    return <ErrorScreen message="Failed to load articles. Please check your Convex connection." />;
  }

  // Empty state - no articles exist
  if (!articles || articles.length === 0) {
    return <EmptyStateScreen />;
  }

  // Success state - render the content
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      {stats && <StatsBar stats={stats} />}

      {/* Breaking News Ticker */}
      {breaking && breaking.length > 0 && (
        <BreakingNewsTicker articles={breaking} />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Articles Section */}
        {featured && featured.length > 0 && (
          <section className="mb-16">
            <SectionHeader 
              title="Featured Stories" 
              subtitle="Our top picks for you"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((article) => (
                <FeaturedArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Articles Section */}
        <section className="mb-16">
          <SectionHeader 
            title="Latest Articles" 
            subtitle="Stay updated with the newest content"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 12).map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>

        {/* Load More Button */}
        {articles.length > 12 && (
          <div className="flex justify-center">
            <Link 
              href="/articles"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View All Articles
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8">Loading Grid Nexus</h2>
        <p className="text-gray-400 mt-2">Fetching the latest content...</p>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR SCREEN COMPONENT
// ============================================================================

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h2>
        <p className="text-gray-400 text-lg mb-8">{message}</p>
        <div className="bg-gray-800 rounded-lg p-6 text-left">
          <h3 className="text-white font-semibold mb-3">Troubleshooting Steps:</h3>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Check your internet connection</li>
            <li>Verify Convex is connected (check .env.local)</li>
            <li>Open Convex Dashboard and check if data exists</li>
            <li>Try refreshing the page</li>
          </ol>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

function EmptyStateScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-bold text-white mb-4">No Articles Yet</h2>
        <p className="text-gray-400 text-lg mb-8">
          The content database is empty. This usually means you need to import articles or create new ones.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 text-left mb-8">
          <h3 className="text-white font-semibold mb-3">Quick Fix:</h3>
          <ol className="text-gray-300 space-y-3 list-decimal list-inside">
            <li>
              Open Convex Dashboard: 
              <code className="ml-2 px-2 py-1 bg-gray-900 rounded text-blue-400">
                npx convex dashboard
              </code>
            </li>
            <li>
              Go to Functions tab
            </li>
            <li>
              Run this mutation:
              <code className="ml-2 px-2 py-1 bg-gray-900 rounded text-blue-400 block mt-2">
                api.admin.seedSampleContent(&#123; count: 10 &#125;)
              </code>
            </li>
            <li>
              Refresh this page
            </li>
          </ol>
        </div>
        <a 
          href="https://dashboard.convex.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Open Convex Dashboard
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            The Grid Nexus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Tech, Security & Gaming News | Expert Analysis
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Breaking technology news, cybersecurity analysis, and gaming guides. 
            Stay ahead of the curve with AI insights and security intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS BAR
// ============================================================================

function StatsBar({ stats }: { stats: any }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <StatItem label="Total Articles" value={stats.total || 0} />
          <StatItem label="Published" value={stats.published || 0} />
          <StatItem label="Featured" value={stats.featured || 0} />
          <StatItem label="Breaking" value={stats.breaking || 0} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-400">{value}</div>
      <div className="text-sm text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ============================================================================
// BREAKING NEWS TICKER
// ============================================================================

function BreakingNewsTicker({ articles }: { articles: any[] }) {
  return (
    <div className="bg-red-600 text-white py-3 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        <span className="font-bold uppercase mr-4 flex-shrink-0">🔴 Breaking:</span>
        <div className="flex gap-8 animate-scroll">
          {articles.map((article) => (
            <Link 
              key={article._id}
              href={`/articles/${article.slug}`}
              className="hover:underline whitespace-nowrap"
            >
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION HEADER
// ============================================================================

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400">{subtitle}</p>
    </div>
  );
}

// ============================================================================
// FEATURED ARTICLE CARD
// ============================================================================

function FeaturedArticleCard({ article }: { article: any }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300 h-full">
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            ⭐ FEATURED
          </span>
        </div>

        {/* Image */}
        {article.featuredImageUrl && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
            {article.title}
          </h3>
          
          {article.summary && (
            <p className="text-gray-400 mb-4 line-clamp-3">
              {article.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span>{article.estimatedReadingTimeMinutes || 5} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// REGULAR ARTICLE CARD
// ============================================================================

function ArticleCard({ article }: { article: any }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        {article.featuredImageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition">
            {article.title}
          </h3>
          
          {article.summary && (
            <p className="text-gray-400 mb-4 line-clamp-2 flex-1">
              {article.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
            {article.viewCount !== undefined && (
              <span>👁️ {article.viewCount}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// STYLES (Add to globals.css)
// ============================================================================

/*
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 20s linear infinite;
}
*/
