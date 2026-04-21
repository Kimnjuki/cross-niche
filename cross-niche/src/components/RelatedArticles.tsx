import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';

export function RelatedArticles({ currentSlug, category }: { currentSlug: string; category: string }) {
  // Use existing API to get related content by category/niche
  const related = useQuery(api.content.getByNicheId, { nicheId: category === 'tech' ? 1 : category === 'security' ? 2 : 3, limit: 10 });
  const filtered = related?.filter(a => a.slug !== currentSlug).slice(0, 3);

  if (!filtered?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">Related Articles</h2>
      <div className="grid gap-4">
        {filtered.map(article => (
          <Link key={article.slug} to={`/article/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
