import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { getPageMetadata } from "@/lib/seo/pageMetadata";
import { Badge } from "@/components/ui/badge";
import { RoadmapVoting } from "@/components/roadmap/RoadmapVoting";
import { ContentCard } from "@/components/ui/ContentCard";
import { Clock3, Trophy } from "lucide-react";

const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const },
};

export default function RoadmapV3() {
  const features = useQuery(api.roadmap.getRoadmapFeatures, {});
  const voteCounts = useQuery(api.roadmap.getVoteCounts, {});

  const timeline = useMemo(() => {
    return (features ?? [])
      .map((item) => {
        const score = voteCounts?.[item.slug] ?? 0;
        const tags = (item.tags ?? []).map((t: { name?: string }) => t?.name?.toLowerCase?.() ?? "");
        let status: "identified" | "in_progress" | "published" = "identified";
        if (tags.some((t: string) => t.includes("published") || t.includes("live"))) status = "published";
        else if (tags.some((t: string) => t.includes("progress") || t.includes("sprint")) || score > 3) status = "in_progress";
        return { ...item, score, status };
      })
      .sort((a, b) => (b.score - a.score) || ((b.publishedAt ?? 0) - (a.publishedAt ?? 0)));
  }, [features, voteCounts]);

  const topRequested = useMemo(() => timeline.slice(0, 5), [timeline]);
  const sprintList = useMemo(() => timeline.filter((f) => f.status === "in_progress").slice(0, 6), [timeline]);

  const meta = getPageMetadata('/roadmap');
  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={[
          "product roadmap",
          "feature voting",
          "transparent development",
          "AI tools",
          "cybersecurity training",
          "gaming features",
        ]}
        url={window.location.href}
        type="website"
      />

      <div className="bg-[#050505] text-[#F4F4F5]">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <motion.div
            {...FADE_UP}
            className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F12] p-8 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(112,0,255,0.35),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(193,255,0,0.15),transparent_40%)]" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">The Build</p>
              <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">Roadmap Intelligence</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                Verge-style product roadmap with live voting signals from Convex `roadmapVotes`.
                Priorities shift in real time as the community pushes features up.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="lg:col-span-8">
              <div className="relative pl-6">
                <div className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />
                <div className="space-y-6">
                  {timeline.map((feature) => (
                    <motion.div
                      key={feature.slug}
                      layout
                      initial={FADE_UP.initial}
                      animate={FADE_UP.animate}
                      transition={FADE_UP.transition}
                      className="relative"
                    >
                      <div className="absolute -left-[27px] top-6 h-3 w-3 rounded-full bg-grid-neon shadow-[0_0_10px_rgba(193,255,0,0.6)]" />
                      <ContentCard technical className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h2 className="font-display text-xl font-bold leading-snug tracking-tight">{feature.title}</h2>
                            <p className="text-sm leading-6 text-zinc-400">{feature.subtitle ?? feature.summary}</p>
                          </div>
                          <RoadmapVoting featureId={feature.slug} />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <StatusBadge status={feature.status} />
                          {(feature.tags ?? []).slice(0, 4).map((tag: { _id: string; name: string }) => (
                            <Badge key={tag._id} variant="outline" className="border-white/15 text-zinc-300">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                          <span className="font-mono">votes: {feature.score}</span>
                          <Link to={`/roadmap/${feature.slug}`} className="text-grid-neon hover:underline">
                            Open feature
                          </Link>
                        </div>
                      </ContentCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-4 lg:col-span-4">
              <ContentCard className="p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Clock3 className="h-4 w-4 text-grid-neon" />
                  Current Sprints
                </div>
                <ul className="space-y-2">
                  {sprintList.length === 0 ? (
                    <li className="text-sm text-zinc-500">No sprint-tagged items yet.</li>
                  ) : sprintList.map((item) => (
                    <li key={item.slug} className="text-sm text-zinc-300">
                      <Link to={`/roadmap/${item.slug}`} className="hover:text-grid-neon">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ContentCard>

              <ContentCard className="p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Trophy className="h-4 w-4 text-[#7000FF]" />
                  Top Requested
                </div>
                <ol className="space-y-2">
                  {topRequested.map((item, idx) => (
                    <li key={item.slug} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-zinc-400">#{idx + 1}</span>
                      <Link to={`/roadmap/${item.slug}`} className="flex-1 truncate text-zinc-200 hover:text-grid-neon">
                        {item.title}
                      </Link>
                      <span className="font-mono text-zinc-500">{item.score}</span>
                    </li>
                  ))}
                </ol>
              </ContentCard>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: "identified" | "in_progress" | "published" }) {
  if (status === "published") {
    return <Badge className="bg-[#7000FF] text-white">published</Badge>;
  }
  if (status === "in_progress") {
    return <Badge className="border border-grid-neon bg-transparent text-grid-neon shadow-[0_0_8px_rgba(193,255,0,0.5)]">in_progress</Badge>;
  }
  return <Badge variant="outline" className="border-white/15 text-zinc-400">identified</Badge>;
}
