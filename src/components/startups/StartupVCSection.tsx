import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Article } from '@/types';

interface StartupVCSectionProps {
  articles?: Article[];
}

// Mock startup/VC news - in production, this would come from your content
const mockStartupNews = [
  {
    title: 'AI Startup Raises $50M Series B for Enterprise Solutions',
    category: 'Funding',
    amount: '$50M',
    stage: 'Series B',
    timestamp: '2 hours ago',
  },
  {
    title: 'Cybersecurity Unicorn Valued at $2B in Latest Round',
    category: 'Valuation',
    amount: '$2B',
    stage: 'Unicorn',
    timestamp: '5 hours ago',
  },
  {
    title: 'Gaming Platform Secures $30M Seed Funding',
    category: 'Funding',
    amount: '$30M',
    stage: 'Seed',
    timestamp: '1 day ago',
  },
];

export function StartupVCSection({ articles }: StartupVCSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl">Startups & Venture Capital</h2>
              <p className="text-muted-foreground">Latest funding rounds, valuations, and startup news</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/tech?category=startups">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {mockStartupNews.map((news, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="gap-1">
                    <DollarSign className="h-3 w-3" />
                    {news.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{news.timestamp}</span>
                </div>
                <CardTitle className="text-lg">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">{news.amount}</p>
                    <p className="text-sm text-muted-foreground">{news.stage}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles && articles.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-xl mb-4">Related Startup Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? index} article={article} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Stay Updated on Startup Ecosystem</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest news on funding rounds, acquisitions, IPOs, and emerging startups in technology, 
            cybersecurity, and gaming sectors.
          </p>
          <Button asChild>
            <Link to="/tech?category=startups">
              Explore Startup News
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}








