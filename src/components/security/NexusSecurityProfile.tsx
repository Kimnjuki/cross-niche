import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle2, Clock, TrendingUp, Zap, ChevronRight } from "lucide-react";

interface NexusSecurityProfileProps {
  userId: string;
}

const BAND_CONFIG = {
  low: { color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", label: "Low Risk", icon: CheckCircle2 },
  medium: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", label: "Medium Risk", icon: AlertTriangle },
  high: { color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", label: "High Risk", icon: AlertTriangle },
  critical: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", label: "Critical Risk", icon: Shield },
};

const STATUS_CONFIG = {
  open: { color: "bg-red-500/20 text-red-400 border-red-400/30", label: "Open" },
  in_progress: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30", label: "In Progress" },
  resolved: { color: "bg-green-500/20 text-green-400 border-green-400/30", label: "Resolved" },
};

const EVENT_ICONS = {
  threat_added: AlertTriangle,
  threat_resolved: CheckCircle2,
  score_change: TrendingUp,
  config_change: Zap,
};

export function NexusSecurityProfile({ userId }: NexusSecurityProfileProps) {
  const profile = useQuery(api.riskProfiles.getByUser, { userId });
  const events = useQuery(api.riskProfiles.listEvents, { userId, limit: 5 });
  const updateStatus = useMutation(api.riskProfiles.updateRiskStatus);
  const upsert = useMutation(api.riskProfiles.upsert);
  const [initializing, setInitializing] = useState(false);

  const handleInitialize = async () => {
    setInitializing(true);
    await upsert({
      userId,
      overallRiskScore: 35,
      riskBand: "medium",
      topRisks: [
        {
          id: "r1",
          title: "Two-Factor Authentication Not Enabled",
          severity: "high",
          status: "open",
        },
        {
          id: "r2",
          title: "Weak Password on Gaming Account",
          severity: "medium",
          status: "open",
        },
        {
          id: "r3",
          title: "Outdated Game Client Version",
          severity: "low",
          status: "open",
        },
      ],
      recommendationSummary:
        "Enable 2FA on all gaming platforms and update your passwords to improve your security posture.",
    });
    setInitializing(false);
  };

  if (profile === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="border border-[#00F0FF]/20 bg-black/40 backdrop-blur">
        <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-[#00F0FF]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Build Your Nexus Security Profile</h3>
            <p className="text-gray-400 max-w-md">
              Get a unified view of your security posture across all your gaming accounts, devices, and platforms — powered by live threat intelligence.
            </p>
          </div>
          <Button
            onClick={handleInitialize}
            disabled={initializing}
            className="bg-[#00F0FF] text-black font-bold hover:bg-[#00F0FF]/80"
          >
            {initializing ? "Initializing..." : "Start Security Profile"}
            <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const bandConfig = BAND_CONFIG[profile.riskBand];
  const BandIcon = bandConfig.icon;

  return (
    <div className="space-y-6">
      {/* Score overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border ${bandConfig.bg} bg-black/40 backdrop-blur md:col-span-1`}>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
            <BandIcon className={`w-12 h-12 ${bandConfig.color}`} />
            <div>
              <div className="text-5xl font-bold text-white">{Math.round(profile.overallRiskScore)}</div>
              <div className="text-sm text-gray-400 mt-1">Nexus Risk Score</div>
            </div>
            <Badge className={`${bandConfig.bg} ${bandConfig.color} border`}>
              {bandConfig.label}
            </Badge>
            <Progress
              value={profile.overallRiskScore}
              className="w-full h-2 mt-1"
            />
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-black/40 backdrop-blur md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-base">Top Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.topRisks.length === 0 ? (
              <p className="text-gray-400 text-sm">No active risks. Your profile is clean.</p>
            ) : (
              profile.topRisks.map((risk) => {
                const statusCfg = STATUS_CONFIG[risk.status];
                return (
                  <div
                    key={risk.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{risk.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{risk.severity} severity</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-xs border ${statusCfg.color}`}>{statusCfg.label}</Badge>
                      {risk.status === "open" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2 text-[#00F0FF] hover:text-[#00F0FF]"
                          onClick={() =>
                            updateStatus({ userId, riskId: risk.id, status: "in_progress" })
                          }
                        >
                          Start Fix
                        </Button>
                      )}
                      {risk.status === "in_progress" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2 text-green-400 hover:text-green-400"
                          onClick={() =>
                            updateStatus({ userId, riskId: risk.id, status: "resolved" })
                          }
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendation summary */}
      {profile.recommendationSummary && (
        <Card className="border border-[#B026FF]/30 bg-[#B026FF]/5 backdrop-blur">
          <CardContent className="flex items-start gap-3 pt-4">
            <Zap className="w-5 h-5 text-[#B026FF] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-300">{profile.recommendationSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Recent events */}
      {events && events.length > 0 && (
        <Card className="border border-white/10 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.map((evt) => {
              const Icon = EVENT_ICONS[evt.eventType] ?? Zap;
              return (
                <div key={evt._id} className="flex items-center gap-3 text-sm">
                  <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-300 capitalize">
                    {evt.eventType.replace("_", " ")}
                  </span>
                  {evt.deltaScore !== undefined && (
                    <span
                      className={
                        evt.deltaScore > 0 ? "text-red-400 ml-auto" : "text-green-400 ml-auto"
                      }
                    >
                      {evt.deltaScore > 0 ? "+" : ""}
                      {evt.deltaScore.toFixed(1)}
                    </span>
                  )}
                  <span className="text-gray-600 text-xs ml-auto">
                    {new Date(evt.eventAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
