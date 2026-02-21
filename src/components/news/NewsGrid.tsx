import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type NewsRow = {
  _id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  imageUrl?: string;
  publishedAt: number;
};

function sourceAccentClasses(source: string | null | undefined) {
  const normalized = (source ?? "").toLowerCase();
  const isTechCrunch = normalized.includes("techcrunch");
  const isWired = normalized.includes("wired");

  return {
    isTechCrunch,
    isWired,
    card: cn(
      "group relative overflow-hidden border bg-card/60 backdrop-blur-sm transition-colors",
      isTechCrunch && "border-[2px] border-[#39FF14]",
      !isTechCrunch && "border-border/70 hover:border-border"
    ),
    title: cn(
      "text-balance text-foreground font-bold tracking-tight",
      isWired ? "font-serif" : "font-display"
    ),
    excerpt: cn(
      "text-sm text-muted-foreground leading-relaxed",
      isWired ? "font-serif" : "font-body"
    ),
  };
}

function bentoSpan(index: number) {
  if (index === 0) {
    return "col-span-12 md:col-span-7 lg:col-span-8 row-span-2";
  }
  if (index === 1) {
    return "col-span-12 md:col-span-5 lg:col-span-4 row-span-1";
  }
  if (index === 2) {
    return "col-span-12 md:col-span-5 lg:col-span-4 row-span-1";
  }
  if (index === 3) {
    return "col-span-12 md:col-span-7 lg:col-span-4 row-span-1";
  }
  return "col-span-12 md:col-span-6 lg:col-span-4";
}

export function NewsGrid({
  limit = 12,
  className,
  title = "Nexus Intelligence",
  excludeUrls = [],
}: {
  limit?: number;
  className?: string;
  title?: string;
  excludeUrls?: string[];
}) {
  const items = useQuery(api.articles.getLatest, { limit, excludeUrls });

  const isLoading = items === undefined;
  const sliced: NewsRow[] = (items ?? []) as any;

  return (
    <section className={cn("py-10", className)} aria-label={title}>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold tracking-tight text-foreground text-2xl md:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Modular headlines in a 12-column bento grid.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "col-span-12 md:col-span-6 lg:col-span-4 h-[220px] rounded-xl border border-border/60 bg-muted/20 animate-pulse",
                i === 0 && "md:col-span-7 lg:col-span-8 h-[320px]"
              )}
            />
          ))}
        </div>
      ) : sliced.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No news items yet. Run ingestion and try again.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 grid-flow-dense auto-rows-[220px]">
          {sliced.map((item, index) => {
            const accent = sourceAccentClasses(item.source);

            return (
              <a
                key={String(item._id)}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  accent.card,
                  "rounded-xl p-4 flex flex-col",
                  bentoSpan(index)
                )}
                aria-label={item.title}
              >
                {item.imageUrl && (
                  <div className="relative rounded-lg overflow-hidden mb-3 h-28 md:h-32">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mb-2">
                  <span
                    className={cn(
                      "text-[11px] font-semibold tracking-[0.18em] uppercase",
                      accent.isTechCrunch ? "text-[#39FF14]" : "text-muted-foreground"
                    )}
                  >
                    {item.source}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className={cn(accent.title, "text-base md:text-lg line-clamp-2")}>{item.title}</h3>
                <p className={cn(accent.excerpt, "mt-2 line-clamp-3")}>{item.summary}</p>

                <div className="mt-auto pt-3 text-xs text-muted-foreground">
                  {new Date(item.publishedAt).toLocaleString()}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
