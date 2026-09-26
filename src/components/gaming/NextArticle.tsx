import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import { mockArticles } from '@/data/mockData';
import type { Article } from '@/types';

/** Published timestamp in ms, or 0 when missing/unparseable. */
function publishedTime(article: Article): number {
  const raw = article.publishedAt;
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

interface NextArticleProps {
  /** Current article slug to exclude */
  currentSlug: string;
  /** Niche to pull from (gaming, security, tech) */
  niche: string;
  /**
   * Real articles to pick from (the page already loads these for the related
   * grid). The bundled demo rows are only used when nothing real is available.
   */
  articles?: Article[];
}

/**
 * "Next Article" component for the Article page bottom.
 * Shows the next article in the same niche.
 */
export function NextArticle({ currentSlug, niche, articles }: NextArticleProps) {
  const next = useMemo(() => {
    const pool = articles && articles.length > 0 ? articles : mockArticles;
    const candidates = pool.filter(
      (a) => a && a.slug && a.slug !== currentSlug && a.niche === niche,
    );
    if (candidates.length === 0) return null;
    // Most recent first — the previous comparator evaluated `publishedAt || 0`
    // and coerced the subtraction, so ordering was effectively random.
    return [...candidates].sort((a, b) => publishedTime(b) - publishedTime(a))[0];
  }, [articles, currentSlug, niche]);

  // Get the niche prefix path
  const nichePath = niche === 'security' ? '/security' : niche === 'gaming' ? '/gaming' : '/tech';

  if (!next) return null;

  return (
    <section className="border-t border-border pt-8 pb-4 mt-8" aria-label="Next article">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
          Keep reading
        </p>
        <Link
          to={`${nichePath}/${next.slug}`}
          className="group inline-flex items-center gap-3 text-xl font-display font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="group-hover:underline decoration-primary/30 underline-offset-4">
            {next.title}
          </span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        {next.excerpt && (
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto line-clamp-1">
            {next.excerpt}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {next.readTime} min
          </span>
          {/* Views are only shown when the CMS actually has a counter — the
              previous fallback printed "0 views" on every card. */}
          {typeof next.viewCount === 'number' && next.viewCount > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {next.viewCount.toLocaleString()} views
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

