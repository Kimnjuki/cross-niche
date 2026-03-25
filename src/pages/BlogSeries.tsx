import { useMemo } from "react";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { getPageMetadata } from "@/lib/seo/pageMetadata";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/ui/ContentCard";
import { useAIPulse } from "@/hooks/useAIPulse";
import { usePublishedContent } from "@/hooks/useContent";
import { mapContentToArticles } from "@/lib/contentMapper";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Clock3, MessageCircle } from "lucide-react";

const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const },
};

export default function BlogSeries() {
  const { data: contentRows } = usePublishedContent(40);
  const articles = useMemo(() => mapContentToArticles(contentRows ?? []), [contentRows]);
  const liveWire = useQuery(api.articles.getLatest, { limit: 24 }) ?? [];
  const { items: aiUpdates } = useAIPulse();

  const hero = articles[0];
  const heroAi = aiUpdates[0];

  const meta = getPageMetadata('/blog-series');
  return (
    <Layout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={['blog series', 'tech articles', 'gaming articles', 'cybersecurity articles', 'tech blog', 'gaming blog']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-14">
          <motion.div {...FADE_UP} className="mb-8">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight">Nexus Intelligence / Live Wire</h1>
            <p className="mt-4 text-base leading-7 text-zinc-400">Modular masonry feed from `articles`, `aiUpdates`, and `content`.</p>
          </motion.div>

          {hero && (
            <motion.div {...FADE_UP} className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ContentCard className="overflow-hidden lg:col-span-2">
                <img src={hero.imageUrl} alt={hero.title} className="h-[360px] w-full object-cover" />
                <div className="p-4">
                  <Badge className="mb-2 bg-[#7000FF]">Nexus Intelligence</Badge>
                  <h2 className="font-display text-2xl font-bold leading-snug tracking-tight">{hero.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{hero.excerpt}</p>
                </div>
              </ContentCard>

              <ContentCard className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">AI Summary</h3>
                  {heroAi?.isHype && <Badge className="bg-[#C1FF00] text-black">High Priority</Badge>}
                </div>
                <p className="text-sm leading-6 text-zinc-300">{heroAi?.description ?? "Awaiting AI signal..."}</p>
                {heroAi?.futurePrediction?.prediction && (
                  <p className="mt-3 border-l-2 border-[#7000FF] pl-3 text-xs text-zinc-400">
                    {heroAi.futurePrediction.prediction}
                  </p>
                )}
              </ContentCard>
            </motion.div>
          )}

          <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
            {articles.slice(1, 16).map((article) => (
              <motion.div
                key={article.id}
                layout
                className="mb-4 break-inside-avoid"
                initial={FADE_UP.initial}
                animate={FADE_UP.animate}
                transition={FADE_UP.transition}
              >
                <ContentCard technical className="overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className="border-white/15 text-zinc-300">
                        Nexus Intelligence
                      </Badge>
                      <span className="font-mono text-xs text-zinc-500">{article.niche}</span>
                    </div>
                    <Link to={`/article/${article.slug ?? article.id}`} className="font-display text-lg font-semibold leading-snug tracking-tight hover:text-grid-neon">
                      {article.title}
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> 0 comments</span>
                      <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {article.readTime} min</span>
                    </div>
                  </div>
                </ContentCard>
              </motion.div>
            ))}

            {liveWire.slice(0, 12).map((row) => (
              <div key={row.url} className="mb-4 break-inside-avoid">
                <ContentCard className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge className="bg-white/10 text-zinc-200">Live Wire</Badge>
                    <span className="font-mono text-xs text-zinc-500">{new Date(row.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <a href={row.url} target="_blank" rel="noreferrer" className="font-display text-base font-semibold hover:text-grid-neon">
                    {row.title}
                  </a>
                  <p className="mt-2 text-sm text-zinc-400">{row.summary}</p>
                </ContentCard>
              </div>
            ))}

            {aiUpdates.filter((i) => i.hasBenchmarks).slice(0, 6).map((item) => (
              <div key={item.id} className="mb-4 break-inside-avoid">
                <ContentCard className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="border-[#7000FF]/40 text-[#bca3ff]">Benchmarks</Badge>
                    <span className="font-mono text-xs text-zinc-500">AI Update</span>
                  </div>
                  <h4 className="font-display text-base font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                  <div className="mt-3 space-y-1">
                    {(item.benchmarks ?? []).slice(0, 3).map((b) => (
                      <div key={b.name} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{b.name}</span>
                        <Sparkline value={Math.max(0, Math.min(100, Math.round(b.score)))} />
                      </div>
                    ))}
                  </div>
                </ContentCard>
              </div>
            ))}
          </div>
      </div>
    </Layout>
  );
}

function Sparkline({ value }: { value: number }) {
  return (
    <div className="h-5 w-20 overflow-hidden rounded bg-white/10">
      <div className="h-full bg-gradient-to-r from-[#7000FF] to-[#C1FF00]" style={{ width: `${value}%` }} />
    </div>
  );
}

