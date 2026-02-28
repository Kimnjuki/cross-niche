import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ArticleCard } from "@/components/ArticleCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

export function Home() {
  const featuredContent = useQuery(api.content.getFeaturedContent, { limit: 5 });
  const breakingNews = useQuery(api.content.getBreakingNews, { limit: 3 });
  const latestContent = useQuery(api.content.getPublishedContent, { limit: 12 });
  const aiUpdates = useQuery(api.aiUpdates.getLatestAIUpdates, { limit: 5 });
  const threats = useQuery(api.threatIntel.getLatestThreats, {
    severity: "critical",
    limit: 5,
  });
  
  const isLoading = 
    featuredContent === undefined ||
    breakingNews === undefined ||
    latestContent === undefined;
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breaking News Banner */}
      {breakingNews && breakingNews.length > 0 && (
        <section className="mb-8 bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            🚨 Breaking News
          </h2>
          <div className="space-y-2">
            {breakingNews.map((item) => (
              <a
                key={item._id}
                href={`/content/${item.slug}`}
                className="block hover:underline text-red-900 font-medium"
              >
                {item.title}
              </a>
            ))}
          </div>
        </section>
      )}
      
      {/* Featured Content */}
      {featuredContent && featuredContent.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContent.map((content) => (
              <ArticleCard key={content._id} content={content} featured />
            ))}
          </div>
        </section>
      )}
      
      {/* Latest Content */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Latest</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestContent && latestContent.map((content) => (
            <ArticleCard key={content._id} content={content} />
          ))}
        </div>
      </section>
      
      {/* AI Pulse - Unique Feature */}
      {aiUpdates && aiUpdates.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">🤖 AI Pulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiUpdates.map((update) => (
              <div
                key={update._id}
                className="p-6 border rounded-lg hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{update.category}</span>
                  {update.isHype && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      🔥 Hype Alert
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                <p className="text-gray-600 mb-4">{update.description}</p>
                {update.hasBenchmarks && (
                  <div className="text-sm text-blue-600">
                    📊 Includes benchmark data
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Threat Intelligence - Unique Feature */}
      {threats && threats.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">🛡️ Critical Threats</h2>
          <div className="space-y-4">
            {threats.map((threat) => (
              <div
                key={threat._id}
                className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                    {threat.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(threat.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold mb-1">{threat.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{threat.description}</p>
                {threat.cveIds && threat.cveIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {threat.cveIds.map((cve) => (
                      <span
                        key={cve}
                        className="px-2 py-1 bg-gray-200 text-xs rounded"
                      >
                        {cve}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
