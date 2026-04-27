import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

const STATUS_CONFIG = {
  draft: { color: "bg-gray-500/20 text-gray-400 border-gray-400/30", icon: Clock, label: "Draft" },
  in_review: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30", icon: Clock, label: "In Review" },
  approved: { color: "bg-green-500/20 text-green-400 border-green-400/30", icon: CheckCircle2, label: "Approved" },
  cancelled: { color: "bg-red-500/20 text-red-400 border-red-400/30", icon: XCircle, label: "Cancelled" },
};

export default function NexusStudio() {
  const [statusFilter, setStatusFilter] = useState<"draft" | "in_review" | "approved" | "cancelled" | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const briefs = useQuery(api.editorialBriefs.list, {
    status: statusFilter,
    limit: 20,
  });

  const createBrief = useMutation(api.editorialBriefs.create);
  const updateStatus = useMutation(api.editorialBriefs.updateStatus);

  const handleCreate = async () => {
    if (!keyword) return;
    setSubmitting(true);
    await createBrief({
      targetKeyword: keyword,
      briefJson: {
        targetKeyword: keyword,
        notes,
        outline: [],
        talkingPoints: [],
        createdAt: new Date().toISOString(),
      },
    });
    setKeyword("");
    setNotes("");
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <Layout>
      <SEOHead
        title="Nexus Studio — Editorial AI Copilot"
        description="Internal editorial intelligence dashboard for TheGridNexus content team."
        keywords={["nexus studio", "editorial", "content strategy"]}
        url={typeof window !== "undefined" ? window.location.href : "/nexus-studio"}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Pencil className="w-7 h-7 text-[#FFB800]" />
              <div>
                <h1 className="text-2xl font-bold text-white">Nexus Studio</h1>
                <p className="text-sm text-gray-400">Brand & Content Intelligence Copilot — Internal</p>
              </div>
              <Badge className="bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30">Admin</Badge>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#FFB800] text-black font-bold hover:bg-[#FFB800]/80"
            >
              <Plus className="w-4 h-4 mr-1" /> New Brief
            </Button>
          </div>

          {/* Create brief form */}
          {showForm && (
            <Card className="border border-[#FFB800]/30 bg-black/40 backdrop-blur mb-8">
              <CardHeader>
                <CardTitle className="text-white text-base">Create AI Editorial Brief</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-400">Target Keyword *</Label>
                  <Input
                    placeholder="e.g. gaming VPN security 2025"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Brief Notes</Label>
                  <Textarea
                    placeholder="Key angles, competitor gaps, editorial direction..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-white/5 border-white/20 text-white mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreate}
                    disabled={submitting || !keyword}
                    className="bg-[#FFB800] text-black font-bold hover:bg-[#FFB800]/80"
                  >
                    {submitting ? "Creating..." : "Create Brief"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status filter */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-gray-500">Filter:</span>
            {(["all", "draft", "in_review", "approved", "cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s === "all" ? undefined : s)}
                className={`text-xs px-3 py-1 rounded-full border transition-all capitalize ${
                  (s === "all" && !statusFilter) || statusFilter === s
                    ? "border-[#FFB800]/50 text-[#FFB800] bg-[#FFB800]/10"
                    : "border-white/20 text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Briefs list */}
          {briefs === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : briefs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No editorial briefs yet.</p>
              <p className="text-sm mt-1">Create your first brief to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {briefs.map((brief) => {
                const statusCfg = STATUS_CONFIG[brief.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <Card
                    key={brief._id}
                    className="border border-white/10 bg-black/40 backdrop-blur hover:border-white/20 transition-colors"
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {brief.targetKeyword ?? "Untitled Brief"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Created {new Date(brief.createdAt).toLocaleDateString()}
                            </p>
                            {brief.briefJson?.notes && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                {brief.briefJson.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`${statusCfg.color} border text-xs flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg.label}
                          </Badge>
                          {brief.status === "draft" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7 text-yellow-400"
                              onClick={() => updateStatus({ id: brief._id, status: "in_review" })}
                            >
                              Submit for Review
                            </Button>
                          )}
                          {brief.status === "in_review" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7 text-green-400"
                              onClick={() => updateStatus({ id: brief._id, status: "approved" })}
                            >
                              Approve
                            </Button>
                          )}
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
    </Layout>
  );
}
