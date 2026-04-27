import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { NexusSecurityProfile as ProfileComponent } from "@/components/security/NexusSecurityProfile";
import { GameSecurityCopilot } from "@/components/security/GameSecurityCopilot";
import { LearningCopilot } from "@/components/learning/LearningCopilot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Gamepad2, BookOpen, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const TABS = [
  { id: "profile", label: "Security Profile", icon: Shield },
  { id: "game-copilot", label: "Game Copilot", icon: Gamepad2 },
  { id: "learning", label: "Learning Copilot", icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

import { useState } from "react";

export default function NexusSecurityProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const userId = user?.id ?? "demo-user";

  return (
    <Layout>
      <SEOHead
        title="Nexus Security Profile — TheGridNexus"
        description="Your unified AI-powered security posture dashboard. Track threats, secure your games, and build skills with the Nexus Security Suite."
        keywords={["security profile", "nexus security", "gaming security", "threat intelligence"]}
        url={typeof window !== "undefined" ? window.location.href : "/security-profile"}
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#00F0FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Nexus Security Suite</h1>
                <p className="text-sm text-gray-400">
                  AI-powered security for gamers and tech users
                </p>
              </div>
              <Badge className="ml-auto bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30">
                v3.0
              </Badge>
            </div>

            {!user && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30 text-sm">
                <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-yellow-300">
                  You&apos;re viewing a demo profile.{" "}
                  <Link to="/signin" className="underline text-yellow-400">
                    Sign in
                  </Link>{" "}
                  to save your real security data.
                </span>
              </div>
            )}
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-8">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-white/10 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === "profile" && <ProfileComponent userId={userId} />}
          {activeTab === "game-copilot" && <GameSecurityCopilot />}
          {activeTab === "learning" && <LearningCopilot userId={userId} />}

          {/* Suite CTA footer */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-center text-sm text-gray-500 mb-4">
              Part of the Nexus Security Suite
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-300">
                <Link to="/tools/nexusguard">NexusGuard</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-300">
                <Link to="/breach-sim">Breach Simulator</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-300">
                <Link to="/live-threat-dashboard">Threat Intel</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-300">
                <Link to="/tools/security-scanner">Security Audit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
