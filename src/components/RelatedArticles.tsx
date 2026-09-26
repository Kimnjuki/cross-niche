import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';
import { mockArticles } from '@/data/mockData';

const NICHE_ID_BY_CATEGORY: Record<string, number> = { tech: 1, security: 2, gaming: 3 };

interface RelatedItem {
  slug: string;
  title: string;
}

export function RelatedArticles({ currentSlug, category }: { currentSlug: string; category: string }) {
  const related = useQuery(api.content.getByNicheId, {
    nicheId: NICHE_ID_BY_CATEGORY[category] ?? 3,
    limit: 10,
  });

  // Real CMS rows when they exist. The previous fallback was a hardcoded list of
  // six slugs — including the retired "mobile-gaming-security-guide-ios-android"
  // alias — so whenever the query came back empty (which is the norm while the
  // CMS row is missing) the page rendered links to articles that do not exist.
  const items = ((): RelatedItem[] => {
    const fromCms: RelatedItem[] = (related ?? [])
      .filter((a) => a?.slug && a.slug !== currentSlug)
      .slice(0, 3)
      .map((a) => ({ slug: String(a.slug), title: String(a.title ?? a.slug) }));
    if (fromCms.length > 0) return fromCms;

    return mockArticles
      .filter((a) => a?.niche === category && a?.slug && a.slug !== currentSlug)
      .slice(0, 3)
      .map((a) => ({ slug: String(a.slug), title: String(a.title ?? a.slug) }));
  })();

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">Related Articles</h2>
      <div className="grid gap-4">
        {items.map(article => (
          <Link key={article.slug} to={`/article/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

