import { useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { getPageMetadata } from "@/lib/seo/pageMetadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard } from "@/components/ui/ContentCard";
import { useGuides } from "@/hooks/useGuides";
import { useGuideProgress } from "@/hooks/useGuideProgress";
import { api } from "../../convex/_generated/api";
import { BookOpen, Clock, Filter, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Tutorials() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [platform, setPlatform] = useState<string>("all");
  const [niche, setNiche] = useState<"all" | "tech" | "security" | "gaming">("all");
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { guides, isLoading } = useGuides();
  const ratings = useQuery(api.securityRatings.list, { limit: 100 }) ?? [];
  const stepContainerRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return guides.filter((g) => {
      const q = query.toLowerCase();
      const qOk =
        q.length === 0 ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);
      const dOk = difficulty === "all" || g.difficulty === difficulty;
      const pOk = platform === "all" || g.platform.includes(platform);
      const nOk = niche === "all" || g.niche === niche;
      return qOk && dOk && pOk && nOk;
    });
  }, [guides, query, difficulty, platform, niche]);

  const selectedGuide = useMemo(() => {
    if (filtered.length === 0) return null;
    return filtered.find((g) => g.id === activeGuideId) ?? filtered[0];
  }, [filtered, activeGuideId]);

  const { completedSteps, markStepComplete } = useGuideProgress(selectedGuide?.id ?? "");
  const progressPercent = selectedGuide ? Math.round((completedSteps.length / selectedGuide.steps.length) * 100) : 0;

  const platforms = useMemo(() => {
    const set = new Set<string>();
    guides.forEach((g) => g.platform.forEach((p) => set.add(p)));
    return ["all", ...Array.from(set)];
  }, [guides]);

  const scoreByGuideTitle = useMemo(() => {
    const map = new Map<string, number>();
    ratings.forEach((r) => {
      if (r.gameTitle) map.set(r.gameTitle.toLowerCase(), r.nexusSecurityScore);
    });
    return map;
  }, [ratings]);

  const handleStepScroll = () => {
    const parent = stepContainerRef.current;
    if (!parent) return;
    const rows = Array.from(parent.querySelectorAll("[data-step-index]")) as HTMLElement[];
    const idx = rows.findIndex((el) => el.getBoundingClientRect().top - parent.getBoundingClientRect().top > 12);
    setActiveStep(Math.max(0, (idx === -1 ? rows.length : idx) - 1));
  };

  return (
    <Layout>
      <SEOHead
        title={getPageMetadata('/tutorials').title}
        description={getPageMetadata('/tutorials').description}
        keywords={['tech tutorials', 'how-to guides', 'step-by-step tutorials', 'tech fixes', 'security tutorials', 'gaming tutorials']}
        url={window.location.href}
        type="website"
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <motion.div {...FADE_UP} className="mb-8 rounded-2xl border border-white/10 bg-[#0F0F12] p-6 md:p-8">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight">Tutorial Intelligence Grid</h1>
            <p className="mt-4 text-base leading-7 text-zinc-400">Wired-inspired guides with Convex progress + security scoring.</p>
          </motion.div>

          <div className="sticky top-16 z-30 mb-6 overflow-hidden rounded-xl border border-white/10 bg-[#0F0F12]">
            <div className="flex items-center justify-between px-4 py-2 text-xs font-mono text-zinc-400">
              <span>guideProgress</span>
              <span>{progressPercent}%</span>
            </div>
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="h-2 bg-gradient-to-r from-[#7000FF] to-[#C1FF00]"
            />
          </div>

          <div className="mb-4 space-y-3">
            <Input
              placeholder="Search tutorials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-white/10 bg-black/30"
            />
            <Tabs value={niche} onValueChange={(v) => setNiche(v as typeof niche)}>
              <TabsList className="grid w-full max-w-md grid-cols-4 bg-black/40">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tech">Tech</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="gaming">Gaming</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["all", "beginner", "intermediate", "advanced"].map((item) => (
                <Chip
                  key={item}
                  active={difficulty === item}
                  onClick={() => setDifficulty(item as typeof difficulty)}
                  label={item}
                />
              ))}
              {platforms.map((item) => (
                <Chip key={item} active={platform === item} onClick={() => setPlatform(item)} label={item} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <section className="xl:col-span-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((guide) => {
                  const score = scoreByGuideTitle.get(guide.title.toLowerCase());
                  return (
                    <ContentCard
                      key={guide.id}
                      className={cn(
                        "group cursor-pointer p-0",
                        selectedGuide?.id === guide.id && "ring-1 ring-[#C1FF00]"
                      )}
                      onClick={() => setActiveGuideId(guide.id)}
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => setActiveGuideId(guide.id)}
                      >
                        <div className="h-36 bg-[radial-gradient(circle_at_center,rgba(193,255,0,0.2),transparent_60%),linear-gradient(135deg,#16161a,#0b0b0d)]" />
                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge variant="outline" className="border-white/15 text-zinc-300">{guide.difficulty}</Badge>
                            <Badge variant="outline" className="border-white/15 text-zinc-300">{guide.niche}</Badge>
                          </div>
                          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight">{guide.title}</h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{guide.description}</p>
                          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {guide.readTime}m</span>
                            <motion.span
                              initial={{ opacity: 0.6 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              className="text-grid-neon"
                            >
                              {score ? `Security ${score}` : "No score"}
                            </motion.span>
                          </div>
                        </div>
                      </button>
                    </ContentCard>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-4 xl:col-span-4">
              <ContentCard className="p-4">
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
                  <BookOpen className="h-4 w-4 text-grid-neon" />
                  Table of Contents
                </h2>
                {selectedGuide ? (
                  <ul className="space-y-1">
                    {selectedGuide.steps.map((step, idx) => (
                      <li key={`${selectedGuide.id}-${idx}`}>
                        <button
                          type="button"
                          className={cn(
                            "w-full rounded px-2 py-1 text-left text-sm",
                            activeStep === idx ? "bg-white/10 text-grid-neon" : "text-zinc-300"
                          )}
                        >
                          {idx + 1}. {step}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500">Select a guide to view steps.</p>
                )}
              </ContentCard>

              <ContentCard className="p-4">
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
                  <Shield className="h-4 w-4 text-[#7000FF]" />
                  Guide Steps
                </h2>
                {selectedGuide ? (
                  <div
                    ref={stepContainerRef}
                    onScroll={handleStepScroll}
                    className="max-h-[360px] space-y-2 overflow-auto pr-1"
                  >
                    {selectedGuide.steps.map((step, idx) => (
                      <button
                        key={`${selectedGuide.id}-step-${idx}`}
                        type="button"
                        data-step-index={idx}
                        onClick={() => markStepComplete(idx, selectedGuide.steps.length)}
                        className={cn(
                          "w-full rounded-lg border border-white/10 p-2 text-left text-sm",
                          completedSteps.includes(idx) && "border-grid-neon/70 bg-grid-neon/10"
                        )}
                      >
                        <span className="mr-2 font-mono text-xs text-zinc-500">#{idx + 1}</span>
                        {step}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No guide selected.</p>
                )}
              </ContentCard>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={cn(
        "rounded-full border-white/20 bg-black/40 capitalize text-zinc-300",
        active && "border-grid-neon/50 bg-grid-neon/15 text-grid-neon"
      )}
      onClick={onClick}
    >
      <Filter className="mr-2 h-3 w-3" />
      {label}
    </Button>
  );
}

