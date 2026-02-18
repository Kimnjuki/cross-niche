import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoadmapVoting } from "@/components/roadmap/RoadmapVoting";
import { ROADMAP_PHASES } from "@/lib/roadmapData";

export default function RoadmapV3() {
  const features = useQuery(api.roadmap.getRoadmapFeatures, {});

  const bySlug = useMemo(() => {
    const map = new Map<string, any>();
    for (const f of features ?? []) {
      if (f?.slug) map.set(f.slug as string, f);
    }
    return map;
  }, [features]);

  return (
    <Layout>
      <SEOHead
        title="Product Roadmap | Vote on Features | The Grid Nexus"
        description="Shape the future of The Grid Nexus. Vote on upcoming AI tools, cybersecurity simulators, gaming features, and more. Real-time transparent product development."
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Product Roadmap</h1>
            <p className="text-muted-foreground text-lg">
              Vote on what we build next. Every vote updates the roadmap in real time.
            </p>
          </div>

          <div className="space-y-10">
            {ROADMAP_PHASES.map((phase) => (
              <section key={phase.phase} className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Phase {phase.phase}: {phase.title}</h2>
                    <p className="text-sm text-muted-foreground">{phase.features.length} features</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phase.features.map((seed) => {
                    const doc = bySlug.get(seed.contentSlug);
                    const isPublished = !!doc;

                    return (
                      <Card key={seed.featureId} className="relative overflow-hidden">
                        <CardHeader className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">
                                {doc?.title ?? seed.name}
                              </CardTitle>
                              <CardDescription>
                                {doc?.subtitle ?? seed.tagline}
                              </CardDescription>
                            </div>
                            <RoadmapVoting featureId={seed.featureId} />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{seed.category}</Badge>
                            {seed.tags.map((t) => (
                              <Badge key={t} variant="outline">{t}</Badge>
                            ))}
                            {!isPublished && <Badge variant="destructive">Not seeded</Badge>}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {doc?.summary ?? seed.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/roadmap/${seed.contentSlug}`}>View details</Link>
                            </Button>

                            {doc?.isPremium && (
                              <Badge variant="secondary">Premium</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
