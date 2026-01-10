import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  BookOpen,
  Share2,
  Bookmark,
  Quote,
  ArrowRight,
  Users,
  TrendingUp
} from 'lucide-react';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface IndustryNarrativeProps {
  article: Article;
  relatedArticles?: Article[];
  className?: string;
}

/**
 * Polygon-style industry narrative article component
 * Features: Storytelling format, industry context, related narratives, immersive reading
 */
export function IndustryNarrative({ article, relatedArticles = [], className }: IndustryNarrativeProps) {
  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="relative aspect-[21/9] mb-8 rounded-lg overflow-hidden">
          <LazyImage
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge variant="secondary" className="mb-4">Industry Story</Badge>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>
          </div>
        </div>

        {/* Article Meta */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{article.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{article.author}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • {article.readTime} min read
              </div>
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
      </div>

      {/* Article Content */}
      <div className="prose prose-lg prose-slate max-w-none dark:prose-invert mb-12">
        <div
          className="text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }}
        />
      </div>

      {/* Pull Quote */}
      <Card className="my-12 border-l-4 border-primary bg-primary/5">
        <CardContent className="pt-6">
          <Quote className="h-8 w-8 text-primary mb-4" />
          <blockquote className="text-2xl font-semibold italic leading-relaxed">
            "The gaming industry is at an inflection point, where technology and culture
            converge in ways we've never seen before."
          </blockquote>
          <div className="mt-4 text-sm text-muted-foreground">
            — Industry Analyst, 2024
          </div>
        </CardContent>
      </Card>

      {/* Industry Context */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Industry Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Market Size</div>
              <div className="text-2xl font-bold">$180B</div>
              <div className="text-xs text-muted-foreground mt-1">Global gaming market</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Growth Rate</div>
              <div className="text-2xl font-bold">+8.2%</div>
              <div className="text-xs text-muted-foreground mt-1">Annual growth</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Active Players</div>
              <div className="text-2xl font-bold">3.2B</div>
              <div className="text-xs text-muted-foreground mt-1">Worldwide</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Narratives */}
      {relatedArticles.length > 0 && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Related Industry Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <a
                  key={related.id}
                  href={`/article/${related.id}`}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <LazyImage
                      src={related.imageUrl}
                      alt={related.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold group-hover:text-primary transition-colors mb-1">
                      {related.title}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {related.readTime} min read
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Author Bio */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{article.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-lg mb-1">{article.author}</div>
              <p className="text-muted-foreground mb-4">
                Industry journalist covering gaming, technology, and culture. 
                Writing about the intersection of entertainment and innovation.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Follow Author
                </Button>
                <Button variant="outline" size="sm">
                  View More Stories
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter CTA */}
      <Card className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="font-semibold text-lg mb-2">Stay Updated</div>
            <p className="text-muted-foreground mb-4">
              Get the latest industry narratives and deep dives delivered to your inbox
            </p>
            <Button>
              Subscribe to Newsletter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

