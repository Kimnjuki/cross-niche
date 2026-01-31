import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  BookOpen,
  Share2,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface LongFormArticleProps {
  article: Article;
  className?: string;
}

/**
 * Wired-style long-form cultural analysis article component
 * Features: Elegant typography, reading time, social sharing, immersive layout
 */
export function LongFormArticle({ article, className }: LongFormArticleProps) {
  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      {/* Hero Image */}
      <div className="relative aspect-[21/9] mb-12 rounded-lg overflow-hidden">
        <LazyImage
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{article.niche}</Badge>
          <span className="text-sm text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{article.readTime} min read</span>
          </div>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          {article.excerpt}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 pb-6 border-b">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{article.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{article.author}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
        <div
          className="text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }}
        />
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Social Share Bar */}
      <Card className="mt-12">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold mb-2">Share this article</div>
              <p className="text-sm text-muted-foreground">
                Help others discover this story
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

