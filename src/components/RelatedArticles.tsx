import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Link } from 'react-router-dom';

export function RelatedArticles({ currentSlug, category }: { currentSlug: string; category: string }) {
  const related = useQuery(api.content.getByNicheId, { nicheId: category === 'tech' ? 1 : category === 'security' ? 2 : 3, limit: 10 });
  const filtered = related?.filter(a => a.slug !== currentSlug).slice(0, 3);

  const fallbackArticles = [
    { slug: 'gaming-pc-antivirus-best-2026', title: 'Best Antivirus for Gaming PCs in 2026' },
    { slug: 'minecraft-server-security-guide', title: 'Minecraft Server Security Guide' },
    { slug: 'steam-controller-security-risks-gamers', title: 'Steam Controller Security Risks' },
    { slug: 'router-security-gamers-2026', title: 'Router Security for Gamers' },
    { slug: 'game-account-security-anti-phishing-2026-gaming-platforms', title: 'Game Account Security Anti-Phishing' },
  ];

  const items =
    filtered && filtered.length > 0
      ? filtered
      : fallbackArticles.filter(a => a.slug !== currentSlug).slice(0, 3);

  if (!items.length) return null;

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
