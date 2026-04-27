import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { CommunityThreatHub } from "@/components/community/CommunityThreatHub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CommunityThreats() {
  const recentClusters = useQuery(api.threatClusters.list, { severity: "critical", limit: 3 });

  return (
    <Layout>
      <SEOHead
        title="Community Threat Hub — TheGridNexus"
        description="Crowd-sourced threat intelligence from gamers and tech users. Report, upvote, and track emerging security threats across gaming platforms."
        keywords={["community threats", "gaming threats", "threat reports", "security community", "crowdsourced intel"]}
        url={typeof window !== "undefined" ? window.location.href : "/community-threats"}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Hero */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8 text-[#FF007A]" />
              <h1 className="text-3xl font-bold text-white">Community Threat Hub</h1>
            </div>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">
              Crowd-sourced threat intelligence from the gaming and tech community. Submit suspicious activity, upvote real threats, and help keep everyone safe.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00F0FF]" />
                AI-verified clusters
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#39FF14]" />
                Real-time upvoting
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF007A]" />
                Anonymous reporting
              </span>
            </div>
          </div>

          {/* Critical alerts banner */}
          {recentClusters && recentClusters.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-400/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-sm font-bold text-red-400 uppercase tracking-wider">
                  Active Critical Clusters
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentClusters.map((c) => (
                  <Badge key={c._id} className="bg-red-500/20 text-red-300 border-red-400/30">
                    {c.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Main hub component */}
          <CommunityThreatHub />

          {/* Footer links */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Reports are reviewed and clustered by AI. Verified threats may be linked to official CVEs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-300">
                <Link to="/live-threat-dashboard">Official Threat Intel</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-300">
                <Link to="/security-profile">My Security Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
