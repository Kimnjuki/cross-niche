import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, AlertTriangle, ThumbsUp, Plus, Filter, Shield } from "lucide-react";

const SEVERITY_CONFIG = {
  critical: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", dot: "bg-red-400" },
  high: { color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", dot: "bg-orange-400" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", dot: "bg-yellow-400" },
  low: { color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", dot: "bg-blue-400" },
};

const PLATFORMS = ["All", "Steam", "PlayStation", "Xbox", "PC", "Mobile", "Other"];
const SEVERITIES = ["all", "critical", "high", "medium", "low"] as const;
const THREAT_TYPES = ["phishing", "account_takeover", "malware", "ddos", "exploit", "other"];

export function CommunityThreatHub() {
  const [platformFilter, setPlatformFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState<"critical" | "high" | "medium" | "low" | "all">("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    platform: "Steam",
    severity: "medium" as "critical" | "high" | "medium" | "low",
    threatType: "phishing",
    evidence: "",
    displayName: "",
  });

  const clusters = useQuery(api.threatClusters.list, {
    severity: severityFilter === "all" ? undefined : severityFilter,
    limit: 10,
  });

  const reports = useQuery(api.threatClusters.listRecentReports, {
    platform: platformFilter === "All" ? undefined : platformFilter,
    severity: severityFilter === "all" ? undefined : severityFilter,
    limit: 20,
  });

  const submitReport = useMutation(api.threatClusters.submitReport);
  const upvoteReport = useMutation(api.threatClusters.upvoteReport);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    setSubmitting(true);
    await submitReport({
      displayName: form.displayName || undefined,
      title: form.title,
      description: form.description,
      platform: form.platform,
      severity: form.severity,
      threatType: form.threatType,
      evidence: form.evidence || undefined,
    });
    setForm({ title: "", description: "", platform: "Steam", severity: "medium", threatType: "phishing", evidence: "", displayName: "" });
    setReportOpen(false);
    setSubmitting(false);
  };

  const handleUpvote = async (reportId: string) => {
    if (upvoted.has(reportId)) return;
    setUpvoted((prev) => new Set([...prev, reportId]));
    await upvoteReport({ reportId: reportId as Parameters<typeof upvoteReport>[0]["reportId"] });
  };

  return (
    <div className="space-y-6">
      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#FF007A]" />
          <h2 className="text-xl font-bold text-white">Community Threat Hub</h2>
          <Badge className="bg-[#FF007A]/10 text-[#FF007A] border-[#FF007A]/30">
            {reports?.length ?? 0} active reports
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p} className="text-white text-xs">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as typeof severityFilter)}>
            <SelectTrigger className="w-28 bg-white/5 border-white/20 text-white h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s} className="text-white text-xs capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#FF007A] hover:bg-[#FF007A]/80 text-white h-8 text-xs">
                <Plus className="w-3 h-3 mr-1" /> Report Threat
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-950 border-white/10 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Threat Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-400">Your Name (optional)</Label>
                  <Input
                    placeholder="Anonymous"
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Title *</Label>
                  <Input
                    placeholder="Brief title of the threat"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Description *</Label>
                  <Textarea
                    placeholder="Describe the threat in detail..."
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-1 min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-400">Platform</Label>
                    <Select value={form.platform} onValueChange={(v) => setForm((f) => ({ ...f, platform: v }))}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10">
                        {PLATFORMS.filter((p) => p !== "All").map((p) => (
                          <SelectItem key={p} value={p} className="text-white">
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Severity</Label>
                    <Select value={form.severity} onValueChange={(v) => setForm((f) => ({ ...f, severity: v as typeof form.severity }))}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10">
                        {(["low", "medium", "high", "critical"] as const).map((s) => (
                          <SelectItem key={s} value={s} className="text-white capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Threat Type</Label>
                  <Select value={form.threatType} onValueChange={(v) => setForm((f) => ({ ...f, threatType: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      {THREAT_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="text-white capitalize">
                          {t.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Evidence URL (optional)</Label>
                  <Input
                    placeholder="https://..."
                    value={form.evidence}
                    onChange={(e) => setForm((f) => ({ ...f, evidence: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-1"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !form.title || !form.description}
                  className="w-full bg-[#FF007A] hover:bg-[#FF007A]/80 text-white"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Clusters */}
      {clusters && clusters.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Active Threat Clusters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clusters.map((cluster) => {
              const sev = SEVERITY_CONFIG[cluster.severity];
              return (
                <Card key={cluster._id} className={`border ${sev.bg} bg-black/40 backdrop-blur`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${sev.dot} shrink-0 mt-1`} />
                        <h4 className="text-sm font-semibold text-white">{cluster.title}</h4>
                      </div>
                      <Badge className={`${sev.bg} ${sev.color} border text-xs capitalize shrink-0`}>
                        {cluster.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 ml-4">{cluster.description}</p>
                    <div className="flex items-center gap-2 ml-4 flex-wrap">
                      {cluster.platforms.map((p) => (
                        <Badge key={p} className="text-xs bg-white/10 text-gray-300 border-white/20">
                          {p}
                        </Badge>
                      ))}
                      <span className="text-xs text-gray-500">
                        {cluster.reportIds.length} report{cluster.reportIds.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Individual reports */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          Community Reports
        </h3>
        {reports === undefined ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p>No reports found for the selected filters.</p>
            <p className="text-sm mt-1">Be the first to submit a threat report!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const sev = SEVERITY_CONFIG[report.severity];
              const hasUpvoted = upvoted.has(report._id);
              return (
                <Card
                  key={report._id}
                  className="border border-white/10 bg-black/40 backdrop-blur hover:border-white/20 transition-colors"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full ${sev.dot} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-semibold text-white">{report.title}</h4>
                          <Badge className={`${sev.bg} ${sev.color} border text-xs capitalize`}>
                            {report.severity}
                          </Badge>
                          <Badge className="bg-white/10 text-gray-400 border-white/20 text-xs">
                            {report.platform}
                          </Badge>
                          <Badge
                            className={
                              report.status === "verified"
                                ? "bg-green-500/20 text-green-400 border-green-400/30 text-xs"
                                : "bg-gray-500/20 text-gray-400 border-gray-400/30 text-xs"
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            By{" "}
                            <span className="text-gray-400">
                              {report.displayName ?? "Anonymous"}
                            </span>
                          </span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          <button
                            onClick={() => handleUpvote(report._id)}
                            disabled={hasUpvoted}
                            className={`flex items-center gap-1 transition-colors ${
                              hasUpvoted
                                ? "text-[#FF007A]"
                                : "hover:text-[#FF007A] text-gray-500"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {report.upvotes + (hasUpvoted ? 1 : 0)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
