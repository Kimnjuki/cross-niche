import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Article } from '@/types';

interface ProductReviewsSectionProps {
  articles?: Article[];
}

// Mock product reviews - in production, this would come from your content
const featuredReviews = [
  {
    title: 'NVIDIA RTX 5090 Review: The Future of Gaming Graphics',
    category: 'Hardware',
    rating: 4.8,
    product: 'NVIDIA RTX 5090',
    excerpt: 'Comprehensive review of the latest flagship GPU with DLSS 4.5 and GDDR7 memory.',
  },
  {
    title: 'Best Cybersecurity Tools 2026: Enterprise Solutions Compared',
    category: 'Software',
    rating: 4.6,
    product: 'Security Suites',
    excerpt: 'In-depth comparison of top enterprise cybersecurity platforms and their features.',
  },
  {
    title: 'PlayStation 6 vs Xbox Next: Next-Gen Console Battle',
    category: 'Gaming',
    rating: 4.7,
    product: 'Gaming Consoles',
    excerpt: 'Head-to-head comparison of the latest gaming consoles with performance benchmarks.',
  },
];

export function ProductReviewsSection({ articles }: ProductReviewsSectionProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gaming/10">
              <ShoppingBag className="h-6 w-6 text-gaming" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl">Product Reviews & Comparisons</h2>
              <p className="text-muted-foreground">Expert reviews of the latest tech, security tools, and gaming hardware</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/blog-series?category=reviews">
              View All Reviews
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredReviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{review.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{review.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg mb-2">{review.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{review.excerpt}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Product</p>
                    <p className="font-semibold">{review.product}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/blog-series?q=${encodeURIComponent(review.product)}`}>
                      Read Review
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles && articles.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-xl mb-4">Latest Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Expert Product Reviews</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Our team of experts provides in-depth reviews of the latest technology products, 
            cybersecurity tools, and gaming hardware. Get honest, detailed analysis to help you make informed decisions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Hardware Reviews</Badge>
            <Badge variant="outline">Software Comparisons</Badge>
            <Badge variant="outline">Gaming Gear</Badge>
            <Badge variant="outline">Security Tools</Badge>
            <Badge variant="outline">AI Products</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}


