import { Link } from 'react-router-dom';
import { TrendingUp, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// High-volume SEO keywords from the list
const trendingTopics = [
  { keyword: 'artificial intelligence', volume: '350K', href: '/tech?q=artificial+intelligence' },
  { keyword: 'machine learning', volume: '350K', href: '/tech?q=machine+learning' },
  { keyword: 'cybersecurity', volume: '150K', href: '/security?q=cybersecurity' },
  { keyword: 'cloud computing', volume: '250K', href: '/tech?q=cloud+computing' },
  { keyword: 'gaming', volume: '200K', href: '/gaming' },
  { keyword: 'blockchain', volume: '140K', href: '/tech?q=blockchain' },
  { keyword: 'robotics', volume: '150K', href: '/tech?q=robotics' },
  { keyword: 'latest tech news', volume: '14.8K', href: '/tech?filter=latest' },
  { keyword: 'technology trends', volume: '14.8K', href: '/tech?filter=trends' },
  { keyword: 'data privacy', volume: '110K', href: '/security?q=data+privacy' },
  { keyword: 'quantum computing', volume: '70K', href: '/tech?q=quantum+computing' },
  { keyword: 'virtual reality', volume: '120K', href: '/gaming?q=virtual+reality' },
  { keyword: 'internet of things', volume: '200K', href: '/tech?q=iot' },
  { keyword: 'big data', volume: '180K', href: '/tech?q=big+data' },
  { keyword: 'network security', volume: '9.9K', href: '/security?q=network+security' },
  { keyword: 'cyber security news', volume: 'High', href: '/security?filter=latest' },
  { keyword: 'gaming news', volume: 'High', href: '/gaming?filter=latest' },
  { keyword: 'tech innovations 2026', volume: 'High', href: '/tech?filter=innovations' },
  { keyword: 'cybersecurity threats latest', volume: 'High', href: '/security?filter=threats' },
];

export function TrendingTopicsWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Trending Topics</CardTitle>
            <p className="text-xs text-muted-foreground">High-volume search keywords</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic, index) => (
            <Link
              key={index}
              to={topic.href}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Hash className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-medium group-hover:text-primary">
                {topic.keyword}
              </span>
              {topic.volume && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {topic.volume}
                </Badge>
              )}
            </Link>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            to="/blog-series"
            className="text-sm text-primary hover:underline font-medium"
          >
            Explore all topics →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


