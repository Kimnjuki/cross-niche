/**
 * Nexus Intersection template (nexus-004): Nexus Summary + 1 Tech, 1 Security, 1 Gaming cards.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { NexusSummary } from '@/components/nexus/NexusSummary';
import { Cpu, Shield, Gamepad2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';
import { LazyImage } from '@/components/ui/lazy-image';
import { getPlaceholderByNiche } from '@/lib/placeholderImages';

interface NexusIntersectionTemplateProps {
  tech: Article | null;
  security: Article | null;
  gaming: Article | null;
  commonKeyword: string;
  isLoading: boolean;
  error: boolean;
  className?: string;
}

const nicheStyles = {
  tech: { badge: 'bg-tech/10 text-tech border-tech/20', accent: 'hover:border-tech/40' },
  security: { badge: 'bg-security/10 text-security border-security/20', accent: 'hover:border-security/40' },
  gaming: { badge: 'bg-gaming/10 text-gaming border-gaming/20', accent: 'hover:border-gaming/40' },
};

function ArticleTile({ article, niche }: { article: Article | null | undefined; niche: 'tech' | 'security' | 'gaming' }) {
  if (!article) return null;
  const styles = nicheStyles[niche];
  const articleId = (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';
  return (
    <Link to={`/article/${article.slug ?? article.id ?? articleId}`}>
      <Card className={cn('overflow-hidden h-full transition-all border-2', styles.accent)}>
        <div className="aspect-video relative overflow-hidden bg-muted">
          <LazyImage
            src={article.imageUrl || getPlaceholderByNiche(article.niche, articleId)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <Badge className={cn('absolute top-2 left-2', styles.badge)}>
            {niche === 'tech' && <Cpu className="h-3 w-3 mr-1" />}
            {niche === 'security' && <Shield className="h-3 w-3 mr-1" />}
            {niche === 'gaming' && <Gamepad2 className="h-3 w-3 mr-1" />}
            {niche.charAt(0).toUpperCase() + niche.slice(1)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
          <span className="text-xs text-primary inline-flex items-center gap-1">
            Read article <ArrowRight className="h-3 w-3" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function NexusIntersectionTemplate({
  tech,
  security,
  gaming,
  commonKeyword,
  isLoading,
  error,
  className,
}: NexusIntersectionTemplateProps) {
  if (error) {
    return (
      <div className={cn('text-center py-12 text-muted-foreground', className)}>
        <p>Unable to load cross-section content. Try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      <NexusSummary
        tech={tech}
        security={security}
        gaming={gaming}
        commonKeyword={commonKeyword}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tech && <ArticleTile article={tech} niche="tech" />}
        {security && <ArticleTile article={security} niche="security" />}
        {gaming && <ArticleTile article={gaming} niche="gaming" />}
      </div>
    </div>
  );
}
