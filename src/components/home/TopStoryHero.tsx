/**
 * Verge / Ars / WIRED style: full-width hero for top story.
 * 60–70vh, large headline (48–72px), gradient overlay, reverse-chronological lead.
 */

import { Article } from '@/types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import { Clock, User } from 'lucide-react';
import { formatRelativeTime } from '@/lib/timeUtils';

const nicheStyles: Record<string, { badge: string; label: string }> = {
  tech: { badge: 'bg-tech/90 text-tech-foreground', label: 'Innovate' },
  security: { badge: 'bg-security/90 text-security-foreground', label: 'Secured' },
  gaming: { badge: 'bg-gaming/90 text-gaming-foreground', label: 'Play' },
};

interface TopStoryHeroProps {
  article: Article | null | undefined;
}

export function TopStoryHero({ article }: TopStoryHeroProps) {
  if (!article) return null;
  const style = nicheStyles[article.niche] ?? nicheStyles.tech;
  const articleId = (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';

  return (
    <section className="relative overflow-hidden min-h-[60vh] max-h-[70vh] flex flex-col" aria-label="Top story">
      <Link to={`/article/${article.slug ?? article.id ?? articleId}`} className="block flex-1 min-h-0 group">
        <div className="absolute inset-0">
          <LazyImage
            src={article.imageUrl}
            priority
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            width={1920}
            height={1080}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            aria-hidden
          />
        </div>
        <div className="relative z-10 flex flex-col justify-end min-h-[60vh] max-h-[70vh] p-6 md:p-12 container mx-auto">
          <div className="max-w-4xl">
            <Badge className={style.badge + ' mb-4'}>{style.label}</Badge>
            <h1 className="font-display font-bold text-hero leading-tight text-white drop-shadow-lg mb-4 line-clamp-3">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 line-clamp-2 mb-4 drop-shadow-md max-w-2xl">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <Link to={`/author/${authorSlug(article.author)}`} className="hover:underline">{article.author}</Link>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </span>
              <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
