import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import LiveWireClientFeed from "./LiveWireClientFeed";

export default async function LiveWirePage() {
  // Preload the first 10 articles on the server for instant SEO
  const preloadedFeed = await preloadQuery(api.liveWire.getFeed, {
    paginationOpts: { numItems: 10, cursor: null },
  });

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Live Wire <span className="text-red-500 animate-pulse">•</span>
        </h1>
        <p className="text-gray-400 mt-2">Real-time cybersecurity and tech intelligence.</p>
      </header>
      
      {/* Pass the preloaded payload to the Client Component */}
      <LiveWireClientFeed preloadedFeed={preloadedFeed} />
    </main>
  );
}
