import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ThreatDashboard() {
  const critical = useQuery(api.threatIntel.getLatestThreats, {
    severity: "critical",
    limit: 5,
  });
  const high = useQuery(api.threatIntel.getLatestThreats, {
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
          <ThreatCard key={threat._id} threat={threat} />
        ))}
      </div>
      
      <div className="p-6 bg-orange-50 border-l-4 border-orange-600 rounded">
        <h3 className="text-xl font-bold text-orange-800 mb-4">
          ⚠️ High Severity
        </h3>
        {high?.map((threat) => (
          <ThreatCard key={threat._id} threat={threat} />
        ))}
      </div>
    </div>
  );
}

function ThreatCard({ threat }: { threat: any }) {
  return (
    <div className="mb-4 p-4 bg-white rounded border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
          {threat.severity.toUpperCase()}
        </span>
        <span className="text-sm text-gray-600">
          {new Date(threat.publishedAt).toLocaleDateString()}
        </span>
      </div>
      <h4 className="font-bold mb-1">{threat.title}</h4>
      <p className="text-sm text-gray-700 mb-2">{threat.description}</p>
      {threat.cveIds && threat.cveIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {threat.cveIds.map((cve: string) => (
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
  );
}
