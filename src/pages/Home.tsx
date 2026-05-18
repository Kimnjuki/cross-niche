import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ArticleCard } from "@/components/ArticleCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { SAMPLE_AI_UPDATES } from "@/data/aiUpdates";
import { useConvexDisabled } from "@/components/SafeConvexProvider";

function safeUseQuery<T>(queryFn: () => T, args: Record<string, unknown>, fallback: T): T {
  try {
    return useQuery(queryFn, args) ?? fallback;
  } catch {
    return fallback;
  }
}

export function Home() {
  const isDisabled = useConvexDisabled();

  const featuredContent = isDisabled
    ? []
    : safeUseQuery(api.content.getFeaturedContent as never, { limit: 5 }, []);
  const breakingNews = isDisabled
    ? []
    : safeUseQuery(api.content.getBreakingNews as never, { limit: 3 }, []);
  const latestContent = isDisabled
    ? []
    : safeUseQuery(api.content.getPublishedContent as never, { limit: 12 }, []);
  const aiUpdates = isDisabled
    ? SAMPLE_AI_UPDATES.slice(0, 5)
    : safeUseQuery(api.aiUpdates.getLatestAIUpdates as never, { limit: 5 }, SAMPLE_AI_UPDATES.slice(0, 5));
  const threats = isDisabled
    ? []
    : safeUseQuery(api.threatIntel.getLatestThreats as never, { severity: "critical", limit: 5 }, []);

  const isLoading =
    !isDisabled &&
    (featuredContent === undefined || breakingNews === undefined || latestContent === undefined);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return <HomeLoadedContent
    featuredContent={featuredContent}
    breakingNews={breakingNews}
    latestContent={latestContent}
    aiUpdates={aiUpdates}
    threats={threats}
  />;
}

function HomeLoadedContent({
  featuredContent,
  breakingNews,
  latestContent,
  aiUpdates,
  threats,
}: {
  featuredContent: Record<string, unknown>[];
  breakingNews: Record<string, unknown>[];
  latestContent: Record<string, unknown>[];
  aiUpdates: Record<string, unknown>[];
  threats: Record<string, unknown>[];
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h1 className="mb-4 text-4xl font-bold text-white">Security Intelligence for Gamers</h1>
          <p className="text-lg text-zinc-400">Real-time threat intelligence, breach reports, and security tools built for the gaming community.</p>
        </div>
      </section>

      {/* Featured Content */}
      {Array.isArray(featuredContent) && featuredContent.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-white">Featured</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredContent.slice(0, 5).map((article: Record<string, unknown>) => (
              <ArticleCard key={String(article._id ?? article.slug ?? '')} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* AI Pulse Section */}
      {Array.isArray(aiUpdates) && aiUpdates.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-white">AI Pulse</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiUpdates.map((update: Record<string, unknown>) => (
              <ArticleCard key={String(update._id ?? update.id ?? update.title ?? '')} article={update} />
            ))}
          </div>
        </section>
      )}

      {/* Breaking News */}
      {Array.isArray(breakingNews) && breakingNews.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-amber-400">Breaking News</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {breakingNews.map((article: Record<string, unknown>) => (
              <ArticleCard key={String(article._id ?? article.slug ?? '')} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Content */}
      {Array.isArray(latestContent) && latestContent.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-white">Latest Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestContent.map((article: Record<string, unknown>) => (
              <ArticleCard key={String(article._id ?? article.slug ?? '')} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Threat Intel */}
      {Array.isArray(threats) && threats.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-red-400">Active Threats</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {threats.map((threat: Record<string, unknown>) => (
              <ArticleCard key={String(threat._id ?? threat.slug ?? threat.title ?? '')} article={threat} />
            ))}
          </div>
        </section>
      )}

      {/* Error fallback when no data */}
      {!featuredContent?.length && !breakingNews?.length && !latestContent?.length && !aiUpdates?.length && !threats?.length && (
        <section className="mb-12">
          <ErrorState message="No content available right now. Check back soon." />
        </section>
      )}
    </div>
  );
}
