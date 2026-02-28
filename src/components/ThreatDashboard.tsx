import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ThreatDashboard() {
  const critical = useQuery(api.threatIntel.upsertThreat, {
    severity: "critical",
    limit: 5,
  });
  const high = useQuery(api.threatIntel.upsertThreat, {
    severity: "high",
    limit: 5,
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-red-50 border-l-4 border-red-600 rounded">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          🚨 Critical Threats
        </h3>
        {critical?.map((threat) => (
          <div key={threat._id} className="mb-4 p-4 bg-white rounded border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{threat.title}</span>
              <span className="text-xs text-gray-500">
                {new Date(threat.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{threat.description}</p>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-orange-50 border-l-4 border-orange-600 rounded">
        <h3 className="text-xl font-bold text-orange-800 mb-4">
          ⚠️ High Severity
        </h3>
        {high?.map((threat) => (
          <div key={threat._id} className="mb-4 p-4 bg-white rounded border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{threat.title}</span>
              <span className="text-xs text-gray-500">
                {new Date(threat.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{threat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
