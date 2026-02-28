import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function AIHypeTracker() {
  const analysis = useQuery(api.aiUpdates.getHypeAnalysis);
  
  if (!analysis) return null;
  
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
      <h3 className="text-2xl font-bold mb-4">🔥 AI Hype Meter</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-3xl font-bold">{analysis.total}</div>
          <div className="text-sm opacity-90">Total Updates</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{analysis.substantive}</div>
          <div className="text-sm opacity-90">Substantive</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{analysis.hype}</div>
          <div className="text-sm opacity-90">Hype</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400"
            style={{ width: `${analysis.hypePercentage}%` }}
          />
        </div>
        <p className="text-sm mt-2">
          {analysis.hypePercentage.toFixed(0)}% of AI news is pure hype
        </p>
      </div>
    </div>
  );
}
