import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LoadingState } from "@/components/LoadingState";

export function FeedPage() {
  const { slug } = useParams<{ slug: string }>();
  const feed = useQuery(api.feeds.getFeedBySlug, { slug: slug! });
  const content = useQuery(api.feeds.getFeedContent, {
    feedSlug: slug!,
    limit: 20,
  });
  
  if (feed === undefined || content === undefined) {
    return <LoadingState />;
  }
  
  if (!feed) {
    return <div>Feed not found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {feed.icon && <span className="text-4xl">{feed.icon}</span>}
          <h1 className="text-4xl font-bold">{feed.name}</h1>
        </div>
        {feed.description && (
          <p className="text-lg text-gray-600">{feed.description}</p>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content && content.map((item) => (
          <div key={item._id} className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.summary}</p>
            <a
              href={`/content/${item.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
