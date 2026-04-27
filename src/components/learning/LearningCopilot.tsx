import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Zap, CheckCircle2, Clock, Star, ChevronRight } from "lucide-react";

interface LearningCopilotProps {
  userId: string;
}

const STATUS_COLOR = {
  pending: "bg-blue-500/20 text-blue-400 border-blue-400/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
  completed: "bg-green-500/20 text-green-400 border-green-400/30",
};

const WEEKLY_MISSIONS = [
  {
    id: "m1",
    title: "Phishing Defense",
    description: "Learn to identify phishing attempts in gaming and social platforms.",
    xp: 150,
    estimatedTime: "20 min",
    tags: ["security", "beginner"],
  },
  {
    id: "m2",
    title: "Account Hardening",
    description: "Secure your gaming accounts with 2FA, strong passwords, and session management.",
    xp: 200,
    estimatedTime: "30 min",
    tags: ["security", "intermediate"],
  },
  {
    id: "m3",
    title: "Safe Modding Practices",
    description: "Understand how to safely install mods without compromising your system.",
    xp: 120,
    estimatedTime: "15 min",
    tags: ["gaming", "beginner"],
  },
];

export function LearningCopilot({ userId }: LearningCopilotProps) {
  const recommendations = useQuery(api.learningRecommendations.getActive, { userId });
  const gamification = useQuery(api.gamification.getUserGamification, { userId });
  const createMission = useMutation(api.learningRecommendations.createWeeklyMission);
  const updateStatus = useMutation(api.learningRecommendations.updateStatus);
  const [generating, setGenerating] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

  const handleGenerateMission = async () => {
    setGenerating(true);
    await createMission({ userId });
    setGenerating(false);
  };

  const handleCompleteMission = (missionId: string) => {
    setCompletedMissions((prev) => new Set([...prev, missionId]));
  };

  const xp = gamification?.xp ?? 0;
  const level = gamification?.level ?? 1;
  const nextLevelXp = [0, 100, 250, 500, 1000, 2000, 5000, 10000][level] ?? 10000;
  const currentLevelXp = [0, 100, 250, 500, 1000, 2000, 5000, 10000][level - 1] ?? 0;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="space-y-6">
      {/* XP Progress Banner */}
      <Card className="border border-[#B026FF]/30 bg-gradient-to-r from-[#B026FF]/10 to-black/40 backdrop-blur">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B026FF]/20 border border-[#B026FF]/40 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#B026FF]" />
              </div>
              <div>
                <p className="text-white font-bold">Level {level}</p>
                <p className="text-xs text-gray-400">{xp.toLocaleString()} XP total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                {(nextLevelXp - xp).toLocaleString()} XP to Level {level + 1}
              </p>
              {gamification?.currentStreak ? (
                <p className="text-xs text-[#FFB800]">
                  🔥 {gamification.currentStreak}-day streak
                </p>
              ) : null}
            </div>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </CardContent>
      </Card>

      {/* Weekly Missions */}
      <Card className="border border-white/10 bg-black/40 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#B026FF]" />
            Weekly Learning Missions
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="text-[#B026FF] hover:text-[#B026FF] text-xs"
            onClick={handleGenerateMission}
            disabled={generating}
          >
            {generating ? "Generating..." : "New Missions"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {WEEKLY_MISSIONS.map((mission) => {
            const done = completedMissions.has(mission.id);
            return (
              <div
                key={mission.id}
                className={`p-4 rounded-lg border transition-all ${
                  done
                    ? "bg-green-500/5 border-green-400/20 opacity-60"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      done
                        ? "bg-green-500/20 border border-green-400/30"
                        : "bg-[#B026FF]/10 border border-[#B026FF]/30"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-[#B026FF]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm text-white font-medium">{mission.title}</p>
                      {mission.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="text-xs bg-white/10 text-gray-400 border-white/20 capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {mission.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#FFB800]" />
                          +{mission.xp} XP
                        </span>
                      </div>
                      {!done && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-[#B026FF] hover:bg-[#B026FF]/80 text-white"
                          onClick={() => handleCompleteMission(mission.id)}
                        >
                          Complete <ChevronRight className="ml-1 w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active AI Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card className="border border-[#00F0FF]/20 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00F0FF]" />
              AI-Generated Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec._id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-sm text-white">
                    {rec.contentIds.length} content item{rec.contentIds.length !== 1 ? "s" : ""} queued
                  </p>
                  <p className="text-xs text-gray-500">
                    Generated {new Date(rec.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={`border text-xs ${STATUS_COLOR[rec.status]}`}>
                  {rec.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      {gamification?.badges && gamification.badges.length > 0 && (
        <Card className="border border-white/10 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-base">Earned Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {gamification.badges.map((badge) => (
                <Badge
                  key={badge}
                  className="bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30 capitalize"
                >
                  {badge.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
