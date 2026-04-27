import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, AlertTriangle, CheckCircle2, Info, Gamepad2, ChevronRight } from "lucide-react";

const PLATFORMS = ["PC", "PlayStation", "Xbox", "Steam", "Mobile", "Nintendo"];

const RISK_CONFIG = {
  informational: {
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
    icon: Info,
    label: "Informational",
  },
  elevated: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    icon: AlertTriangle,
    label: "Elevated Risk",
  },
  high: {
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
    icon: AlertTriangle,
    label: "High Risk",
  },
  critical: {
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    icon: Shield,
    label: "Critical Risk",
  },
};

const POPULAR_GAMES = [
  "fortnite",
  "valorant",
  "minecraft",
  "call-of-duty",
  "apex-legends",
  "roblox",
  "gta-online",
  "pubg",
];

export function GameSecurityCopilot() {
  const [gameSlug, setGameSlug] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [queried, setQueried] = useState(false);

  const advisories = useQuery(
    api.gameAdvisories.getByGame,
    queried && gameSlug ? { gameSlug, platform } : "skip"
  );
  const createDemo = useMutation(api.gameAdvisories.createDemo);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const slug = inputValue.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug) return;
    setGameSlug(slug);
    setQueried(true);
    setLoading(true);

    // Brief delay for the query to resolve
    setTimeout(async () => {
      if (!advisories || advisories.length === 0) {
        await createDemo({ gameSlug: slug, platform });
      }
      setLoading(false);
    }, 800);
  };

  const latestAdvisory = advisories?.[0];
  const riskConfig = latestAdvisory ? RISK_CONFIG[latestAdvisory.riskLevel] : null;

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <Card className="border border-[#39FF14]/20 bg-black/40 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Enter game name (e.g. Fortnite, Valorant...)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full sm:w-36 bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p} className="text-white">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              disabled={loading || !inputValue.trim()}
              className="bg-[#39FF14] text-black font-bold hover:bg-[#39FF14]/80"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Search className="w-4 h-4" /> Analyze
                </span>
              )}
            </Button>
          </div>

          {/* Popular games */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Popular:</span>
            {POPULAR_GAMES.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setInputValue(g.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
                  setGameSlug(g);
                  setQueried(true);
                }}
                className="text-xs text-[#39FF14]/70 hover:text-[#39FF14] transition-colors capitalize"
              >
                {g.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
          <span className="w-6 h-6 border-2 border-gray-600 border-t-[#39FF14] rounded-full animate-spin" />
          <span>Analyzing threat intelligence for {inputValue}...</span>
        </div>
      )}

      {!loading && latestAdvisory && riskConfig && (
        <div className="space-y-4">
          {/* Risk level card */}
          <Card className={`border ${riskConfig.bg} bg-black/40 backdrop-blur`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full ${riskConfig.bg} border flex items-center justify-center shrink-0`}>
                  <riskConfig.icon className={`w-7 h-7 ${riskConfig.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white capitalize">
                      {latestAdvisory.gameSlug.replace(/-/g, " ")}
                    </h3>
                    <Badge className={`${riskConfig.bg} ${riskConfig.color} border text-xs`}>
                      {riskConfig.label}
                    </Badge>
                    <Badge className="bg-white/10 text-gray-300 border-white/20 text-xs">
                      {latestAdvisory.platform}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">{latestAdvisory.generatedSummary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border border-white/10 bg-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white text-base">Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestAdvisory.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#39FF14] mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-xs text-gray-600 text-center">
            Advisory generated{" "}
            {new Date(latestAdvisory.createdAt).toLocaleDateString()}.{" "}
            {latestAdvisory.expiresAt &&
              `Expires ${new Date(latestAdvisory.expiresAt).toLocaleDateString()}.`}
          </p>
        </div>
      )}

      {!loading && queried && advisories?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p>No advisory found. Try again in a moment while we generate an analysis.</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={handleSearch}
          >
            Retry Analysis <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
