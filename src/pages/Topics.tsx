import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { TrendingTopicsWidget } from '@/components/home/TrendingTopicsWidget';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ArticleCard } from '@/components/articles/ArticleCard';

// High-volume keywords organized by category
const keywordCategories = {
  'Artificial Intelligence & Machine Learning': [
    { keyword: 'artificial intelligence', volume: '350K', href: '/tech?q=artificial+intelligence' },
    { keyword: 'machine learning', volume: '350K', href: '/tech?q=machine+learning' },
    { keyword: 'AI technology', volume: 'High', href: '/tech?q=ai' },
    { keyword: 'deep learning', volume: 'High', href: '/tech?q=deep+learning' },
  ],
  'Cybersecurity & Privacy': [
    { keyword: 'cybersecurity', volume: '150K', href: '/security?q=cybersecurity' },
    { keyword: 'cyber security', volume: '110K', href: '/security?q=cyber+security' },
    { keyword: 'data privacy', volume: '110K', href: '/security?q=data+privacy' },
    { keyword: 'network security', volume: '9.9K', href: '/security?q=network+security' },
    { keyword: 'cyber security news', volume: 'High', href: '/security?filter=latest' },
    { keyword: 'cybersecurity threats latest', volume: 'High', href: '/security?filter=threats' },
  ],
  'Cloud & Infrastructure': [
    { keyword: 'cloud computing', volume: '250K', href: '/tech?q=cloud+computing' },
    { keyword: 'big data', volume: '180K', href: '/tech?q=big+data' },
    { keyword: 'internet of things', volume: '200K', href: '/tech?q=iot' },
  ],
  'Emerging Technologies': [
    { keyword: 'blockchain', volume: '140K', href: '/tech?q=blockchain' },
    { keyword: 'quantum computing', volume: '70K', href: '/tech?q=quantum+computing' },
    { keyword: 'robotics', volume: '150K', href: '/tech?q=robotics' },
    { keyword: 'virtual reality', volume: '120K', href: '/gaming?q=virtual+reality' },
  ],
  'Gaming & Entertainment': [
    { keyword: 'gaming', volume: '200K', href: '/gaming' },
    { keyword: 'gaming news', volume: 'High', href: '/gaming?filter=latest' },
    { keyword: 'gaming hardware', volume: 'High', href: '/gaming?q=hardware' },
  ],
  'Tech News & Trends': [
    { keyword: 'latest tech news', volume: '14.8K', href: '/tech?filter=latest' },
    { keyword: 'technology trends', volume: '14.8K', href: '/tech?filter=trends' },
    { keyword: 'tech innovations 2026', volume: 'High', href: '/tech?filter=innovations' },
  ],
};

export default function Topics() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: allContent } = usePublishedContent(50);
  const allArticles = allContent ? mapContentToArticles(allContent) : [];

  // Filter articles by keyword if query exists
  const filteredArticles = query
    ? allArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <Layout>
      <SEOHead
        title="Technology Topics & Keywords - The Grid Nexus"
        description="Explore trending technology topics including artificial intelligence, machine learning, cybersecurity, cloud computing, gaming, blockchain, and more. Find the latest news and insights on high-volume search keywords."
        keywords={[
          'artificial intelligence',
          'machine learning',
          'cybersecurity',
          'cloud computing',
          'gaming',
          'blockchain',
          'robotics',
          'technology trends',
          'tech news',
          'data privacy',
          'quantum computing',
          'virtual reality',
          'internet of things',
          'big data',
          'network security'
        ]}
        url={window.location.href}
        type="website"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-4">
            Technology Topics & Keywords
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore high-volume search keywords and trending topics in technology, cybersecurity, and gaming. 
            Find the latest news, insights, and expert analysis on the topics that matter most.
          </p>
        </div>

        {query ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-2xl">
                Results for "{query}"
              </h2>
              <Badge variant="outline">{filteredArticles.length} articles</Badge>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No articles found for "{query}". Try a different keyword.
                  </p>
                  <Link to="/topics" className="text-primary hover:underline">
                    Browse all topics →
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(keywordCategories).map(([category, keywords]) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((item, index) => (
                      <Link
                        key={index}
                        to={`/topics?q=${encodeURIComponent(item.keyword)}`}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <Hash className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                        <span className="text-sm font-medium group-hover:text-primary">
                          {item.keyword}
                        </span>
                        {item.volume && (
                          <Badge variant="secondary" className="text-xs ml-1">
                            {item.volume}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <TrendingTopicsWidget />
          </div>
        )}
      </div>
    </Layout>
  );
}

